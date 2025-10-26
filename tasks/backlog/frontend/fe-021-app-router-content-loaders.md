---
id: TSK-FE-021
title: Implement App Router Content Loaders
status: backlog
area: frontend
subarea: data-loading
owner: Frontend Engineer
collaborators:
  - Content Platform Lead
  - Platform Engineer
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/requierments/strapi/feature-requirements.md
  - docs/adr/ADR-019-frontend-platform.md
context7:
  - /vercel/next.js
  - /supabase/supabase
tags:
  - content-loader
  - app-router
---

## Summary
Replace the static `content-map.ts` used by the App Router skeleton with a Strapi-backed loader (preview + prod) so Skin/Fuel/Habits pages, sitemaps, and RSS feeds pull the latest taxonomy, CTAs, and copy blocks without redeploying the site.

## Definition of Ready
- [ ] Content schemas for categories/posts/CTAs approved in Strapi (see docs/PRDs/requierments/strapi/feature-requirements.md).
- [ ] API access patterns cleared with Platform (preview tokens + prod basic auth).
- [ ] Test strategy drafted (unit doubles around `ContentLibrary`, e2e smoke for one slug per vertical).
- [ ] Observability requirements captured in docs/runbooks/ops-hub.md (trace/span names, failure alerts).

## Definition of Done
- [ ] `ContentLibrary` accepts a data-source interface with Strapi/Supabase implementations plus fixtures for tests.
- [ ] Static generation helpers (`collectCategoryParams`, `collectArticleParams`, sitemaps, RSS) call the new loader.
- [ ] Cache + revalidation plan documented (ISR cadence, fallback behavior, edge tags).
- [ ] Docs updated: `docs/architecture.md` (data flow), `docs/runbooks/ops-hub.md` (operational steps), and nearest `AGENTS.md`.
- [ ] Guardrail: unit tests verifying fallback data + preview mode, plus Playwright smoke covering one page per vertical.
- [ ] Acceptance: README/AGENTS/ADR references refreshed and linked in the PR body.

## Notes
- Use feature flags to flip from static map to Strapi JSON to avoid downtime.
- Coordinate with TSK-SHARED-003 to reuse the same Strapi typing utilities.
