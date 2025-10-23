---
id: TSK-FE-002
title: Scaffold App Router Information Architecture
status: backlog
area: frontend
subarea: routing
owner: Frontend Lead
collaborators:
  - Content Strategist
  - UX Lead
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-21
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/clarivum_brand.md
  - docs/architecture.md
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
- [ ] Finalize vertical taxonomy, category slugs, and CTA mapping with product and content.
- [ ] Confirm shared layout requirements (global nav, footer, metadata) with design.
- [ ] Align on TypeScript module boundaries (`view models`, `managers`, `coordinators`) to avoid god components.

## Definition of Done
- [ ] Route groups and dynamic segments established per `first_configuration.md` (e.g., `/[vertical]/[category]/[slug]`).
- [ ] Placeholder server components + view models stubbed with dependency injection hooks for managers/coordinators.
- [ ] Shared layouts, metadata files, and sitemap/robots handlers scaffolded with TODO markers for future content.
- [ ] Documentation in `docs/architecture.md` updated with routing diagram and extension points.
- [ ] Follow-up tasks logged for content loaders, navigation data sources, and individual vertical UI work.

## Notes
Keep each file under 200 lines by splitting responsibilities into view models, managers, and coordinators from the outset to match Clarivum’s modular design principles.
