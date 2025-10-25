---
id: sprint-06
title: Sprint 06 Plan
status: planned
start: 2026-02-03
end: 2026-02-14
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/PRDs/requierments/profile/feature-requirements.md
  - docs/runbooks/payments-operations.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
  - docs/adr/ADR-011-payments-and-checkout-orchestration.md
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
---

# Sprint 06 Plan (Winter Weeks 5–6)

- **Window:** 2026-02-03 → 2026-02-14  
- **Sprint Goal:** Ship the revenue-critical flows—subscriptions, guest claim, fulfillment guardrails, and the entitlement shelf—so digital products generate value and support can self-serve.  
- **Theme:** “Revenue readiness” — orchestrate payments-to-entitlement flows with observability + UX guardrails.  
- **Owners:** Revenue Engineering Lead, Platform Engineer, Frontend Account Center pod, Support Ops Lead  
- **Slack check-ins:** `#clarivum-revenue`, `#clarivum-platform`, `#clarivum-frontend`, `#clarivum-support`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-006-subscriptions-orchestration.md`](../../backlog/platform/plat-006-subscriptions-orchestration.md) | Backlog → Ready → In-progress | Stripe/PayU checkout, entitlements + renewals |
| [`tasks/backlog/platform/plat-041-guest-account-claim-workflow.md`](../../backlog/platform/plat-041-guest-account-claim-workflow.md) | Backlog → Ready → In-progress | Guest purchase claim automation + reminders |
| [`tasks/backlog/platform/plat-042-fulfillment-orchestrator-guardrails.md`](../../backlog/platform/plat-042-fulfillment-orchestrator-guardrails.md) | Backlog → Ready → In-progress | Durable fulfillment jobs, reconciliation, alerts |
| [`tasks/backlog/frontend/fe-017-entitlement-shelf-ui.md`](../../backlog/frontend/fe-017-entitlement-shelf-ui.md) | Backlog → Ready → In-progress | Account Center shelf UX for downloads + status |

### Stretch

- `tasks/backlog/platform/plat-025-consent-test-automation.md` for checkout/legal follow-up if subscriptions land faster than expected.
- Begin `tasks/backlog/shared/shared-004-newsletter-lifecycle.md` capture flows tied to post-purchase onboarding.

## Definition of Success

- Unified checkout handles subscriptions + digital products with resilient retries and telemetry; Supabase entitlements stay in sync.
- Guest claim workflow runs end-to-end (webhooks → reminder automation → claim API) with audit trail + metrics.
- Fulfillment orchestrator queue exposes retries, dashboards, and reconciliation jobs; alerts wired to on-call + support.
- Entitlement shelf surfaces real-time status, download cards, and claim prompts with accessibility + analytics coverage.
- Runbooks (payments, fulfillment, account-claiming) updated and support team trained via recorded session.

## Dependencies & Prep

- Confirm product catalog (plans, coupons) + legal copy by 2026-01-30.
- Align Auth0 magic-link templates + Novu/Listmonk reminder content with marketing/legal.
- Validate Supabase schema migrations + RLS changes in staging before sprint start.
- Ensure instrumentation hooks from Sprint 05 Ops Hub are available for monitoring fulfillment signals.

## Risks & Mitigations

- **Payment provider delays** → stub sandbox responses + feature-flag flows to keep FE dev unblocked.
- **Entitlement data drift** → run nightly reconciliation from day one; create Kaizen guardrail if variance >0.5%.
- **Support readiness** → schedule live walkthrough + produce job aids before enabling guests.

## Key Dates

- **Sprint Planning:** 2026-02-03  
- **Revenue dry run:** 2026-02-10 (test guest purchase → claim → shelf)  
- **Demo & Retro:** 2026-02-14 (include support + finance observers)

---

Sprint 06 converts the Ops Hub groundwork into customer-facing value. Its telemetry + fulfillment events become the signals that Notification/Lifecycle (Sprint 07) and Monetization telemetry (Sprint 08) depend on.
