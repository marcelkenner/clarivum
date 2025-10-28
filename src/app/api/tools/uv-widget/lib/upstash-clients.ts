import { Redis } from "@upstash/redis";

type RedisClient = Redis | null;

function normaliseMode(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "upstash";
}

function createRedis(url: string | undefined, token: string | undefined): RedisClient {
  if (!url || !token) {
    return null;
  }

  try {
    return new Redis({
      url,
      token,
    });
  } catch (error) {
    console.warn(
      JSON.stringify({
        severity: "WARN",
        message: "uv_widget_upstash_client_init_failed",
        error: (error as Error).message,
      }),
    );
    return null;
  }
}

const cacheMode = normaliseMode(process.env["UV_WIDGET_CACHE_MODE"]);

const cacheRedisClient: RedisClient =
  cacheMode === "upstash"
    ? createRedis(process.env["UPSTASH_CACHE_REST_URL"], process.env["UPSTASH_CACHE_REST_TOKEN"])
    : null;

if (cacheMode === "upstash" && !cacheRedisClient) {
  console.warn(
    JSON.stringify({
      severity: "WARN",
      message: "uv_widget_cache_upstash_disabled_missing_credentials",
    }),
  );
}

const rateLimitMode = normaliseMode(process.env["UV_WIDGET_RATE_LIMIT_MODE"]);

const rateLimitRedisClient: RedisClient =
  rateLimitMode === "upstash"
    ? createRedis(
        process.env["UPSTASH_RATELIMIT_REST_URL"],
        process.env["UPSTASH_RATELIMIT_REST_TOKEN"],
      )
    : null;

if (rateLimitMode === "upstash" && !rateLimitRedisClient) {
  console.warn(
    JSON.stringify({
      severity: "WARN",
      message: "uv_widget_rate_limit_upstash_disabled_missing_credentials",
    }),
  );
}

export function getCacheRedisClient(): RedisClient {
  return cacheRedisClient;
}

export function getCacheMode(): "upstash" | "memory" {
  return cacheMode === "memory" ? "memory" : "upstash";
}

export function getRateLimitRedisClient(): RedisClient {
  return rateLimitRedisClient;
}

export function getRateLimitMode(): "upstash" | "memory" {
  return rateLimitMode === "memory" ? "memory" : "upstash";
}
