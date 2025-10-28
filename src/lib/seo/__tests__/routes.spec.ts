import { describe, expect, it } from "vitest";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import {
  buildVerticalHubModel,
  buildCategoryModel,
  buildArticleModel,
} from "@/app/_vertical-experience/viewmodel/VerticalViewModels";
import { allVerticals } from "@/lib/content-map";
import { homepageMetadata, buildHomepageStructuredData } from "@/lib/seo/routes/homepage";
import {
  buildArticleMetadata,
  buildArticleStructuredData,
} from "@/lib/seo/routes/vertical-article";
import {
  buildCategoryHubMetadata,
  buildCategoryHubStructuredData,
} from "@/lib/seo/routes/vertical-category";
import {
  buildVerticalHubMetadata,
  buildVerticalHubStructuredData,
} from "@/lib/seo/routes/vertical-hub";

describe("seo route guardrails", () => {
  it("homepage metadata includes canonical, open graph, and twitter fallbacks", () => {
    expect(homepageMetadata.alternates?.canonical).toBeTruthy();
    expect(homepageMetadata.openGraph?.images).toBeTruthy();
    const twitterCard =
      homepageMetadata.twitter && "card" in homepageMetadata.twitter
        ? homepageMetadata.twitter.card
        : undefined;
    expect(twitterCard).toBe("summary_large_image");

    const structured = buildHomepageStructuredData();
    expect(structured.webPage["@type"]).toBe("WebPage");
    expect(structured.breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(structured.itemList["@type"]).toBe("ItemList");
  });

  it("vertical hub metadata + structured data resolve for all verticals", () => {
    for (const vertical of allVerticals) {
      const model = buildVerticalHubModel(vertical);
      const metadata = buildVerticalHubMetadata(model);

      expect(metadata.alternates?.canonical).toContain(`/${vertical}`);
      expect(metadata.openGraph?.url).toContain(`/${vertical}`);

      const structured = buildVerticalHubStructuredData(model);
      expect(structured.webPage["@type"]).toBe("WebPage");
      expect(structured.itemList["@type"]).toBe("ItemList");
    }
  });

  it("category hub metadata + structured data resolve for each vertical/category pair", () => {
    const coordinator = createVerticalExperienceCoordinator();
    const params = coordinator.collectCategoryParams();

    for (const param of params) {
      const model = buildCategoryModel(param.vertical, param.category);
      expect(model).toBeTruthy();
      if (!model) {
        continue;
      }

      const metadata = buildCategoryHubMetadata(model);
      expect(metadata.alternates?.canonical).toContain(`/${param.vertical}/${param.category}`);

      const structured = buildCategoryHubStructuredData(model);
      expect(structured.webPage["@type"]).toBe("WebPage");
      expect(structured.itemList["@type"]).toBe("ItemList");
    }
  });

  it("article metadata + structured data resolve for sample articles", () => {
    const coordinator = createVerticalExperienceCoordinator();
    const params = coordinator.collectArticleParams().slice(0, 5);

    for (const param of params) {
      const model = buildArticleModel(param.vertical, param.category, param.slug);
      expect(model).toBeTruthy();
      if (!model) {
        continue;
      }

      const metadata = buildArticleMetadata(model);
      expect(metadata.alternates?.canonical).toContain(model.article.href);

      const structured = buildArticleStructuredData(model);
      expect(structured.webPage["@type"]).toBe("WebPage");
      expect(structured.breadcrumb["@type"]).toBe("BreadcrumbList");
    }
  });
});
