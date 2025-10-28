import { metrics } from "@opentelemetry/api";
import { Ratelimit } from "@upstash/ratelimit";

import { getRateLimitMode, getRateLimitRedisClient } from "./upstash-clients";

type Bucket = {
  tokens: number;
  resetAt: number;
};

type RateLimitSource = "upstash" | "memory";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = Number.parseInt(
  process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"] ?? "30",
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

const rateLimiter =
  getRateLimitMode() === "upstash" && rateLimitRedis
    ? new Ratelimit({
        redis: rateLimitRedis,
        limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, "1 m"),
        prefix: "clarivum:uv-widget",
        analytics: true,
      })
    : null;

const memoryBuckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds?: number;
  limit: number;
  remaining: number;
  resetAt: number;
  source: RateLimitSource;
};

function evaluateInMemory(key: string): RateLimitResult {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryBuckets.set(key, { tokens: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetAt: now + WINDOW_MS,
      source: "memory",
    };
  }

  if (existing.tokens >= MAX_REQUESTS_PER_WINDOW) {
    memoryBuckets.set(key, existing);
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: retryAfterSeconds > 0 ? retryAfterSeconds : 1,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: 0,
      resetAt: existing.resetAt,
      source: "memory",
    };
  }

  existing.tokens += 1;
  memoryBuckets.set(key, existing);

  return {
    allowed: true,
    limit: MAX_REQUESTS_PER_WINDOW,
    remaining: MAX_REQUESTS_PER_WINDOW - existing.tokens,
    resetAt: existing.resetAt,
    source: "memory",
  };
}

export async function evaluateRateLimit(key: string): Promise<RateLimitResult> {
  rateLimitRequestCounter.add(1);

  if (rateLimiter) {
    try {
      const result = await rateLimiter.limit(key);

      result.pending.catch(() => undefined);

      if (result.success) {
        return {
          allowed: true,
          limit: result.limit,
          remaining: result.remaining,
          resetAt: result.reset,
          source: "upstash",
        };
      }

      rateLimitBlockedCounter.add(1, { source: "upstash" });
      const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return {
        allowed: false,
        retryAfterSeconds,
        limit: result.limit,
        remaining: 0,
        resetAt: result.reset,
        source: "upstash",
      };
    } catch (error) {
      rateLimitFallbackCounter.add(1, { reason: "upstash_error" });
      console.warn(
        JSON.stringify({
          severity: "WARN",
          message: "uv_widget_rate_limit_upstash_failed",
          error: (error as Error).message,
        }),
      );
    }
  } else if (getRateLimitMode() === "upstash") {
    rateLimitFallbackCounter.add(1, { reason: "missing_client" });
  }

  const fallbackResult = evaluateInMemory(key);
  if (!fallbackResult.allowed) {
    rateLimitBlockedCounter.add(1, { source: "memory" });
  }
  return fallbackResult;
}
