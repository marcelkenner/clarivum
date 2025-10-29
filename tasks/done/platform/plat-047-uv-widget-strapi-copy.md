---
id: TSK-PLAT-047
title: Wire UV Widget Risk Copy From Strapi
status: done
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - Frontend Engineer
  - Content Strategist
effort: small
created_at: 2025-11-07
updated_at: 2025-11-08
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
`/api/tools/uv-widget` now hydrates risk copy, fallback banners, and CTA metadata from the Strapi `tools-uv-widget` collection. A dedicated loader caches responses per locale, falls back gracefully when Strapi is unavailable, and instruments copy source via OpenTelemetry. Hard-coded Polish/English strings were removed from the manager.

## Definition of Ready
- [x] Field structure confirmed: PL/EN fields plus fallback banners and CTA metadata (`label`, `href`, `cta_id`) approved by Content Strategy.
- [x] Draft entries created for risk levels `low|moderate|high|very_high|extreme` across both locales.
- [x] Flag/preview flow documented so editors verify staging content before publish.
- [x] Read-only API token for `tools.uv-widget` stored in Secrets Manager.

## Definition of Done
- [x] UV widget manager fetches localized copy from Strapi with 5 minute cache and safe fallbacks.
- [x] Hard-coded risk copy removed; unit tests cover localization fallback (missing locale, missing level).
- [x] Strapi schema docs updated in ADR-010 appendix and `docs/runbooks/tools-platform-operations.md` notes the field mapping.
- [x] `npm run validate` passes and Plausible events continue emitting without schema changes.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.

## Notes
- Added `src/app/api/tools/uv-widget/lib/copy-loader.ts` with Strapi REST client, response normalisation, and per-language cache. Manager now awaits the copy bundle and tags the response with `clarivum.tools.copy_source`.
- Docs/agents updated to call out the required Strapi env vars and to guide future platform work on Supabase modules/WIP lanes.
- Unit coverage extended with dedicated tests for the copy loader and updated manager fixtures (`npm run test -- tests/api/tools/uv-widget`).

## Follow-ups
- Populate `STRAPI_API_URL` (or `STRAPI_BASE_URL`) and `STRAPI_TOOLS_UV_WIDGET_TOKEN` / `STRAPI_DELIVERY_API_TOKEN` in every runtime before enabling the widget flag.
- Once the CMS collection ships, append the exact field mapping to `docs/runbooks/tools-platform-operations.md` changelog and notify content editors.
