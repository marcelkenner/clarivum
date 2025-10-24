# Product Analytics Platform Diagrams · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Directory Purpose
- Archive historical diagrams from `docs/adr/ADR-008-product-analytics-platform.md`; ADR-029 is now the canonical decision log for product analytics.
- Partner with Growth Analytics before referencing these assets externally; ensure new work aligns with Plausible architecture in ADR-029.
- Keep coverage aligned: These diagrams describe the managed PostHog analytics stack previously adopted in ADR-008 and are retained for provenance only.

## Diagram Responsibilities
- `architecture-overview.mmd`: Historical event producers and sinks across PostHog, Supabase, and alerting tools.
- `data-lineage.mmd`: Historical canonical event schema relationships and warehouse sync mapping.
- `uml-instrumentation.mmd`: Historical analytics SDK facades providing consent gating and type-safe event emission.
- `bpmn-governance.mmd`: Historical workflow for publishing schema changes and remediation of funnel regressions.

## Contribution Workflow
- Do not modify these archived diagrams for new work; create or update diagrams under `docs/diagrams/adr-029-plausible-analytics-platform/` alongside ADR-029 instead.
- If a historical correction is required, document the reason in ADR-029 and cross-link back to this archive.
- Capture rationale in the PR description and reference impacted PRDs or runbooks when applicable.
- Request review from the owning team and one cross-discipline reviewer (design, platform, or reliability as relevant) for any archival corrections.
- Regenerate previews or exports only if downstream docs explicitly reference these historical diagrams.

## Quality Checklist
- Keep Mermaid files under 500 lines; break into dedicated diagrams when flows grow complex.
- Favor explicit node names and layered swimlanes; avoid ambiguous labels like `Service` or `Process` without context.
- Ensure terminology matches the ADR, architecture docs, and live system naming.
- Run `npm run validate` before merging to keep repo-wide checks green.
- Rerun `npm run ensure:agents` if you introduce new diagram directories or rename existing ones.

## Reuse & Extensibility
- Structure diagrams so teams can reuse fragments in other ADRs (e.g., shared components, pipelines, or governance steps).
- Prefer modular Mermaid subgraphs and consistent color schemes to support embedding in presentation decks.
- Document any required tooling (e.g., `@mermaid-js/mermaid-cli` version) in the directory README if it differs from the default stack.

## Escalation
- Log open questions in `tasks/` and tag the owning team when diagram intent is unclear.
- Raise a new ADR or ADR amendment when diagram updates signal a material architectural shift.
