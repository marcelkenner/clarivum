import type { CategoryHubViewModel } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";

import { buildPageMetadata, resolveAbsoluteUrl } from "../metadata";
import {
  buildBreadcrumbListStructuredData,
  buildItemListStructuredData,
  buildWebPageStructuredData,
} from "../structured-data";

import type { Metadata } from "next";

export function buildCategoryHubMetadata(model: CategoryHubViewModel): Metadata {
  const path = `/${model.vertical.key}/${model.category.slug}`;
  const title = `${model.category.label} · Clarivum ${model.vertical.key.toUpperCase()}`;

  return buildPageMetadata({
    title,
    description: `Guardraile i moduły Clarivum ${model.vertical.key.toUpperCase()} dla kategorii ${model.category.label}.`,
    path,
    keywords: [model.vertical.key, model.category.slug, model.category.tool, "Clarivum", "plan"],
  });
}

export function buildCategoryHubStructuredData(model: CategoryHubViewModel) {
  const canonical = resolveAbsoluteUrl(`/${model.vertical.key}/${model.category.slug}`);
  const breadcrumb = buildBreadcrumbListStructuredData({
    id: `${canonical}#breadcrumb`,
    items: [
      { name: "Clarivum", url: resolveAbsoluteUrl("/") },
      { name: model.vertical.key.toUpperCase(), url: resolveAbsoluteUrl(`/${model.vertical.key}`) },
      { name: model.category.label, url: canonical },
    ],
  });

  const webPage = buildWebPageStructuredData({
    name: `${model.category.label} · Clarivum ${model.vertical.key.toUpperCase()}`,
    description: `Wybierz moduł ${model.category.tool} i guardraile pasujące do celu ${model.category.label}.`,
    url: canonical,
    breadcrumbId: breadcrumb["@id"] as string,
    potentialActions: [
      {
        name: `Uruchom narzędzie ${model.category.tool}`,
        target: resolveAbsoluteUrl(model.vertical.primaryCta.href),
      },
    ],
  });

  const itemList = buildItemListStructuredData({
    name: `${model.category.label} · rekomendowane artykuły`,
    url: canonical,
    items: model.articles.items.map((article, index) => ({
      name: article.title,
      url: resolveAbsoluteUrl(article.href),
      position: index + 1,
    })),
  });

  return {
    webPage,
    breadcrumb,
    itemList,
  };
}
