import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ParsedRequestInput } from "@/app/api/tools/uv-widget/lib/types";

const SAMPLE_RESPONSE = {
  current_condition: [
    {
      uvIndex: "5.3",
      localObsDateTime: "2025-01-17 10:30 AM",
    },
  ],
  weather: [
    {
      date: "2025-01-17",
      uvIndex: "6.8",
      hourly: [
        { time: "0", uvIndex: "3" },
        { time: "1200", uvIndex: "6" },
        { time: "1500", uvIndex: "6.8" },
      ],
    },
  ],
  nearest_area: [
    {
      areaName: [{ value: "Warszawa" }],
      country: [{ value: "Poland" }],
      latitude: "52.2297",
      longitude: "21.0122",
      timezone: [{ offset: "1.0" }],
    },
  ],
};

const BASE_REQUEST: ParsedRequestInput = {
  locale: "pl-PL",
  language: "pl",
  location: { latitude: 50.0614, longitude: 19.9372 },
};

const COPY_FIXTURE = {
  riskCopy: {
    low: "UV jest niskie. SPF 30 wystarczy, ale pamiętaj o reaplikacji.",
    moderate: "Nałóż SPF 50 i powtarzaj co 2 godziny.",
    high: "UV jest wysokie - użyj SPF 50+ i unikaj słońca w południe.",
    very_high: "UV jest bardzo wysokie. Szukaj cienia i noś odzież ochronną.",
    extreme: "UV ekstremalne! Zostań w pomieszczeniu, jeśli możesz, i stosuj ochronę 360°.",
  },
  fallbackMessage:
    "Pokazujemy Warszawę. Udostępnij lokalizację, aby zobaczyć dane dla Twojego miasta.",
  nextSteps: [
    {
      label: "Kalkulator dawki SPF",
      href: "/skin/narzedzia/kalkulator-dawki-spf",
      cta_id: "spf-dose-calculator",
    },
    {
      label: "Timer reaplikacji SPF",
      href: "/skin/narzedzia/timer-reaplikacji",
      cta_id: "spf-reapply-timer",
    },
  ],
  source: "fallback" as const,
};

describe("UV Widget Manager", () => {
  let createUvWidgetManager: typeof import("@/app/api/tools/uv-widget/lib/manager").createUvWidgetManager;

  beforeEach(async () => {
    vi.resetModules();
    process.env["UV_WIDGET_CACHE_MODE"] = "memory";
    process.env["UV_WIDGET_CACHE_ALLOW_STALE"] = "true";
    process.env["UV_WIDGET_RATE_LIMIT_MODE"] = "memory";
    ({ createUvWidgetManager } = await import("@/app/api/tools/uv-widget/lib/manager"));
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-17T09:30:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete process.env["UV_WIDGET_CACHE_MODE"];
    delete process.env["UV_WIDGET_CACHE_ALLOW_STALE"];
    delete process.env["UV_WIDGET_RATE_LIMIT_MODE"];
  });

  it("maps Wttr response into widget payload", async () => {
    const fetchForecast = vi.fn().mockResolvedValue(SAMPLE_RESPONSE);
    const manager = createUvWidgetManager(
      {
        fetchForecast,
        now: () => Date.now(),
        loadCopy: vi.fn().mockResolvedValue(COPY_FIXTURE),
      },
      { cacheTtlMs: 300000 },
    );

    const payload = await manager.getPayload(BASE_REQUEST);

    expect(fetchForecast).toHaveBeenCalledTimes(1);
    expect(payload.city_label).toBe("Warszawa, Poland");
    expect(payload.uv_now).toBeCloseTo(5.3, 1);
    expect(payload.uv_max_today).toBeCloseTo(6.8, 1);
    expect(payload.risk_level).toBe("high");
    expect(payload.risk_copy).toContain("SPF");
    expect(payload.observed_at).toBe("2025-01-17T09:30:00.000Z");
    expect(payload.fallback.is_fallback_city).toBe(false);
    expect(payload.next_steps).toHaveLength(2);
    expect(payload.meta.cache_status).toBe("miss");
  });

  it("reuses cached value within TTL", async () => {
    const fetchForecast = vi.fn().mockResolvedValue(SAMPLE_RESPONSE);
    const manager = createUvWidgetManager(
      {
        fetchForecast,
        now: () => Date.now(),
        loadCopy: vi.fn().mockResolvedValue(COPY_FIXTURE),
      },
      { cacheTtlMs: 300000 },
    );

    const first = await manager.getPayload(BASE_REQUEST);
    const second = await manager.getPayload(BASE_REQUEST);

    expect(fetchForecast).toHaveBeenCalledTimes(1);
    expect(first.meta.cache_status).toBe("miss");
    expect(second.meta.cache_status).toBe("hit");
    expect(second.meta.cache_source).toBeDefined();
    expect(second.city_label).toBe(first.city_label);
    expect(second.uv_now).toBe(first.uv_now);
    expect(second.uv_max_today).toBe(first.uv_max_today);
  });

  it("returns fallback payload when upstream fails", async () => {
    const fetchForecast = vi.fn().mockRejectedValue(new Error("timeout"));
    const manager = createUvWidgetManager(
      {
        fetchForecast,
        now: () => Date.now(),
        loadCopy: vi.fn().mockResolvedValue(COPY_FIXTURE),
      },
      { cacheTtlMs: 300000 },
    );

    const payload = await manager.getPayload(BASE_REQUEST);

    expect(payload.city_label).toBe("Warszawa, PL");
    expect(payload.fallback.is_fallback_city).toBe(true);
    expect(payload.risk_level).toBe("low");
    expect(payload.meta.cache_status).toBe("miss");
  });

  it("serves stale payload when cache is expired and upstream fails", async () => {
    const fetchForecast = vi
      .fn()
      .mockResolvedValueOnce(SAMPLE_RESPONSE)
      .mockRejectedValueOnce(new Error("wttr outage"));
    const manager = createUvWidgetManager(
      {
        fetchForecast,
        now: () => Date.now(),
        loadCopy: vi.fn().mockResolvedValue(COPY_FIXTURE),
      },
      { cacheTtlMs: 1_000 },
    );

    const fresh = await manager.getPayload(BASE_REQUEST);
    expect(fresh.meta.cache_status).toBe("miss");

    vi.advanceTimersByTime(2_000);

    const fallback = await manager.getPayload(BASE_REQUEST);

    expect(fetchForecast).toHaveBeenCalledTimes(2);
    expect(fallback.meta.cache_status).toBe("stale");
    expect(fallback.meta.cache_source).toBeDefined();
    expect(fallback.city_label).toBe("Warszawa, Poland");
  });
});
