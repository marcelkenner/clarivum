# docs/diagrams/adr-033-advertising-and-affiliate-telemetry · AGENTS Guide

## Directory Purpose
- Visualize the systems that back `docs/adr/ADR-033-advertising-and-affiliate-telemetry.md`.
- Keep monetization telemetry diagrams aligned with analytics, finance, and platform guardrails.

## Diagram Responsibilities
- `architecture-overview.mmd`: Macro components across client SDK, edge services, workers, and partners.
- `data-lineage.mmd`: Storage and reporting flow for impressions, clicks, and revenue reconciliation.
- `sequence-click-redirect.mmd`: Redirect flow including failure handling.
- `uml-components.mmd`: Service-level interfaces for logging, fraud detection, and reconciliation.
- `bpmn-reconciliation.mmd`: Operational cadence for daily reconciliation and alerting.

## Contribution Checklist
- Validate updates with `npm run lint:diagrams`.
- Cross-reference ADR updates and related runbooks (`docs/runbooks/analytics-qa.md`, monetization guardrails) when diagrams change.
- Capture any new tooling references using Context7 before committing modifications.
- Ensure labels respect privacy guidance (ADR-014) when depicting data fields.
