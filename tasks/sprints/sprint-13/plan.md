---
id: sprint-13
title: Sprint 13 Plan
status: planned
start: 2026-05-12
end: 2026-05-23
updated_at: 2025-10-28
links:
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
  - docs/runbooks/background-jobs.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/PRDs/requierments/pdf-converter/requirements.md
---

# Sprint 13 Plan (Early Summer Weeks 1–2)

- **Window:** 2026-05-12 → 2026-05-23  
- **Sprint Goal:** Build the PDF/EPUB generation pipeline, watermarking, and entitlement delivery flows so Clarivum can ship premium digital products with auditability.  
- **Theme:** “Digital product engine” — connect content, rendering, and fulfillment into a resilient service.  
- **Owners:** Digital Products Platform Lead, Fulfillment Engineer, QA Lead  
- **Slack check-ins:** `#clarivum-platform`, `#clarivum-content`, `#clarivum-support`, `#clarivum-qa`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-018-pdf-ebook-pipeline.md`](../../backlog/platform/plat-018-pdf-ebook-pipeline.md) | Backlog → Ready → In-progress | Implement PDF/EPUB generation service + accessibility QA |
| [`tasks/backlog/platform/plat-027-ebook-watermarking-implementation.md`](../../backlog/platform/plat-027-ebook-watermarking-implementation.md) | Backlog → Ready → In-progress | Personalized watermarking + audit logging |
| [`tasks/backlog/platform/plat-008-ebooks-delivery.md`](../../backlog/platform/plat-008-ebooks-delivery.md) | Backlog → Ready → In-progress | Delivery flow, signed URLs, lifecycle notifications |

### Stretch

- [`tasks/backlog/platform/plat-041-guest-account-claim-workflow.md`](../../backlog/platform/plat-041-guest-account-claim-workflow.md) — polish guest claim UX if pipeline lands early.
- [`tasks/backlog/shared/shared-004-newsletter-lifecycle.md`](../../backlog/shared/shared-004-newsletter-lifecycle.md) — add ebook nurture sequence triggers.

## Definition of Success

- Rendering pipeline produces accessible PDFs/EPUBs from Strapi content with monitoring + retries.
- Watermarking applies personalized metadata, logs audits, and integrates with Aurora tables.
- Delivery flow handles entitlements, signed URLs, localization, and lifecycle notifications with telemetry.
- Runbooks (ebooks fulfillment, account claiming, background jobs) updated with rendering, watermarking, and delivery procedures; QA smoke tests pass.

## Dependencies & Prep

- Collect final content + image assets, confirm licensing constraints with legal.
- Ensure fulfillment orchestrator + guest claim flows (Sprint 06) are stable for integration.
- Align accessibility QA tooling with QA team; procure pdf/epub validators.
- Coordinate with Ops Hub to surface fulfillment metrics.

## Risks & Mitigations

- **Render flake** → introduce idempotent jobs + structured logging; capture failing artifacts for debugging.
- **Watermark performance** → benchmark worker capacity; adjust concurrency + caching as needed.
- **Delivery email churn** → keep notifications behind feature flag; add warning if claim delays exceed SLA.

## Key Dates

- **Sprint Planning:** 2026-05-12  
- **Render pipeline dry run:** 2026-05-18  
- **Demo & Retro:** 2026-05-23

---

Sprint 13 delivers the engines behind Clarivum’s digital products, clearing the way for QA guardrails and monetization work in late Summer.
