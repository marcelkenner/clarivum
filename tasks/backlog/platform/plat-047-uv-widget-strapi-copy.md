---
id: TSK-PLAT-047
title: Wire UV Widget Risk Copy From Strapi
status: backlog
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - Frontend Engineer
  - Content Strategist
effort: small
created_at: 2025-11-07
updated_at: 2025-11-07
links:
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-038-uv-widget-service-guardrails.md
  - docs/runbooks/tools-platform-operations.md
context7:
  - /strapi/documentation
  - /vercel/next.js
tags:
  - cms
  - localization
  - tools
---

## Summary
Serve the UV widget risk messaging, fallback banner text, and CTA metadata from Strapi (namespace `tools.uv-widget`) so editors can localize copy without shipping code.

## Definition of Ready
- [x] Field structure confirmed: PL/EN fields plus fallback banners and CTA metadata (`label`, `href`, `cta_id`) approved by Content Strategy.
- [x] Draft entries created for risk levels `low|moderate|high|very_high|extreme` across both locales.
- [x] Flag/preview flow documented so editors verify staging content before publish.
- [x] Read-only API token for `tools.uv-widget` stored in Secrets Manager.

## Definition of Done
- [ ] UV widget manager fetches localized copy from Strapi with 5 minute cache and safe fallbacks.
- [ ] Hard-coded risk copy removed; unit tests cover localization fallback (missing locale, missing level).
- [ ] Strapi schema docs updated in ADR-010 appendix and `docs/runbooks/tools-platform-operations.md` notes the field mapping.
- [ ] `npm run validate` passes and Plausible events continue emitting without schema changes.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.
