import { ComingSoonPanel } from "@/app/shared/components/ComingSoonPanel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Hub blogowy",
  description:
    "Roboczy feed redakcyjny dla Clarivum Skin, Clarivum Fuel i Clarivum Habits — finalna wersja pojawi się po wdrożeniu platformy SEO.",
};

export default function BlogLanding() {
  return (
    <ComingSoonPanel
      title="Centrum historii Clarivum"
      description="Chcę mieć wyselekcjonowane artykuły, diagnostyki i bannery CTA zgodnie z docs/PRDs/seo-foundation.md."
      checklist={[
        "Dodaj stronicowanie oraz filtry kategorii",
        "Zapewnij canonical i JSON-LD według TSK-SEO-001",
        "Podłącz śledzenie guardrails Kaizen dla powracających błędów",
      ]}
      docsLink={{ href: "/docs/PRDs/seo-foundation.md", label: "PRD SEO" }}
    />
  );
}
