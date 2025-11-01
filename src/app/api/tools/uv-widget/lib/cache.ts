import { metrics } from "@opentelemetry/api";

import { getCacheMode, getCacheRedisClient } from "./redis-client";

import type { UVWidgetPayload } from "./types";

const meter = metrics.getMeter("clarivum.api.tools");

const cacheHitCounter = meter.createCounter("clarivum.tools.uv_widget.cache.hit", {
  description: "Count of UV widget cache hits",
});

const cacheMissCounter = meter.createCounter("clarivum.tools.uv_widget.cache.miss", {
  description: "Count of UV widget cache misses",
});

const cacheStaleCounter = meter.createCounter("clarivum.tools.uv_widget.cache.stale", {
  description: "Count of UV widget stale cache uses",
});

const cacheStoreCounter = meter.createCounter("clarivum.tools.uv_widget.cache.store", {
  description: "Count of UV widget cache stores",
});

const cacheFallbackCounter = meter.createCounter("clarivum.tools.uv_widget.cache.fallback", {
  description: "Count of UV widget cache fallback operations",
});

type CacheRecord = {
  payload: UVWidgetPayload;
  expiresAt: number;
};

export type CacheLookupResult =
  | {
      status: "hit" | "stale";
      payload: UVWidgetPayload;
      source: "redis" | "memory";
      expiresAt: number;
    }
  | { status: "miss" };

const fallbackCache = new Map<string, CacheRecord>();

const allowStaleFallback =
  (process.env["UV_WIDGET_CACHE_ALLOW_STALE"] ?? "true").trim().toLowerCase() !== "false";

function clonePayload(payload: UVWidgetPayload): UVWidgetPayload {
  const sourceCoordinates = payload.meta.source_coordinates
    ? { ...payload.meta.source_coordinates }
    : undefined;

  return {
    ...payload,
    meta: {
      ...payload.meta,
      ...(sourceCoordinates ? { source_coordinates: sourceCoordinates } : {}),
    },
    fallback: { ...payload.fallback },
    next_steps: payload.next_steps.map((step) => ({ ...step })),
  };
}

function sanitizePayload(payload: UVWidgetPayload): UVWidgetPayload {
  const cloned = clonePayload(payload);
  if ("cache_status" in cloned.meta) {
    delete (cloned.meta as Record<string, unknown>)["cache_status"];
  }
  return cloned;
}

function buildResult(
  record: CacheRecord,
  status: "hit" | "stale",
  source: "redis" | "memory",
): CacheLookupResult {
  return {
    status,
    payload: clonePayload(record.payload),
    source,
    expiresAt: record.expiresAt,
  };
}

function readFallback(key: string, now: number): CacheLookupResult {
  const record = fallbackCache.get(key);
  if (!record) {
    return { status: "miss" };
  }

  if (record.expiresAt > now) {
    cacheHitCounter.add(1, { source: "memory" });
    return buildResult(record, "hit", "memory");
  }

  if (allowStaleFallback) {
    cacheStaleCounter.add(1, { source: "memory" });
    return buildResult(record, "stale", "memory");
  }

  return { status: "miss" };
}

export async function readCache(key: string): Promise<CacheLookupResult> {
  const now = Date.now();
  const redis = getCacheRedisClient();

  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CacheRecord;
        fallbackCache.set(key, parsed);

        if (parsed.expiresAt > now) {
          cacheHitCounter.add(1, { source: "redis" });
          return buildResult(parsed, "hit", "redis");
        }

        if (allowStaleFallback) {
          cacheStaleCounter.add(1, { source: "redis" });
          return buildResult(parsed, "stale", "redis");
        }

        return { status: "miss" };
      }
    } catch (error) {
      cacheFallbackCounter.add(1, { reason: "read_error" });
      console.warn(
        JSON.stringify({
          severity: "WARN",
          message: "uv_widget_cache_redis_read_failed",
          error: (error as Error).message,
        }),
      );
    }
  } else if (getCacheMode() === "redis") {
    cacheFallbackCounter.add(1, { reason: "missing_client" });
  }

  const fallbackResult = readFallback(key, now);
  if (fallbackResult.status === "miss") {
    cacheMissCounter.add(1);
  }
  return fallbackResult;
}

export async function writeCache(
  key: string,
  payload: UVWidgetPayload,
  ttlMs: number,
): Promise<void> {
  const expiresAt = Date.now() + ttlMs;
  const record: CacheRecord = {
    payload: sanitizePayload(payload),
    expiresAt,
  };

  fallbackCache.set(key, record);

  cacheStoreCounter.add(1, { source: "memory" });

  const redis = getCacheRedisClient();
  if (!redis) {
    if (getCacheMode() === "redis") {
      cacheFallbackCounter.add(1, { reason: "missing_client" });
    }
    return;
  }

  try {
    await redis.set(key, JSON.stringify(record), { px: ttlMs });
    cacheStoreCounter.add(1, { source: "redis" });
  } catch (error) {
    cacheFallbackCounter.add(1, { reason: "write_error" });
    console.warn(
      JSON.stringify({
        severity: "WARN",
        message: "uv_widget_cache_redis_write_failed",
        error: (error as Error).message,
      }),
    );
  }
}
