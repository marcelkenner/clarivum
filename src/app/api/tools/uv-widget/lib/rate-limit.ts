import { metrics } from "@opentelemetry/api";
import { Ratelimit } from "@upstash/ratelimit";

import { getRateLimitMode, getRateLimitRedisClient } from "./upstash-clients";

type Bucket = {
  tokens: number;
  resetAt: number;
};

type RateLimitSource = "upstash" | "memory";
export type RateLimitScope = "ip" | "global";

const WINDOW_MS = 60_000;

const MAX_REQUESTS_PER_WINDOW = Number.parseInt(
  process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"] ?? "30",
  10,
);

const GLOBAL_REQUESTS_PER_WINDOW = Number.parseInt(
  process.env["UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN"] ?? "0",
  10,
);

const meter = metrics.getMeter("clarivum.api.tools");

const rateLimitRequestCounter = meter.createCounter("clarivum.tools.uv_widget.rate_limit.total", {
  description: "Total UV widget rate limit evaluations",
});

const rateLimitBlockedCounter = meter.createCounter("clarivum.tools.uv_widget.rate_limit.blocked", {
  description: "Blocked UV widget requests due to rate limiting",
});

const rateLimitFallbackCounter = meter.createCounter(
  "clarivum.tools.uv_widget.rate_limit.fallback",
  {
    description: "Count of UV widget rate limiter fallback operations",
  },
);

const rateLimitRedis = getRateLimitRedisClient();
const useUpstash = getRateLimitMode() === "upstash";

const perIpLimiter =
  useUpstash && rateLimitRedis
    ? new Ratelimit({
        redis: rateLimitRedis,
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, "1 m"),
        prefix: "clarivum:uv-widget",
        analytics: true,
      })
    : null;

const globalLimiter =
  useUpstash && rateLimitRedis && GLOBAL_REQUESTS_PER_WINDOW > 0
    ? new Ratelimit({
        redis: rateLimitRedis,
        limiter: Ratelimit.slidingWindow(GLOBAL_REQUESTS_PER_WINDOW, "1 m"),
        prefix: "clarivum:uv-widget:global",
        analytics: true,
      })
    : null;

const memoryBuckets = new Map<string, Bucket>();
const memoryGlobalBucket = new Map<string, Bucket>();

type BaseRateLimitState = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  source: RateLimitSource;
  retryAfterSeconds?: number;
};

function evaluateInMemory(
  bucketStore: Map<string, Bucket>,
  key: string,
  maxPerWindow: number,
): BaseRateLimitState {
  const now = Date.now();
  const existing = bucketStore.get(key);

  if (!existing || existing.resetAt <= now) {
    bucketStore.set(key, { tokens: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      limit: maxPerWindow,
      remaining: Math.max(0, maxPerWindow - 1),
      resetAt: now + WINDOW_MS,
      source: "memory",
    };
  }

  if (existing.tokens >= maxPerWindow) {
    bucketStore.set(key, existing);
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      allowed: false,
      limit: maxPerWindow,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds,
      source: "memory",
    };
  }

  existing.tokens += 1;
  bucketStore.set(key, existing);

  return {
    allowed: true,
    limit: maxPerWindow,
    remaining: Math.max(0, maxPerWindow - existing.tokens),
    resetAt: existing.resetAt,
    source: "memory",
  };
}

async function evaluateScope(
  scope: RateLimitScope,
  identifier: string,
  limiter: Ratelimit | null,
  memoryStore: Map<string, Bucket>,
  limitPerWindow: number,
) {
  if (limitPerWindow <= 0) {
    return undefined;
  }

  rateLimitRequestCounter.add(1, { scope });

  if (limiter) {
    try {
      const result = await limiter.limit(identifier);

      result.pending.catch(() => undefined);

      if (result.success) {
        return {
          allowed: true,
          limit: result.limit,
          remaining: result.remaining,
          resetAt: result.reset,
          source: "upstash" as const,
        };
      }

      rateLimitBlockedCounter.add(1, { scope, source: "upstash" });
      const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

      return {
        allowed: false,
        limit: result.limit,
        remaining: 0,
        resetAt: result.reset,
        retryAfterSeconds,
        source: "upstash" as const,
      };
    } catch (error) {
      rateLimitFallbackCounter.add(1, { scope, reason: "upstash_error" });
      console.warn(
        JSON.stringify({
          severity: "WARN",
          message: "uv_widget_rate_limit_upstash_failed",
          scope,
          error: (error as Error).message,
        }),
      );
    }
  } else if (useUpstash) {
    rateLimitFallbackCounter.add(1, { scope, reason: "missing_client" });
  }

  const key = scope === "global" ? "__global__" : identifier;
  const fallbackResult = evaluateInMemory(memoryStore, key, limitPerWindow);

  if (!fallbackResult.allowed) {
    rateLimitBlockedCounter.add(1, { scope, source: "memory" });
  }

  return fallbackResult;
}

type RateLimitState = BaseRateLimitState & { scope: RateLimitScope };

export type RateLimitResult = {
  allowed: boolean;
  blockedScope?: RateLimitScope;
  retryAfterSeconds?: number;
  ip: RateLimitState;
  global?: RateLimitState;
};

export async function evaluateRateLimit(key: string): Promise<RateLimitResult> {
  const ipResultBase =
    (await evaluateScope("ip", key, perIpLimiter, memoryBuckets, MAX_REQUESTS_PER_WINDOW)) ??
    ({
      allowed: true,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: MAX_REQUESTS_PER_WINDOW,
      resetAt: Date.now() + WINDOW_MS,
      source: "memory" as const,
    } satisfies BaseRateLimitState);

  const ipResult: RateLimitState = { ...ipResultBase, scope: "ip" };

  const globalResultBase =
    (await evaluateScope(
      "global",
      "global",
      globalLimiter,
      memoryGlobalBucket,
      GLOBAL_REQUESTS_PER_WINDOW,
    )) ?? undefined;

  const globalResult: RateLimitState | undefined = globalResultBase
    ? { ...globalResultBase, scope: "global" }
    : undefined;

  const allowed = ipResult.allowed && (globalResult?.allowed ?? true);

  if (allowed) {
    const response: RateLimitResult = {
      allowed: true,
      ip: ipResult,
    };

    if (globalResult) {
      response.global = globalResult;
    }

    return response;
  }

  let blockingScope: RateLimitScope = "ip";
  if (ipResult.allowed && globalResult && !globalResult.allowed) {
    blockingScope = "global";
  }

  const blockingResult = blockingScope === "ip" ? ipResult : (globalResult as RateLimitState);

  const response: RateLimitResult = {
    allowed: false,
    blockedScope: blockingScope,
    ip: ipResult,
  };

  if (globalResult) {
    response.global = globalResult;
  }

  if (blockingResult.retryAfterSeconds !== undefined) {
    response.retryAfterSeconds = blockingResult.retryAfterSeconds;
  }

  return response;
}
