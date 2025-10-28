import { siteUrl } from "@/lib/content-map";

import type { Metadata } from "next";

export const DEFAULT_SITE_NAME = "Clarivum";
export const DEFAULT_LOCALE = "pl-PL";

export const DEFAULT_OG_IMAGE = {
  url: `${siteUrl}/Clarivum_logo.png`,
  width: 1200,
  height: 630,
  alt: "Clarivum logotyp",
};

export type MetadataFactoryInput = {
  title: string;
  description: string;
  /**
   * Path relative to the site root (leading slash required) or an absolute URL.
   */
  path: string;
  canonical?: string;
  robots?: Metadata["robots"];
  keywords?: string[];
  openGraph?: NonNullable<Metadata["openGraph"]>;
  twitter?: NonNullable<Metadata["twitter"]>;
  alternates?: NonNullable<Metadata["alternates"]>;
};

type OpenGraphValue = NonNullable<Metadata["openGraph"]>;
type TwitterValue = NonNullable<Metadata["twitter"]>;
type AlternatesValue = NonNullable<Metadata["alternates"]>;

export function resolveAbsoluteUrl(pathOrAbsolute: string): string {
  if (!pathOrAbsolute) {
    throw new Error("Expected a non-empty path when resolving canonical URL.");
  }

  if (pathOrAbsolute.startsWith("http://") || pathOrAbsolute.startsWith("https://")) {
    return pathOrAbsolute;
  }

  if (!pathOrAbsolute.startsWith("/")) {
    throw new Error(
      `Relative paths must start with "/". Received: "${pathOrAbsolute}". Update the metadata input.`,
    );
  }

  return new URL(pathOrAbsolute, siteUrl).toString();
}

export function buildPageMetadata(input: MetadataFactoryInput): Metadata {
  const canonical = resolveAbsoluteUrl(input.canonical ?? input.path);

  const openGraph = resolveOpenGraphMetadata({
    canonical,
    title: input.title,
    description: input.description,
    ...(input.openGraph ? { overrides: input.openGraph } : {}),
  });

  const preferredOgImage = extractPreferredOpenGraphImage(openGraph.images);

  const twitter = resolveTwitterMetadata({
    title: input.title,
    description: input.description,
    ...(preferredOgImage !== undefined ? { fallbackImage: preferredOgImage } : {}),
    ...(input.twitter ? { overrides: input.twitter } : {}),
  });

  const alternates = resolveAlternatesMetadata(input.alternates, canonical);

  const metadata: Metadata = {
    title: input.title,
    description: input.description,
    alternates,
    openGraph,
    twitter,
    robots: input.robots ?? { index: true, follow: true },
  };

  if (input.keywords?.length) {
    metadata.keywords = input.keywords;
  }

  return metadata;
}

function resolveOpenGraphMetadata({
  overrides,
  canonical,
  title,
  description,
}: {
  overrides?: OpenGraphValue;
  canonical: string;
  title: string;
  description: string;
}): OpenGraphValue {
  const base: OpenGraphValue = {
    type: "website",
    url: canonical,
    siteName: DEFAULT_SITE_NAME,
    locale: DEFAULT_LOCALE,
    title,
    description,
    images: [DEFAULT_OG_IMAGE],
  };

  if (!overrides) {
    return base;
  }

  const resolvedType = "type" in overrides && overrides.type ? overrides.type : base.type;
  const resolvedImages =
    overrides.images === undefined ? base.images : normaliseOpenGraphImages(overrides.images);

  return {
    ...base,
    ...overrides,
    type: resolvedType,
    url: overrides.url ?? base.url,
    siteName: overrides.siteName ?? base.siteName,
    locale: overrides.locale ?? base.locale,
    title: overrides.title ?? base.title,
    description: overrides.description ?? base.description,
    images: resolvedImages,
  };
}

function normaliseOpenGraphImages(images: OpenGraphValue["images"]): OpenGraphValue["images"] {
  if (Array.isArray(images)) {
    return images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  }
  return images;
}

function extractPreferredOpenGraphImage(
  images: OpenGraphValue["images"],
): string | URL | undefined {
  if (!images) {
    return undefined;
  }

  const candidates = Array.isArray(images) ? images : [images];
  if (candidates.length === 0) {
    return undefined;
  }

  const [first] = candidates;
  if (typeof first === "string") {
    return first;
  }

  if (first instanceof URL) {
    return first;
  }

  if (!first?.url) {
    return undefined;
  }

  return typeof first.url === "string" ? first.url : first.url.toString();
}

function resolveTwitterMetadata({
  overrides,
  title,
  description,
  fallbackImage,
}: {
  overrides?: TwitterValue;
  title: string;
  description: string;
  fallbackImage?: string | URL;
}): TwitterValue {
  const base: TwitterValue = {
    card: "summary_large_image",
    title,
    description,
  };

  if (!overrides) {
    if (fallbackImage) {
      base.images = fallbackImage;
    }
    return base;
  }

  const resolvedCard =
    overrides && "card" in overrides && overrides.card ? overrides.card : "summary_large_image";

  const merged: TwitterValue = {
    ...base,
    ...overrides,
    card: resolvedCard,
    title: overrides.title ?? base.title,
    description: overrides.description ?? base.description,
  };

  if (overrides.images !== undefined) {
    merged.images = overrides.images;
  } else if (fallbackImage) {
    merged.images = fallbackImage;
  } else {
    merged.images = undefined;
  }

  return merged;
}

function resolveAlternatesMetadata(
  overrides: AlternatesValue | undefined,
  canonical: string,
): AlternatesValue {
  const languages = overrides?.languages ?? {};

  return {
    ...(overrides ?? {}),
    canonical,
    languages: {
      "pl-PL": canonical,
      ...languages,
    },
  };
}
