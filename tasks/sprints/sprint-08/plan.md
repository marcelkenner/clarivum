---
id: sprint-08
title: Sprint 08 Plan
status: planned
start: 2026-03-03
end: 2026-03-14
updated_at: 2025-10-27
links:
  - docs/adr/ADR-011-payments-and-checkout-orchestration.md
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-026-coupons-and-affiliate-incentives.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/adr/ADR-008-product-analytics-platform.md
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/affiliate-ad-ops.md
  - docs/runbooks/payments-operations.md
  - docs/runbooks/notifications.md
---

# Sprint 08 Plan (Winter Weeks 9–10)

- **Window:** 2026-03-03 → 2026-03-14  
- **Sprint Goal:** Complete payment rail enablement (SES, Przelewy24, Google Pay, Apple Pay) and ensure checkout telemetry/consent flows are production-ready ahead of Spring experiments.  
- **Theme:** “Payment confidence” — harden all transaction paths, compliance guardrails, and wallet UX prior to broader growth work.  
- **Owners:** Revenue Engineering Lead, Platform Engineer, Frontend Checkout pod, Finance Ops Lead  
- **Slack check-ins:** `#clarivum-revenue`, `#clarivum-platform`, `#clarivum-frontend`, `#clarivum-support`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-030-amazon-ses-tenancy.md`](../../backlog/platform/plat-030-amazon-ses-tenancy.md) | Backlog → Ready → In-progress | Secure SES production access, bounce pipeline, monitoring |
| [`tasks/backlog/platform/plat-031-przelewy24-integration.md`](../../backlog/platform/plat-031-przelewy24-integration.md) | Backlog → Ready → In-progress | Integrate Przelewy24 API + webhooks + reconciliation |
| [`tasks/backlog/platform/plat-032-google-pay-wallet.md`](../../backlog/platform/plat-032-google-pay-wallet.md) | Backlog → Ready → In-progress | Enable Google Pay in Stripe + UX fallbacks + telemetry |
| [`tasks/backlog/platform/plat-033-apple-pay-wallet.md`](../../backlog/platform/plat-033-apple-pay-wallet.md) | Backlog → Ready → In-progress | Configure Apple Pay merchant IDs, certs, UI, analytics |
| [`tasks/backlog/frontend/fe-008-authentication-experience.md`](../../backlog/frontend/fe-008-authentication-experience.md) | Backlog → Ready → In-progress | Refine auth/checkout flows for wallets, re-auth, and UX copy |
| [`tasks/backlog/shared/shared-006-legal-compliance-surface.md`](../../backlog/shared/shared-006-legal-compliance-surface.md) | Backlog → Ready → In-progress | Finalize policy surfaces & disclosures for new payment rails |

### Stretch

- [`tasks/backlog/qa/qa-002-uv-widget-validation.md`](../../backlog/qa/qa-002-uv-widget-validation.md) — validate UV workflows if payment QA wraps early (keeps Winter backlog small).
- [`tasks/backlog/shared/shared-004-newsletter-lifecycle.md`](../../backlog/shared/shared-004-newsletter-lifecycle.md) — add renewal-specific journeys after wallets stabilize.

## Definition of Success

- SES production access granted with bounce/complaint pipeline feeding audits + dashboards.
- Przelewy24 integration handles checkout, refund, and webhook flows with observability + finance reconciliation.
- Google Pay and Apple Pay wallets enabled, verified, and instrumented with fallback telemetry + analytics.
- Authentication UX supports re-auth + wallet error handling; copies reviewed by legal/localization.
- Compliance surfaces updated (policy pages, receipts, disclosures) to cover new payment methods.
- QA + runbooks updated (payments operations, notifications, support SOP), finance/support trained with new flows.

## Dependencies & Prep

- Secure finance/legal approvals for wallet rollout and SES request before sprint start.
- Gather sandbox credentials, domain verification assets, and device test matrix for wallets.
- Coordinate with Support Ops to script new macros + fallback comms.
- Ensure Sprint 06 outputs (subscriptions, claim, fulfillment) are stable for wallet QA to build on.

## Risks & Mitigations

- **Provider approval delays** → submit paperwork ahead of sprint; maintain feature flags for gradual enablement.
- **Wallet device coverage gaps** → leverage simulators + remote device lab; capture manual QA checklist.
- **Compliance copy churn** → timebox review cycles, capture deltas in PTRD follow-up tasks.

## Key Dates

- **Sprint Planning:** 2026-03-03  
- **Wallet device QA day:** 2026-03-10 (paired testing across supported devices)  
- **Finance/Support enablement + Retro:** 2026-03-14

---

Sprint 08 clears all payment rail risk so Spring design/prototype work can build customer experiences without undermining revenue compliance.
