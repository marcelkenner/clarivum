---
id: TSK-SEO-001
title: Ship SEO Platform Foundation
status: done
area: platform
subarea: frontend-platform
owner: Frontend Platform Lead
collaborators:
  - SEO Lead
  - Content Operations Manager
  - Analytics Engineer
effort: large
created_at: 2025-10-24
updated_at: 2025-11-04
links:
  - docs/PRDs/seo-foundation.md
  - docs/adr/ADR-034-seo-foundation-and-governance.md
  - docs/runbooks/seo-operations.md
  - docs/policies/seo-governance.md
  - docs/adr/ADR-037-responsive-design-standards.md
  - docs/runbooks/seo-homepage-metadata-kickoff.md
context7:
  - /vercel/next.js
  - /garmeeh/next-seo
tags:
  - seo
  - platform
  - performance
---

## Summary
Implement the shared SEO platform layer for Clarivum: metadata factory, structured data modules, sitemap/robots automation, and guardrail tests that ensure every indexable route ships with optimal search signals and Core Web Vitals instrumentation.

## Definition of Ready
- [x] Engineering design walkthrough covers metadata factory API, structured data composition, and sitemap strategy (walkthrough scheduled for Nov 1, 2025 16:00 UTC with Platform, SEO, Frontend attendees).
- [x] Acceptance criteria for Core Web Vitals budgets and schema coverage agreed with SEO Lead (targets: mobile LCP ≤2.5s, INP ≤200ms, CLS ≤0.1; 100% indexable routes mapped to JSON-LD templates with zero validation errors and ≤5% warnings).
- [x] CI pipeline updates scoped (lint, tests) with estimated runtime impact documented (SEO checks consume ≤3 minutes per PR for metadata/schema validation + Lighthouse smoke).
- [x] Env config approach for robots.txt and sitemap base URLs reviewed (`NEXT_PUBLIC_SITE_URL` per env plus `ROBOTS_POLICY` flag; sitemap at `${SITE_URL}/sitemap.xml` with index splitting as needed).
- [x] Access to Search Console API credentials confirmed via platform security process (SEO lead requests service account, Platform stores JSON key in Secrets Manager, injected ephemerally in Actions).
- [x] Playwright smoke templates identified for canonical SEO verification (`@seo-smoke` checks for canonical, robots meta, JSON-LD validation, sitemap inclusion, 404 handling, hreflang reciprocity).

## Definition of Done
- [x] Metadata utilities shipped with unit tests and sample implementation on homepage + pillar template.
- [x] Structured data modules (Article, FAQPage, Product, BreadcrumbList) validated with Ajv tests and Rich Results checks.
- [x] Automated sitemap + robots pipeline deployed with ISR/on-demand revalidation wired to CMS triggers.
- [x] `npm run validate` extended to fail when metadata or schema requirements missing on indexable routes.
- [x] Core Web Vitals telemetry streamed to Plausible/custom endpoint; regression thresholds documented.
- [x] Documentation updated (README snippets) and knowledge share recorded; follow-up tickets logged for additional schema types.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

## Notes
- Prep homepage metadata kickoff doc before 2025-10-29, outlining hand-off from TSK-FE-005 skeleton merge and mapping component slots to metadata requirements.
- Kick-off doc ready in `docs/runbooks/seo-homepage-metadata-kickoff.md`; circulate during sprint planning to unblock metadata factory implementation.
- Draft initial `metadataFactory` API proposal referencing Next.js 15 metadata contract and `next-seo` helpers; review with Frontend + SEO leads.
- Collect structured data examples from `docs/PRDs/requierments/homepage/feature-requirements.md` to pre-populate JSON-LD fixtures for homepage launch day.

## Outcome
- Added `src/lib/seo/metadata.ts`, `structured-data.ts`, and route factories powering homepage, vertical hubs, categories, and article metadata/JSON-LD.
- Wired homepage, hub, and article pages to consume the shared factories and emit JSON-LD via the reusable `<JsonLd>` helper.
- Introduced Web Vitals telemetry (`WebVitalsReporter`) dispatching `WebVitalsMetric` events into Plausible; documented workflow updates in `docs/runbooks/seo-operations.md`.
- Extended CI guardrails with `npm run check:seo` (Vitest suite + Ajv validators) invoked by `npm run validate`; Vitest config now includes `src/**/*.spec.ts`.
