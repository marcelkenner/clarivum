import { siteUrl } from "@/lib/content-map";

export type JsonLd = Record<string, unknown>;

export interface PotentialActionInput {
  name: string;
  target: string;
}

export interface WebPageStructuredDataInput {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  breadcrumbId?: string;
  potentialActions?: PotentialActionInput[];
}

export interface BreadcrumbListInput {
  id: string;
  items: Array<{ name: string; url: string }>;
}

export interface ItemListInput {
  name: string;
  description?: string;
  url?: string;
  items: Array<{ name: string; url: string; position?: number }>;
}

export function buildWebPageStructuredData({
  name,
  description,
  url,
  inLanguage = "pl-PL",
  breadcrumbId,
  potentialActions = [],
}: WebPageStructuredDataInput): JsonLd {
  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage,
    publisher: {
      "@type": "Organization",
      name: "Clarivum",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/Clarivum_logo.png`,
      },
    },
  };

  if (breadcrumbId) {
    payload["isPartOf"] = { "@id": breadcrumbId };
  }

  if (potentialActions.length > 0) {
    payload["potentialAction"] = potentialActions.map((action) => ({
      "@type": "Action",
      name: action.name,
      target: action.target,
    }));
  }

  return payload;
}

export function buildBreadcrumbListStructuredData({ id, items }: BreadcrumbListInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildItemListStructuredData({
  name,
  description,
  url,
  items,
}: ItemListInput): JsonLd {
  const payload: JsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  if (description) {
    payload["description"] = description;
  }

  if (url) {
    payload["url"] = url;
  }

  return payload;
}
