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
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/PRDs/requierments/pdf-converter/requirements.md
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/runbooks/ebooks-fulfillment.md
context7:
  - /vercel/next.js
  - /playwright/test
  - /websites/aws_amazon-amazonrds-aurorauserguide
tags:
  - ebooks
  - pdf
  - compliance
---

## Summary
Embed personalized watermarking (buyer name + order ID) into generated PDF ebooks, expose Strapi-managed templates, and log watermark application in Aurora for audit trails.

## Definition of Ready
- [x] Watermark copy approved: string includes name, email, order id, timestamp; stored in Strapi content entry with versioning.
- [x] Pipeline architecture validated: reuse ADR-024 shared renderer, inject watermark layer with opacity leveraging mission coupon libs.
- [x] Aurora schema defined: `watermark_logs(user_id, asset_id, ts, hash)` cataloged for audit.

## Definition of Done
- [ ] PDF generation pipeline applies watermark layer using buyer context and stores audit log.
- [ ] Ebooks fulfillment flow verifies watermark before sending download links.
- [ ] QA tests confirm watermark appears consistently and respects localization typography.
- [ ] Documentation updated in PRD and `docs/runbooks/ebooks-fulfillment.md`; support receives SOP.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
