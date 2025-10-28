---
id: TSK-PLAT-018
title: Implement PDF & EPUB Generation Pipeline
status: backlog
area: platform
subarea: digital-products
owner: Platform Engineer
collaborators:
  - Content Platform Lead
  - Marketing Partner
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/pdf-converter/requirements.md
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/runbooks/background-jobs.md
  - docs/runbooks/ebooks-fulfillment.md
context7:
  - /vercel/next.js
  - /playwright/test
  - /auth0/docs
tags:
  - pdf
  - epub
  - digital-products
---

## Summary
Deliver the server-side services, storage integration, and accessibility checks required to generate downloadable PDFs and EPUB 3 files from Clarivum’s Next.js content.

## Definition of Ready
- [x] ADR-024 review complete: dual-path approach confirmed—headless browser for PDF plus EPUB generator from Markdown with noted constraints appended to ADR.
- [x] Source content structure aligned: Strapi fields normalized and Markdown conventions (front-matter, alt text, code blocks) documented with content team.
- [x] Hosting constraints set: headless workloads run on Fargate with 2–4 GB ephemeral storage and concurrency guards approved by DevOps.
- [x] Accessibility QA defined: checklist covering headings, landmarks, contrast, tagging; tooling `axe-core` and `pdfa` checks agreed with QA lead.

## Definition of Done
- [ ] `PdfGenerationManager` and related view models implemented with dependency injection for rendering engines.
- [ ] API routes/background jobs generate PDFs and EPUBs, storing results in Supabase Storage with signed download URLs.
- [ ] Automated accessibility checks configured (PDF/UA smoke tests, ACE for EPUB) plus manual spot-check playbook.
- [ ] Observability instrumentation added (timings, success/failure counts) with alerts on prolonged runtimes or errors.
- [ ] Documentation updated (`docs/runbooks/background-jobs.md`, `docs/runbooks/ebooks-fulfillment.md`, developer guide) and hand-off completed with marketing/content stakeholders.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
