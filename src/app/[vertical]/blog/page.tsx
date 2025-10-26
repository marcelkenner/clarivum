import { notFound } from "next/navigation";

import { ComingSoonPanel } from "@/app/shared/components/ComingSoonPanel";
import { resolveVertical } from "@/lib/content-map";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Blog verticalu",
};

export default function VerticalBlogIndex({ params }: { params: { vertical: string } }) {
  const vertical = resolveVertical(params.vertical);
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
