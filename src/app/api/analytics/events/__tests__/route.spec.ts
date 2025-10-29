import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../route";

const originalEnv = { ...process.env };

describe("POST /api/analytics/events", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("returns 400 when payload is invalid", async () => {
    const request = new Request("http://localhost/api/analytics/events", {
      method: "POST",
      body: JSON.stringify({ name: "UnknownEvent" }),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it("returns 202 when Plausible configuration is missing", async () => {
    const body = {
      name: "WebVitalsMetric",
      props: { id: "metric-id", name: "LCP", value: 200, navigationType: "navigate" },
      url: "https://clarivum.example/",
    };

    const request = new Request("http://localhost/api/analytics/events", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(response.status).toBe(202);
  });

  it("returns 204 when Plausible accepts the event", async () => {
    process.env = { ...originalEnv };
    process.env["PLAUSIBLE_API_KEY"] = "key";
    process.env["PLAUSIBLE_DOMAIN"] = "clarivum.example";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 202,
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", fetchMock);

    const body = {
      name: "WebVitalsMetric",
      props: { id: "metric-id", name: "CLS", value: 0.01, navigationType: "navigate" },
      url: "https://clarivum.example/",
      referrer: "https://clarivum.example/",
    };

    const request = new Request("http://localhost/api/analytics/events", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    });

    const response = await POST(request);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(204);
  });
});
