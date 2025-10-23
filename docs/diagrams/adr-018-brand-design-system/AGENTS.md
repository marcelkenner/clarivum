# Brand Design System Diagrams · AGENTS Guide

## Directory Purpose
- Anchor updates to `docs/adr/ADR-018-brand-design-system.md`; treat that ADR as the canonical decision log for this domain.
- Partner with Brand Studio before changing scope, integration points, or lifecycle assumptions documented here.
- Keep coverage aligned: These diagrams visualize the Clarivum brand system foundations, including token relationships, component structure, and governance workflows that keep product and marketing aligned.

## Diagram Responsibilities
- `architecture-overview.mmd`: Keep flow of brand guidelines into tokens, Storybook, and application components accurate and synchronized with the latest implementation notes and shared vocabulary.
- `data-lineage.mmd`: Keep color, typography, and spacing tokens with their usage mappings accurate and synchronized with the latest implementation notes and shared vocabulary.
- `uml-components.mmd`: Keep system objects responsible for token distribution and component theming accurate and synchronized with the latest implementation notes and shared vocabulary.
- `bpmn-governance.mmd`: Keep process for updating brand rules and shipping changes accurate and synchronized with the latest implementation notes and shared vocabulary.

## Contribution Workflow
- Reflect any diagram change in `docs/adr/ADR-018-brand-design-system.md` or add cross-links explaining why the diagram evolved.
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
