---
id: TSK-PLAT-008
title: Ship Ebooks Delivery & Entitlement Pipeline
status: backlog
area: platform
subarea: digital-products
owner: Platform Engineer
collaborators:
  - Content Operations Lead
  - Backend Engineer
  - Marketing Automation Lead
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/runbooks/mailing-operations.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /stripe/stripe
  - /listmonk/docs
tags:
  - ebooks
  - digital-products
  - entitlements
---

## Summary
Implement the end-to-end ebook delivery flow—catalog metadata, purchase gating, entitlement storage, and signed URL fulfillment—so Clarivum can monetize and nurture leads with premium content.

## Definition of Ready
- [x] Content ingest strategy finalized: Strapi models `ebook`, `edition`, `asset` using S3 (`public`/`private`) with on-demand watermarking (TSK-PLAT-027) and metadata for hash/version.
- [x] Checkout/entitlement flow aligned: post-purchase webhook feeds Fulfillment Orchestrator (TSK-PLAT-042) to grant entitlements and queue email.
- [x] Email templates defined: Novu templates `ebook_receipt` and `ebook_fulfillment`, localized and stage-previewable.
- [x] Legal/compliance requirements documented: license terms stored per ebook, refund rules surfaced, fulfillment logs retained 365 days.

## Definition of Done
- [ ] Strapi models wired to S3 storage and Aurora entitlements configured for ebooks with localization.
- [ ] Checkout + entitlement API flow implemented with analytics + observability.
- [ ] Signed URL delivery with configurable TTL and watermarking verified.
- [ ] Lifecycle notifications and profile access paths operational.
- [ ] Documentation updated (PRD notes, runbooks, support SOP).
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
