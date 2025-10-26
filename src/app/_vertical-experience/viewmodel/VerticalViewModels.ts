import {
  buildArticlePath,
  buildCategoryPath,
  formatTitleFromSlug,
  getCategorySummary,
  getVerticalNarrative,
  listCategories,
  listArticleSummaries,
  type ArticleSlug,
  type CategorySlug,
  type CategorySummary,
  type VerticalKey,
} from "@/lib/content-map";

export type VerticalHubViewModel = {
  key: VerticalKey;
  headline: string;
  description: string;
  accent: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  categories: CategorySummary[];
};

export type CategoryHubViewModel = {
  vertical: VerticalHubViewModel;
  category: CategorySummary;
  articles: {
    items: {
      slug: ArticleSlug;
      title: string;
      href: string;
    }[];
  };
};

export type ArticleViewModel = {
  vertical: VerticalHubViewModel;
  category: CategorySummary;
  article: {
    slug: ArticleSlug;
    title: string;
    href: string;
  };
};

export function buildVerticalHubModel(vertical: VerticalKey): VerticalHubViewModel {
  const narrative = getVerticalNarrative(vertical);
  const categories = listCategories(vertical);

  return {
    key: vertical,
    headline: narrative.tagline,
    description: narrative.description,
    accent: narrative.accent,
    primaryCta: narrative.primaryCta,
    secondaryCta: narrative.secondaryCta,
    categories,
  };
}

export function buildCategoryModel(
  vertical: VerticalKey,
  category: CategorySlug,
): CategoryHubViewModel | null {
  const categorySummary = getCategorySummary(vertical, category);
  if (!categorySummary) {
    return null;
  }

  const verticalModel = buildVerticalHubModel(vertical);
  const articles = listArticleSummaries(vertical, category).map((article) => ({
    ...article,
    href: buildArticlePath(vertical, category, article.slug),
  }));

  return {
    vertical: verticalModel,
    category: categorySummary,
    articles: { items: articles },
  };
}

export function buildArticleModel(
  vertical: VerticalKey,
  category: CategorySlug,
  slug: ArticleSlug,
): ArticleViewModel | null {
  const categorySummary = getCategorySummary(vertical, category);
  if (!categorySummary) {
    return null;
  }

  const verticalModel = buildVerticalHubModel(vertical);
  const href = buildArticlePath(vertical, category, slug);

  return {
    vertical: verticalModel,
    category: categorySummary,
    article: {
      slug,
      title: formatTitleFromSlug(slug),
      href,
    },
  };
}

export function buildBreadcrumbs(model: {
  vertical: VerticalKey;
  category?: CategorySlug;
  slug?: ArticleSlug;
}) {
  const crumbs: { label: string; href: string }[] = [
    { label: "Start", href: "/" },
    { label: model.vertical.toUpperCase(), href: `/${model.vertical}` },
  ];

  if (model.category) {
    crumbs.push({
      label: formatTitleFromSlug(model.category),
      href: buildCategoryPath(model.vertical, model.category),
    });
  }

  if (model.slug && model.category) {
    crumbs.push({
      label: formatTitleFromSlug(model.slug),
      href: buildArticlePath(model.vertical, model.category, model.slug),
    });
  }

  return crumbs;
}
