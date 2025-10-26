import {
  collectArticleParams,
  collectCategoryParams,
  getCategorySummary,
  getVerticalNarrative,
  listArticleSummaries,
  listCategories,
  listVerticalHighlights,
  type ArticleSlug,
  type CategorySlug,
  type VerticalKey,
} from "@/lib/content-map";

export type VerticalHighlight = ReturnType<typeof listVerticalHighlights>[number];

/**
 * ContentLibrary centralizes read access to the static content map so that
 * coordinators can swap in Strapi/Supabase loaders later without touching page
 * components. The default implementation reads the in-repo map while exposing
 * query helpers for the App Router.
 */
export class ContentLibrary {
  public listHighlights(limit = 2): VerticalHighlight[] {
    return listVerticalHighlights(limit);
  }

  public getVertical(vertical: VerticalKey) {
    return {
      key: vertical,
      narrative: getVerticalNarrative(vertical),
      categories: listCategories(vertical),
    };
  }

  public getCategory(vertical: VerticalKey, slug: CategorySlug) {
    return getCategorySummary(vertical, slug);
  }

  public getArticle(vertical: VerticalKey, slug: CategorySlug, articleSlug: ArticleSlug) {
    const matches = listArticleSummaries(vertical, slug).find(
      (article) => article.slug === articleSlug,
    );
    return matches ?? null;
  }

  public collectStaticCategoryParams() {
    return collectCategoryParams();
  }

  public collectStaticArticleParams() {
    return collectArticleParams();
  }
}

export type ContentLibraryFactory = () => ContentLibrary;

export function createContentLibrary(): ContentLibrary {
  return new ContentLibrary();
}
