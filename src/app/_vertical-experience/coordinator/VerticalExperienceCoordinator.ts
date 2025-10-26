import { resolveCategory, resolveVertical, type ArticleSlug } from "@/lib/content-map";

import { createContentLibrary } from "../manager/ContentLibrary";
import {
  buildArticleModel,
  buildCategoryModel,
  buildVerticalHubModel,
  type ArticleViewModel,
  type CategoryHubViewModel,
  type VerticalHubViewModel,
} from "../viewmodel/VerticalViewModels";

import type { ContentLibrary } from "../manager/ContentLibrary";

export interface VerticalExperienceCoordinatorDependencies {
  contentLibrary?: ContentLibrary;
}

export class VerticalExperienceCoordinator {
  constructor(private readonly contentLibrary: ContentLibrary) {}

  public buildVerticalHub(params: { vertical: string }): VerticalHubViewModel | null {
    const parsed = resolveVertical(params.vertical);
    if (!parsed) {
      return null;
    }

    return buildVerticalHubModel(parsed);
  }

  public buildCategoryHub(params: {
    vertical: string;
    category: string;
  }): CategoryHubViewModel | null {
    const vertical = resolveVertical(params.vertical);
    if (!vertical) {
      return null;
    }

    const category = resolveCategory(vertical, params.category);
    if (!category) {
      return null;
    }

    return buildCategoryModel(vertical, category);
  }

  public buildArticle(params: {
    vertical: string;
    category: string;
    slug: string;
  }): ArticleViewModel | null {
    const vertical = resolveVertical(params.vertical);
    if (!vertical) {
      return null;
    }

    const category = resolveCategory(vertical, params.category);
    if (!category) {
      return null;
    }

    return buildArticleModel(vertical, category, params.slug as ArticleSlug);
  }

  public collectCategoryParams() {
    return this.contentLibrary.collectStaticCategoryParams();
  }

  public collectArticleParams() {
    return this.contentLibrary.collectStaticArticleParams();
  }
}

export function createVerticalExperienceCoordinator(
  dependencies?: VerticalExperienceCoordinatorDependencies,
): VerticalExperienceCoordinator {
  return new VerticalExperienceCoordinator(dependencies?.contentLibrary ?? createContentLibrary());
}
