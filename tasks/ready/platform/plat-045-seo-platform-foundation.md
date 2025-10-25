---
id: TSK-SEO-001
title: Ship SEO Platform Foundation
status: ready
area: platform
subarea: frontend-platform
owner: Frontend Platform Lead
collaborators:
  - SEO Lead
  - Content Operations Manager
  - Analytics Engineer
effort: large
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/seo-foundation.md
  - docs/adr/ADR-034-seo-foundation-and-governance.md
  - docs/runbooks/seo-operations.md
  - docs/policies/seo-governance.md
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
- [ ] Metadata utilities shipped with unit tests and sample implementation on homepage + pillar template.
- [ ] Structured data modules (Article, FAQPage, Product, BreadcrumbList) validated with Ajv tests and Rich Results checks.
- [ ] Automated sitemap + robots pipeline deployed with ISR/on-demand revalidation wired to CMS triggers.
- [ ] `npm run validate` extended to fail when metadata or schema requirements missing on indexable routes.
- [ ] Core Web Vitals telemetry streamed to Plausible/custom endpoint; regression thresholds documented.
- [ ] Documentation updated (README snippets) and knowledge share recorded; follow-up tickets logged for additional schema types.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

