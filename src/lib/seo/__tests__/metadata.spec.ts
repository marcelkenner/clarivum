import { describe, expect, it } from "vitest";

import { DEFAULT_OG_IMAGE, buildPageMetadata, resolveAbsoluteUrl } from "../metadata";

describe("buildPageMetadata", () => {
  it("builds canonical URLs and defaults", () => {
    const metadata = buildPageMetadata({
      title: "Test page",
      description: "Clarivum test description",
      path: "/test-page",
    });

    const canonical = resolveAbsoluteUrl("/test-page");

    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(metadata.alternates?.languages).toMatchObject({ "pl-PL": canonical });
    expect(metadata.openGraph?.url).toBe(canonical);
    expect(metadata.openGraph?.images).toEqual([DEFAULT_OG_IMAGE]);
    const twitterCard =
      metadata.twitter && "card" in metadata.twitter ? metadata.twitter.card : undefined;
    expect(twitterCard).toBe("summary_large_image");
  });

  it("respects custom Open Graph and Twitter overrides", () => {
    const metadata = buildPageMetadata({
      title: "Demo title",
      description: "Demo description",
      path: "/demo",
      openGraph: {
        images: ["https://clarivum.example/og-image.jpg"],
        siteName: "Clarivum Demo",
      },
      twitter: {
        images: ["https://clarivum.example/twitter-image.jpg"],
      },
    });

    expect(metadata.openGraph?.images).toEqual(["https://clarivum.example/og-image.jpg"]);
    expect(metadata.openGraph?.siteName).toBe("Clarivum Demo");
    expect(metadata.twitter?.images).toEqual(["https://clarivum.example/twitter-image.jpg"]);
  });

  it("throws when provided path is relative without a leading slash", () => {
    expect(() =>
      buildPageMetadata({ title: "Broken", description: "Invalid", path: "relative" }),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Relative paths must start with "/". Received: "relative". Update the metadata input.]',
    );
  });
});
