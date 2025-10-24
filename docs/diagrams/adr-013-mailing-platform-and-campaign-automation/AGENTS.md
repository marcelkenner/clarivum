# Mailing Platform & Campaign Automation Diagrams · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Directory Purpose
- Anchor updates to `docs/adr/ADR-013-mailing-platform-and-campaign-automation.md`; treat that ADR as the canonical decision log for this domain.
- Partner with Lifecycle Marketing Engineering before changing scope, integration points, or lifecycle assumptions documented here.
- Keep coverage aligned: These diagrams describe the Listmonk-based mailing stack, including infrastructure on AWS, synchronization with Supabase, and automation services that coordinate campaigns.

## Diagram Responsibilities
- `architecture-overview.mmd`: Keep eCS Fargate deployment, integrations, and feedback loops accurate and synchronized with the latest implementation notes and shared vocabulary.
- `data-lineage.mmd`: Keep subscriber records, consent flags, and event tracking across Supabase and Listmonk accurate and synchronized with the latest implementation notes and shared vocabulary.
- `uml-services.mmd`: Keep coordinator, sync manager, and webhook processors managing email automation accurate and synchronized with the latest implementation notes and shared vocabulary.
- `bpmn-campaign.mmd`: Keep campaign planning, approval, sending, and feedback workflow accurate and synchronized with the latest implementation notes and shared vocabulary.

## Contribution Workflow
- Reflect any diagram change in `docs/adr/ADR-013-mailing-platform-and-campaign-automation.md` or add cross-links explaining why the diagram evolved.
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
