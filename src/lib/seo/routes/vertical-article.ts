import type { ArticleViewModel } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";

import { buildPageMetadata, resolveAbsoluteUrl } from "../metadata";
import { buildBreadcrumbListStructuredData, buildWebPageStructuredData } from "../structured-data";

import type { Metadata } from "next";

export function buildArticleMetadata(model: ArticleViewModel): Metadata {
  const path = model.article.href;

  return buildPageMetadata({
    title: `${model.article.title} · Clarivum ${model.vertical.key.toUpperCase()}`,
    description: `Instrukcja Clarivum ${model.vertical.key.toUpperCase()} — ${model.article.title}.`,
    path,
    keywords: [
      model.vertical.key,
      model.category.slug,
      model.article.slug,
      "Clarivum",
      "guardrail",
    ],
    openGraph: {
      type: "article",
      section: model.category.label,
    },
  });
}

export function buildArticleStructuredData(model: ArticleViewModel) {
  const canonical = resolveAbsoluteUrl(model.article.href);
  const breadcrumb = buildBreadcrumbListStructuredData({
    id: `${canonical}#breadcrumb`,
    items: [
      { name: "Clarivum", url: resolveAbsoluteUrl("/") },
      { name: model.vertical.key.toUpperCase(), url: resolveAbsoluteUrl(`/${model.vertical.key}`) },
      {
        name: model.category.label,
        url: resolveAbsoluteUrl(`/${model.vertical.key}/${model.category.slug}`),
      },
      { name: model.article.title, url: canonical },
    ],
  });

  const webPage = buildWebPageStructuredData({
    name: model.article.title,
    description: `Guardrail i instrukcja Clarivum dla ${model.article.title}.`,
    url: canonical,
    breadcrumbId: breadcrumb["@id"] as string,
  });

  return {
    webPage,
    breadcrumb,
  };
}
