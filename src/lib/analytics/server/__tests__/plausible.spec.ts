import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { forwardAnalyticsEventToPlausible } from "../plausible";

const originalEnv = { ...process.env };

describe("forwardAnalyticsEventToPlausible", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("skips when PLAUSIBLE_API_KEY is missing", async () => {
    process.env["NEXT_PUBLIC_SITE_URL"] = "https://clarivum.example";

    const result = await forwardAnalyticsEventToPlausible({
      name: "WebVitalsMetric",
      props: {
        id: "test-id",
        name: "LCP",
        value: 123.45,
        navigationType: "navigate",
      },
      url: "https://clarivum.example/",
    });

    expect(result).toEqual({
      status: "skipped",
      reason: expect.stringContaining("PLAUSIBLE_API_KEY"),
    });
  });

  it("forwards the event to Plausible when configured", async () => {
    process.env["PLAUSIBLE_API_KEY"] = "test-api-key";
    process.env["PLAUSIBLE_DOMAIN"] = "clarivum.example";
    process.env["PLAUSIBLE_API_URL"] = "https://plausible.dev/api/event";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      text: () => Promise.resolve(""),
    });

    vi.stubGlobal("fetch", fetchMock);

    const payload = {
      name: "WebVitalsMetric" as const,
      props: {
        id: "metric-id",
        name: "LCP",
        value: 120.12,
        navigationType: "navigate",
      },
      url: "https://clarivum.example/",
      referrer: "https://clarivum.example/home",
    };

    const result = await forwardAnalyticsEventToPlausible(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://plausible.dev/api/event",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-key",
          "content-type": "application/json",
          "user-agent": "clarivum-web/1.0 (+https://clarivum.com)",
        }),
      }),
    );

    const [, requestInit] = fetchMock.mock.calls[0]!;
    const parsedBody = JSON.parse(requestInit.body as string);
    expect(parsedBody).toEqual({
      name: payload.name,
      domain: "clarivum.example",
      url: payload.url,
      referrer: payload.referrer,
      props: payload.props,
    });
    expect(result).toEqual({ status: "sent" });
  });

  it("returns failure when Plausible responds with an error", async () => {
    process.env["PLAUSIBLE_API_KEY"] = "test-api-key";
    process.env["PLAUSIBLE_DOMAIN"] = "clarivum.example";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("internal error"),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await forwardAnalyticsEventToPlausible({
      name: "WebVitalsMetric",
      props: {
        id: "metric-id",
        name: "CLS",
        value: 0.01,
        navigationType: "navigate",
      },
      url: "https://clarivum.example/",
    });

    expect(result.status).toBe("failed");
    if (result.status === "failed") {
      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("internal error");
    }
  });
});
