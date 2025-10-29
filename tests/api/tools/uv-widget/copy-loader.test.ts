import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __dangerous__resetCopyCache,
  getDefaultCopy,
  loadCopyBundle,
} from "@/app/api/tools/uv-widget/lib/copy-loader";

describe("UV widget copy loader", () => {
  beforeEach(() => {
    __dangerous__resetCopyCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env["STRAPI_API_URL"];
    delete process.env["STRAPI_BASE_URL"];
    delete process.env["STRAPI_TOOLS_UV_WIDGET_TOKEN"];
    delete process.env["STRAPI_DELIVERY_API_TOKEN"];
  });

  it("returns fallback copy when Strapi configuration is missing", async () => {
    const bundle = await loadCopyBundle("pl");

    const fallback = getDefaultCopy("pl");
    expect(bundle.source).toBe("fallback");
    expect(bundle.riskCopy.low).toBe(fallback.riskCopy.low);
    expect(bundle.nextSteps).toHaveLength(fallback.nextSteps.length);
  });

  it("fetches copy from Strapi when API is configured", async () => {
    process.env["STRAPI_API_URL"] = "https://cms.example.com";
    process.env["STRAPI_TOOLS_UV_WIDGET_TOKEN"] = "token";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            attributes: {
              fallback_message: "Custom fallback",
              risk_levels: [
                { level: "low", message: "Low risk" },
                { level: "moderate", message: "Moderate risk" },
                { level: "high", message: "High risk" },
                { level: "very_high", message: "Very high risk" },
                { level: "extreme", message: "Extreme risk" },
              ],
              ctas: [
                { label: "CTA One", href: "/cta-one", cta_id: "cta-one" },
                { label: "CTA Two", href: "/cta-two", cta_id: "cta-two" },
              ],
            },
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const bundle = await loadCopyBundle("pl");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(bundle.source).toBe("strapi");
    expect(bundle.fallbackMessage).toBe("Custom fallback");
    expect(bundle.riskCopy.low).toBe("Low risk");
    expect(bundle.nextSteps[0]?.href).toBe("/cta-one");
  });

  it("caches copy responses per language", async () => {
    process.env["STRAPI_API_URL"] = "https://cms.example.com";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            attributes: {
              fallback_message: "Cache check",
              risk_levels: [{ level: "low", message: "Low risk" }],
              ctas: [{ label: "CTA", href: "/cta", cta_id: "cta" }],
            },
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await loadCopyBundle("pl");
    await loadCopyBundle("pl");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
