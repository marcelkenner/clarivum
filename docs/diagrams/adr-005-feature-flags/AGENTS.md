# Feature Flag & Experimentation Platform Diagrams · AGENTS Guide

## Directory Purpose
- Anchor updates to `docs/adr/ADR-005-feature-flags.md`; treat that ADR as the canonical decision log for this domain.
- Partner with Product Engineering before changing scope, integration points, or lifecycle assumptions documented here.
- Keep coverage aligned: These diagrams explain how Flagsmith integrates with Clarivum’s delivery pipeline.

## Diagram Responsibilities
- `architecture-overview.mmd`: Keep next.js SDK integration with Flagsmith and observability hooks accurate and synchronized with the latest implementation notes and shared vocabulary.
- `data-lineage.mmd`: Keep flag metadata entities, audit trails, and cache storage accurate and synchronized with the latest implementation notes and shared vocabulary.
- `uml-sdk.mmd`: Keep client abstractions handling environment fallback and caching accurate and synchronized with the latest implementation notes and shared vocabulary.
- `bpmn-flag-lifecycle.mmd`: Keep workflow for proposing, approving, and removing flags accurate and synchronized with the latest implementation notes and shared vocabulary.

## Contribution Workflow
- Reflect any diagram change in `docs/adr/ADR-005-feature-flags.md` or add cross-links explaining why the diagram evolved.
- Capture rationale in the PR description and reference impacted PRDs or runbooks when applicable.
- Request review from the owning team and one cross-discipline reviewer (design, platform, or reliability as relevant).
- Regenerate previews or exports if downstream docs rely on rendered SVG/PNG assets.

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
