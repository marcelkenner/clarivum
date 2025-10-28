import type { VerticalHubViewModel } from "@/app/_vertical-experience/viewmodel/VerticalViewModels";

import { buildPageMetadata, resolveAbsoluteUrl } from "../metadata";
import {
  buildBreadcrumbListStructuredData,
  buildItemListStructuredData,
  buildWebPageStructuredData,
} from "../structured-data";

import type { Metadata } from "next";

export function buildVerticalHubMetadata(model: VerticalHubViewModel): Metadata {
  const path = `/${model.key}`;
  const title = `${model.headline} · Clarivum ${model.key.toUpperCase()}`;

  return buildPageMetadata({
    title,
    description: model.description,
    path,
    keywords: [model.key, "Clarivum", "narzędzia", "guardrail"],
    openGraph: {
      type: "article",
      section: model.key.toUpperCase(),
    },
  });
}

export function buildVerticalHubStructuredData(model: VerticalHubViewModel) {
  const canonical = resolveAbsoluteUrl(`/${model.key}`);
  const breadcrumb = buildBreadcrumbListStructuredData({
    id: `${canonical}#breadcrumb`,
    items: [
      { name: "Clarivum", url: resolveAbsoluteUrl("/") },
      { name: model.key.toUpperCase(), url: canonical },
    ],
  });

  const webPage = buildWebPageStructuredData({
    name: `${model.key.toUpperCase()} · Clarivum`,
    description: model.description,
    url: canonical,
    breadcrumbId: breadcrumb["@id"] as string,
    potentialActions: [
      { name: model.primaryCta.label, target: resolveAbsoluteUrl(model.primaryCta.href) },
      { name: model.secondaryCta.label, target: resolveAbsoluteUrl(model.secondaryCta.href) },
    ],
  });

  const itemList = buildItemListStructuredData({
    name: `${model.key.toUpperCase()}: kluczowe kategorie`,
    description: "Sekcje startowe pomagające wybrać diagnostyki i narzędzia.",
    url: canonical,
    items: model.categories.map((category, index) => ({
      name: category.label,
      url: resolveAbsoluteUrl(`/${model.key}/${category.slug}`),
      position: index + 1,
    })),
  });

  return {
    webPage,
    breadcrumb,
    itemList,
  };
}
