import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("UV widget rate limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-17T09:30:00.000Z"));
    process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"] = "2";
    process.env["UV_WIDGET_RATE_LIMIT_MODE"] = "memory";
    process.env["UV_WIDGET_CACHE_MODE"] = "memory";
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"];
    delete process.env["UV_WIDGET_RATE_LIMIT_MODE"];
    delete process.env["UV_WIDGET_CACHE_MODE"];
  });

  it("falls back to in-memory limiter when Upstash is unavailable", async () => {
    vi.resetModules();
    const { evaluateRateLimit } = await import("@/app/api/tools/uv-widget/lib/rate-limit");

    const key = "127.0.0.1";

    const first = await evaluateRateLimit(key);
    const second = await evaluateRateLimit(key);
    const third = await evaluateRateLimit(key);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
    expect(third.source).toBe("memory");

    vi.advanceTimersByTime(60_000);

    const fourth = await evaluateRateLimit(key);
    expect(fourth.allowed).toBe(true);
    expect(fourth.source).toBe("memory");
    expect(fourth.remaining).toBeGreaterThanOrEqual(0);
  });
});
