import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("UV widget rate limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-17T09:30:00.000Z"));
    process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"] = "2";
    process.env["UV_WIDGET_RATE_LIMIT_MODE"] = "memory";
    process.env["UV_WIDGET_CACHE_MODE"] = "memory";
    delete process.env["UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN"];
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"];
    delete process.env["UV_WIDGET_RATE_LIMIT_MODE"];
    delete process.env["UV_WIDGET_CACHE_MODE"];
    delete process.env["UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN"];
  });

  it("falls back to in-memory limiter when Redis is unavailable", async () => {
    vi.resetModules();
    const { evaluateRateLimit } = await import("@/app/api/tools/uv-widget/lib/rate-limit");

    const key = "127.0.0.1";

    const first = await evaluateRateLimit(key);
    const second = await evaluateRateLimit(key);
    const third = await evaluateRateLimit(key);

    expect(first.allowed).toBe(true);
    expect(first.ip.source).toBe("memory");
    expect(second.allowed).toBe(true);
    expect(second.ip.remaining).toBeGreaterThanOrEqual(0);
    expect(third.allowed).toBe(false);
    expect(third.blockedScope).toBe("ip");
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
    expect(third.ip.source).toBe("memory");

    vi.advanceTimersByTime(60_000);

    const fourth = await evaluateRateLimit(key);
    expect(fourth.allowed).toBe(true);
    expect(fourth.ip.source).toBe("memory");
    expect(fourth.ip.remaining).toBeGreaterThanOrEqual(0);
  });

  it("enforces global rate limit when configured", async () => {
    process.env["UV_WIDGET_RATE_LIMIT_PER_MIN"] = "100";
    process.env["UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN"] = "2";
    vi.resetModules();

    const { evaluateRateLimit } = await import("@/app/api/tools/uv-widget/lib/rate-limit");
    const key = "192.168.0.1";

    const first = await evaluateRateLimit(key);
    const second = await evaluateRateLimit(key);
    const third = await evaluateRateLimit("10.0.0.5");

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.blockedScope).toBe("global");
    expect(third.global?.remaining).toBe(0);
  });
});
