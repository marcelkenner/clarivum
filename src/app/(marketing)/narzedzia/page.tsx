import { ComingSoonPanel } from "@/app/shared/components/ComingSoonPanel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarivum · Hub narzędziowy",
  description:
    "Robocza lista diagnostyk, kalkulatorów i guardrails — finalny widok pojawi się po wdrożeniu platformy narzędzi (TSK-FE-006).",
};

export default function ToolsLanding() {
  return (
    <ComingSoonPanel
      title="Clarivum Tools i diagnostyki"
      description="Potrzebuję hero, filtrów oraz półek z wyróżnionymi narzędziami dokładnie jak w makiecie ASCII."
      checklist={[
        "Ładuję taksonomię z content/taxonomy.v1.json",
        "Proxy dla RUM kieruję przez /api/observability/v1/traces",
        "Opisuję flagi oraz analitykę w docs/runbooks/ops-hub.md",
      ]}
      docsLink={{
        href: "/docs/PRDs/requierments/tools/feature-requirements.md",
        label: "PRD narzędzi",
      }}
    />
  );
}
