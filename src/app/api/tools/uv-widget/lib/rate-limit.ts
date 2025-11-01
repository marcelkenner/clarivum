import { metrics } from "@opentelemetry/api";

import { getRateLimitMode, getRateLimitRedisClient } from "./redis-client";

type Bucket = {
  tokens: number;
  resetAt: number;
};

type RateLimitSource = "redis" | "memory";
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

const memoryBuckets = new Map<string, Bucket>();
const memoryGlobalBucket = new Map<string, Bucket>();

const rateLimitMode = getRateLimitMode();
const redisKeyPrefix = `clarivum:uv-widget:${process.env["CLARIVUM_ENVIRONMENT"] ?? "unknown"}`;

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
local ttl = redis.call("PTTL", KEYS[1])

if current == 1 or ttl < 0 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
  ttl = tonumber(ARGV[1])
end

return { current, ttl }
`;

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

async function evaluateRedisScope(
  scope: RateLimitScope,
  identifier: string,
  limitPerWindow: number,
): Promise<BaseRateLimitState | undefined> {
  if (rateLimitMode !== "redis") {
    return undefined;
  }

  const redis = getRateLimitRedisClient();
  if (!redis) {
    rateLimitFallbackCounter.add(1, { scope, reason: "missing_client" });
    return undefined;
  }

  const now = Date.now();
  const key =
    scope === "global" ? `${redisKeyPrefix}:global` : `${redisKeyPrefix}:ip:${identifier}`;

  try {
    const result = await redis.eval(RATE_LIMIT_SCRIPT, [key], [WINDOW_MS]);

    if (Array.isArray(result) && result.length >= 2) {
      const currentCount = Number(result[0] ?? 0);
      const ttl = Number(result[1] ?? WINDOW_MS);
      const ttlMs = Number.isFinite(ttl) && ttl > 0 ? ttl : WINDOW_MS;
      const resetAt = now + ttlMs;

      if (currentCount <= limitPerWindow) {
        return {
          allowed: true,
          limit: limitPerWindow,
          remaining: Math.max(0, limitPerWindow - currentCount),
          resetAt,
          source: "redis",
        };
      }

      rateLimitBlockedCounter.add(1, { scope, source: "redis" });
      const retryAfterSeconds = Math.max(1, Math.ceil(ttlMs / 1000));

      return {
        allowed: false,
        limit: limitPerWindow,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
        source: "redis",
      };
    }

    rateLimitFallbackCounter.add(1, { scope, reason: "redis_unexpected_result" });
    console.warn(
      JSON.stringify({
        severity: "WARN",
        message: "uv_widget_rate_limit_redis_unexpected_result",
        scope,
        result,
      }),
    );
  } catch (error) {
    rateLimitFallbackCounter.add(1, { scope, reason: "redis_error" });
    console.warn(
      JSON.stringify({
        severity: "WARN",
        message: "uv_widget_rate_limit_redis_failed",
        scope,
        error: (error as Error).message,
      }),
    );
  }

  return undefined;
}

async function evaluateScope(
  scope: RateLimitScope,
  identifier: string,
  memoryStore: Map<string, Bucket>,
  limitPerWindow: number,
): Promise<BaseRateLimitState | undefined> {
  if (limitPerWindow <= 0) {
    return undefined;
  }

  rateLimitRequestCounter.add(1, { scope });

  const redisResult = await evaluateRedisScope(scope, identifier, limitPerWindow);
  if (redisResult) {
    return redisResult;
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
    (await evaluateScope("ip", key, memoryBuckets, MAX_REQUESTS_PER_WINDOW)) ??
    ({
      allowed: true,
      limit: MAX_REQUESTS_PER_WINDOW,
      remaining: MAX_REQUESTS_PER_WINDOW,
      resetAt: Date.now() + WINDOW_MS,
      source: "memory" as const,
    } satisfies BaseRateLimitState);

  const ipResult: RateLimitState = { ...ipResultBase, scope: "ip" };

  const globalResultBase =
    (await evaluateScope("global", "global", memoryGlobalBucket, GLOBAL_REQUESTS_PER_WINDOW)) ??
    undefined;

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
