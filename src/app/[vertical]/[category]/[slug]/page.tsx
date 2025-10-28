import { notFound } from "next/navigation";

import { createVerticalExperienceCoordinator } from "@/app/_vertical-experience/coordinator/VerticalExperienceCoordinator";
import { ArticleView } from "@/app/_vertical-experience/view/VerticalViews";
import { buildBreadcrumbs } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";
import { JsonLd } from "@/lib/seo/JsonLd";
import {
  buildArticleMetadata,
  buildArticleStructuredData,
} from "@/lib/seo/routes/vertical-article";

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

  return buildArticleMetadata(model);
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

  const structuredData = buildArticleStructuredData(model);

  return (
    <>
      <JsonLd id={`${model.article.slug}-webpage`} data={structuredData.webPage} />
      <JsonLd id={`${model.article.slug}-breadcrumbs`} data={structuredData.breadcrumb} />
      <ArticleView model={model} breadcrumbs={breadcrumbs} />
    </>
  );
}
