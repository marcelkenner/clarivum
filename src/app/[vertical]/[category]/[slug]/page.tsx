import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { ArticleView } from "@/app/_vertical-experience/view/VerticalViews";
import { buildBreadcrumbs } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";

import type { Metadata } from "next";

export const revalidate = 86400;

export function generateStaticParams() {
  const coordinator = createVerticalExperienceCoordinator();
  return coordinator.collectArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: { vertical: string; category: string; slug: string };
}): Promise<Metadata> {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildArticle(params);

  if (!model) {
    return {};
  }

  return {
    title: `${model.article.title} · Clarivum`,
    description: `${model.category.label} article placeholder`,
  };
}

export default function ArticlePage({
  params,
}: {
  params: { vertical: string; category: string; slug: string };
}) {
  const coordinator = createVerticalExperienceCoordinator();
  const model = coordinator.buildArticle(params);

  if (!model) {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs({
    vertical: model.vertical.key,
    category: model.category.slug,
    slug: model.article.slug,
  });

  return <ArticleView model={model} breadcrumbs={breadcrumbs} />;
}
