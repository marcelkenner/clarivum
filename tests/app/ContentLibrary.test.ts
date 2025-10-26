import { describe, expect, it } from "vitest";

import { ContentLibrary } from "@/app/_vertical-experience/manager/ContentLibrary";

const library = new ContentLibrary();

describe("ContentLibrary", () => {
  it("lists highlights for all three verticals", () => {
    const highlights = library.listHighlights();

    expect(highlights).toHaveLength(3);
    expect(highlights.map((item) => item.key)).toEqual(
      expect.arrayContaining(["skin", "fuel", "habits"]),
    );
    const firstHighlight = highlights[0];
    expect(firstHighlight).toBeDefined();
    expect(firstHighlight?.categories.length ?? 0).toBeGreaterThan(0);
  });

  it("collects category params for the App Router", () => {
    const params = library.collectStaticCategoryParams();

    expect(params.length).toBeGreaterThan(10);
    expect(params).toEqual(
      expect.arrayContaining([expect.objectContaining({ vertical: "skin", category: "podstawy" })]),
    );
  });

  it("collects article params for ISR", () => {
    const params = library.collectStaticArticleParams();

    expect(params.length).toBeGreaterThan(30);
    expect(params[0]).toHaveProperty("slug");
  });
});
