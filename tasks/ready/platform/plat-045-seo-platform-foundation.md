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
- [ ] Engineering design walkthrough covers metadata factory API, structured data composition, and sitemap strategy.
- [ ] Acceptance criteria for Core Web Vitals budgets and schema coverage agreed with SEO Lead.
- [ ] CI pipeline updates scoped (lint, tests) with estimated runtime impact documented.
- [ ] Env config approach for robots.txt and sitemap base URLs reviewed.
- [ ] Access to Search Console API credentials confirmed via platform security process.
- [ ] Playwright smoke templates identified for canonical SEO verification.

## Definition of Done
- [ ] Metadata utilities shipped with unit tests and sample implementation on homepage + pillar template.
- [ ] Structured data modules (Article, FAQPage, Product, BreadcrumbList) validated with Ajv tests and Rich Results checks.
- [ ] Automated sitemap + robots pipeline deployed with ISR/on-demand revalidation wired to CMS triggers.
- [ ] `npm run validate` extended to fail when metadata or schema requirements missing on indexable routes.
- [ ] Core Web Vitals telemetry streamed to Plausible/custom endpoint; regression thresholds documented.
- [ ] Documentation updated (README snippets) and knowledge share recorded; follow-up tickets logged for additional schema types.
