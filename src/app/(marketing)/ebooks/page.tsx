import { ComingSoonPanel } from "@/app/shared/components/ComingSoonPanel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Biblioteka ebooków",
  description:
    "Roboczy hub ebooków — docelowo zasili go Strapi po wdrożeniu platformy z zadania TSK-SHARED-003.",
};

export default function EbooksLanding() {
  return (
    <ComingSoonPanel
      title="Moja biblioteka ebooków"
      description="Chcę szybko wyszukać ebook po verticalu i natychmiast pobrać wersję zaakceptowaną w docs/PRDs/requierments/homepage/feature-requirements.md."
      checklist={[
        "Indeksuję serie ebooków dla Clarivum Skin, Clarivum Fuel i Clarivum Habits",
        "Odsłaniam flagi dla treści za bramką w Flagsmith",
        "Podpinam eventy view_ebook i download_ebook",
      ]}
      docsLink={{
        href: "/docs/PRDs/requierments/homepage/feature-requirements.md",
        label: "PRD strony głównej",
      }}
    />
  );
}
