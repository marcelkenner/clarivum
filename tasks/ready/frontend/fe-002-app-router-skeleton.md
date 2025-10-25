---
id: TSK-FE-002
title: Scaffold App Router Information Architecture
status: ready
area: frontend
subarea: routing
owner: Frontend Lead
collaborators:
  - Content Strategist
  - UX Lead
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-24
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/clarivum_brand.md
  - docs/architecture.md
  - docs/PRDs/requierments/frontend-platform/feature-requirements.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
context7:
  - /vercel/next.js
tags:
  - app-router
  - information-architecture
  - scaffolding
---

## Summary
Create the Next.js App Router folder structure, dynamic segments, and placeholder view models that reflect Clarivum’s Skin/Fuel/Habits sitemap so feature teams can implement vertical experiences without reworking routing.

## Definition of Ready
- [x] Finalize vertical taxonomy, category slugs, and CTA mapping with product and content (Product/Content will freeze `content/taxonomy.v1.json` with stable IDs + CTA mapping by Sprint 02 Day 5, including redirect guidance).
- [x] Confirm shared layout requirements (global nav, footer, metadata) with design (header/footer spec set: sticky nav, skip-link, search, legal footer, metadata defaults, theme support, 8-pt grid).
- [x] Align on TypeScript module boundaries (`view models`, `managers`, `coordinators`) to avoid god components (layers agreed: `entities/`, `features/`, `services/`, `app/`, `shared/`; module boundaries enforced via eslint-module-boundaries and facade exports).
- [x] Verify that ASCII designs in `docs/PRDs/requierments/ascii_designs.md` are the canonical source for layout structure and copy placeholders across routed pages.

## Definition of Done
- [ ] Route groups and dynamic segments established per `first_configuration.md` (e.g., `/[vertical]/[category]/[slug]`).
- [ ] Placeholder layouts and copy blocks mirror the structures defined in `docs/PRDs/requierments/ascii_designs.md`, with TODO markers for content handoff.
- [ ] Placeholder server components + view models stubbed with dependency injection hooks for managers/coordinators.
- [ ] Shared layouts, metadata files, and sitemap/robots handlers scaffolded with TODO markers for future content.
- [ ] Documentation in `docs/architecture.md` updated with routing diagram and extension points.
- [ ] Follow-up tasks logged for content loaders, navigation data sources, and individual vertical UI work.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Keep each file under 200 lines by splitting responsibilities into view models, managers, and coordinators from the outset to match Clarivum’s modular design principles.
