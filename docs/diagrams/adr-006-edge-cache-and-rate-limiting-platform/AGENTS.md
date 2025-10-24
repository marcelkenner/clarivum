# Edge Cache & Rate Limiting Platform Diagrams · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Directory Purpose
- Anchor updates to `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md`; treat that ADR as the canonical decision log for this domain.
- Partner with Platform Performance Team before changing scope, integration points, or lifecycle assumptions documented here.
- Keep coverage aligned: These diagrams illustrate how Clarivum uses Upstash Redis to provide response caching, rate limiting, and distributed coordination across edge and serverless runtimes.

## Diagram Responsibilities
- `architecture-overview.mmd`: Keep edge middleware, API routes, and workers sharing Upstash Redis accurate and synchronized with the latest implementation notes and shared vocabulary.
- `data-lineage.mmd`: Keep namespaced cache entries, rate limit counters, and coordination locks accurate and synchronized with the latest implementation notes and shared vocabulary.
- `uml-adapters.mmd`: Keep internal OOP adapters wrapping Upstash SDK capabilities accurate and synchronized with the latest implementation notes and shared vocabulary.
- `bpmn-guardrail.mmd`: Keep workflow for quota evaluation and fallback handling accurate and synchronized with the latest implementation notes and shared vocabulary.

## Contribution Workflow
- Reflect any diagram change in `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md` or add cross-links explaining why the diagram evolved.
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
