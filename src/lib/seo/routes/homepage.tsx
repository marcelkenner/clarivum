import { listVerticalHighlights } from "@/lib/content-map";

import { JsonLd } from "../JsonLd";
import { buildPageMetadata, resolveAbsoluteUrl } from "../metadata";
import {
  buildBreadcrumbListStructuredData,
  buildItemListStructuredData,
  buildWebPageStructuredData,
} from "../structured-data";

const HOMEPAGE_PATH = "/";
const HOMEPAGE_TITLE = "Clarivum · Plan startowy Skin, Fuel i Habits";
const HOMEPAGE_DESCRIPTION =
  "Zbuduj plan Clarivum w 20 minut: diagnostyki Skin, paliwo z Fuel i rytuały Habits prowadzą Cię krok po kroku zgodnie z docs/PRDs/seo-foundation.md.";

export const homepageMetadata = buildPageMetadata({
  title: HOMEPAGE_TITLE,
  description: HOMEPAGE_DESCRIPTION,
  path: HOMEPAGE_PATH,
  keywords: ["Clarivum", "Skin", "Fuel", "Habits", "narzędzia", "diagnostyki"],
});

export function buildHomepageStructuredData() {
  const canonical = resolveAbsoluteUrl(HOMEPAGE_PATH);
  const breadcrumb = buildBreadcrumbListStructuredData({
    id: `${canonical}#breadcrumb`,
    items: [
      { name: "Clarivum", url: canonical },
      { name: "Tools-first homepage", url: canonical },
    ],
  });

  const potentialActions = [
    { name: "Rozpocznij plan Clarivum Skin", target: resolveAbsoluteUrl("/skin") },
    { name: "Sprawdź plan Clarivum Fuel", target: resolveAbsoluteUrl("/fuel") },
    { name: "Odwiedź panel narzędzi", target: resolveAbsoluteUrl("/narzedzia") },
  ];

  const webPage = buildWebPageStructuredData({
    name: "Clarivum tools-first homepage",
    description: HOMEPAGE_DESCRIPTION,
    url: canonical,
    breadcrumbId: breadcrumb["@id"] as string,
    potentialActions,
  });

  const highlightItems = listVerticalHighlights(1).flatMap((highlight) => [
    {
      name: highlight.narrative.primaryCta.label,
      url: resolveAbsoluteUrl(highlight.narrative.primaryCta.href),
    },
    {
      name: highlight.narrative.secondaryCta.label,
      url: resolveAbsoluteUrl(highlight.narrative.secondaryCta.href),
    },
  ]);

  const itemList = buildItemListStructuredData({
    name: "Clarivum guardrail actions",
    description: "Najważniejsze kolejne kroki w planie Skin, Fuel i Habits.",
    url: canonical,
    items: highlightItems,
  });

  return {
    webPage,
    breadcrumb,
    itemList,
  };
}

export function HomepageStructuredData() {
  const structured = buildHomepageStructuredData();

  return (
    <>
      <JsonLd id="clarivum-homepage" data={structured.webPage} />
      <JsonLd id="clarivum-homepage-breadcrumbs" data={structured.breadcrumb} />
      <JsonLd id="clarivum-homepage-actions" data={structured.itemList} />
    </>
  );
}
