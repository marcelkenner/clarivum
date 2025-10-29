import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics/server/plausible", () => {
  return {
    forwardAnalyticsEventToPlausible: vi.fn().mockResolvedValue({ status: "sent" }),
  };
});

describe("UV widget analytics helpers", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sends load analytics events", async () => {
    const { recordUvWidgetLoad } = await import("@/app/api/tools/uv-widget/lib/analytics");
    const { forwardAnalyticsEventToPlausible } = await import("@/lib/analytics/server/plausible");

    recordUvWidgetLoad({
      input: {
        locale: "pl-PL",
        language: "pl",
        location: { latitude: 52.2297, longitude: 21.0122 },
      },
      result: {
        city_label: "Warszawa, PL",
        source: "Wttr.in",
        observed_at: new Date().toISOString(),
        uv_now: 5,
        uv_max_today: 6,
        risk_level: "moderate",
        risk_copy: "Nałóż SPF 50.",
        next_steps: [],
        fallback: {
          is_fallback_city: false,
          message: "fallback",
        },
        meta: {
          locale: "pl-PL",
          cache_ttl_seconds: 300,
          cache_status: "miss",
        },
      },
    });

    expect(forwardAnalyticsEventToPlausible).toHaveBeenCalledTimes(1);
    expect(forwardAnalyticsEventToPlausible).toHaveBeenCalledWith(
      expect.objectContaining({ name: "uv_widget_load" }),
    );
  });

  it("sends rate limited analytics events", async () => {
    const { recordUvWidgetRateLimited } = await import("@/app/api/tools/uv-widget/lib/analytics");
    const { forwardAnalyticsEventToPlausible } = await import("@/lib/analytics/server/plausible");

    recordUvWidgetRateLimited({
      input: {
        locale: "en-GB",
        language: "en",
        cityQuery: "Warsaw",
      },
      scope: "global",
      limit: 200,
      remaining: 0,
      retryAfterSeconds: 45,
    });

    expect(forwardAnalyticsEventToPlausible).toHaveBeenCalledWith(
      expect.objectContaining({ name: "uv_widget_rate_limited" }),
    );
  });
});
