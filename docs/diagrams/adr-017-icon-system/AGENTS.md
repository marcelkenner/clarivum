# Icon System Diagrams · AGENTS Guide

## Directory Purpose
- Anchor updates to `docs/adr/ADR-017-icon-system.md`; treat that ADR as the canonical decision log for this domain.
- Partner with Brand Design System before changing scope, integration points, or lifecycle assumptions documented here.
- Keep coverage aligned: These diagrams capture how Phosphor Icons integrate into the Clarivum design system, covering import paths, styling tokens, component collaborators, and governance workflows that keep icon usage consistent across the app.

## Diagram Responsibilities
- `architecture-overview.mmd`: Keep icon asset flow from packages to React components and theming accurate and synchronized with the latest implementation notes and shared vocabulary.
- `data-lineage.mmd`: Keep token references, size presets, and lint rules that enforce usage accurate and synchronized with the latest implementation notes and shared vocabulary.
- `uml-components.mmd`: Keep viewModel utilities and icon presenter classes that standardize rendering accurate and synchronized with the latest implementation notes and shared vocabulary.
- `bpmn-governance.mmd`: Keep workflow for introducing new icons and updating guidelines accurate and synchronized with the latest implementation notes and shared vocabulary.

## Contribution Workflow
- Reflect any diagram change in `docs/adr/ADR-017-icon-system.md` or add cross-links explaining why the diagram evolved.
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
