import { notFound } from "next/navigation";

import { ComingSoonPanel } from "@/app/shared/components/ComingSoonPanel";
import { resolveVertical } from "@/lib/content-map";
import { PageParamsResolver } from "@/lib/next/params/PageParamsResolver";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Blog verticalu",
};

type BlogRouteParams = { vertical: string };

export default async function VerticalBlogIndex({ params }: { params: Promise<BlogRouteParams> }) {
  const { vertical: verticalKey } =
    await PageParamsResolver.from<BlogRouteParams>(params).resolve();
  const vertical = resolveVertical(verticalKey);
  if (!vertical) {
    notFound();
  }

  return (
    <ComingSoonPanel
      title={`Blog ${vertical.toUpperCase()}`}
      description="To miejsce na redakcyjny hub konkretnego verticalu. Wersja produkcyjna pojawi się po podłączeniu loaderów treści i SEO."
      checklist={[
        "Dodaj listę oraz filtry karmione przez loader treści",
        "Emisja canonical + structured data zgodnie z ADR-018",
        "Zachowaj stany nawigacji z docs/PRDs/requierments/ascii_designs.md",
      ]}
      docsLink={{ href: "/docs/PRDs/seo-foundation.md", label: "Podręcznik SEO" }}
    />
  );
}
