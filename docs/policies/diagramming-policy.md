# Diagramming Policy

This policy mandates the visual artifacts required for every net-new feature, platform capability, and architecture decision recorded in Clarivum. Follow it to keep our system design transparent, reviewable, and ready to scale.

## Scope

- Applies to all work tied to PRDs, ADRs, runbooks, or feature flags.
- Covers both greenfield functionality and modifications that change behavior, data contracts, or operational flows.

## Required diagram set

- **Architecture (C4 container or component view):** Show the change in context of Clarivum’s platform, highlighting affected services, integrations, and trust boundaries.
- **Data lineage / ERD:** Capture entities, schemas, and transformations across storage layers. Include data retention or residency considerations when relevant.
- **Domain UML:** Provide class, sequence, or state diagrams that explain domain behavior, APIs, or component interactions.
- **Process BPMN:** Describe end-to-end business workflows, branching logic, and human/system touchpoints.

Each diagram should link back to the governing ADR and the originating task ID.

## Authoring standards

- Prefer text-first diagrams (Mermaid, PlantUML) so reviews happen in PR diffs. When using design tools, export SVG/PNG and commit the source file.
- Store artifacts under `docs/diagrams/<feature-or-decision>/` alongside a short README that explains context and owners.
- Name files with `{diagram-type}-{meaningful-slug}.{md|png|svg}` to aid discovery—for example, `architecture-diagnostics-platform.md`.
- Keep diagrams synchronized with code. Update or deprecate outdated diagrams in the same PR that changes the corresponding feature.
- Reference diagrams inside PR descriptions, ADRs, runbooks, and PRDs so reviewers can trace them quickly.

## Review checklist

- Diagrams reflect current boundaries, data contracts, and workflows.
- Links resolve locally (Markdown) and in GitHub previews.
- Accessibility is considered: include alt text or textual summaries for complex images.
- Follow-up tasks exist for deferred diagram work, with owners and due dates.

## Tooling

- Run `npm run lint:diagrams` locally; CI fails when ADRs lack required diagram links or sources.
- Track legacy exemptions inside the linter and remove them once diagrams ship.

Non-compliance blocks reviewers from approving the change unless an exception is documented and signed off by the architecture lead.
