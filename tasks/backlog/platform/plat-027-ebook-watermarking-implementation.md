---
id: TSK-PLAT-027
title: Implement Personalized Ebook Watermarking
status: backlog
area: platform
subarea: digital-products
owner: Platform Engineer
collaborators:
  - Content Platform Lead
  - Legal Partner
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-26
links:
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/PRDs/requierments/pdf-converter/requirements.md
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/runbooks/ebooks-fulfillment.md
context7:
  - /vercel/next.js
  - /playwright/test
  - /supabase/supabase
tags:
  - ebooks
  - pdf
  - compliance
---

## Summary
Embed personalized watermarking (buyer name + order ID) into generated PDF ebooks, expose Strapi-managed templates, and log watermark application for audit trails.

## Definition of Ready
- [ ] Watermark copy approved by legal/marketing and stored in Strapi.
- [ ] PDF generation pipeline architecture validated with mission coupon team (shared components).
- [ ] Supabase schema ready for storing watermark logs.

## Definition of Done
- [ ] PDF generation pipeline applies watermark layer using buyer context and stores audit log.
- [ ] Ebooks fulfillment flow verifies watermark before sending download links.
- [ ] QA tests confirm watermark appears consistently and respects localization typography.
- [ ] Documentation updated in PRD and `docs/runbooks/ebooks-fulfillment.md`; support receives SOP.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

