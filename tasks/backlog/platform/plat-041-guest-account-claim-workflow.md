---
id: TSK-PLAT-041
title: Implement Guest Purchase Claim Workflow
status: backlog
area: platform
subarea: digital-products
owner: Platform Engineer
collaborators:
  - Backend Engineer
  - Lifecycle Marketing Lead
  - Support Ops Lead
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-28
links:
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /auth0/docs
  - /stripe/stripe
tags:
  - entitlements
  - auth
  - digital-products
---

## Summary
Build the backend and automation required to support guest ebook purchases that immediately receive download links while encouraging account claiming via Auth0 magic links and reminder emails.

## Scope
- Stripe checkout webhooks, Aurora profile + entitlement persistence, claim token lifecycle.
- Auth0 magic-link invitation flows and fallback password setup.
- Novu/Listmonk automations for claim reminders and confirmations.
- Analytics event emission, logging, and alerting around claim conversion and download health.

## Dependencies
- ADR-032 approved and any upstream schema migrations merged.
- Auth0 tenant able to send production-ready magic-link emails (branding finalized).
- AWS background job infrastructure (EventBridge + SQS + Lambda per ADR-003) available for nightly reconciliation.
- Listmonk/Listmonk SMTP throughput confirmed for reminder cadence.

## Definition of Ready
- [x] Schema review complete: `claims` table with status history and indices linking guest purchases to email/claim token.
- [x] Auth0 templates/branding approved by Marketing for claim and reminder flows.
- [x] Reminder cadence set: T+24h and T+7d with documented opt-out path.
- [x] Analytics events defined: `entitlement.claim_started`, `entitlement.claimed`, `entitlement.claim_expired`.
- [x] Support tooling requirements captured: admin resend/manual resolution with runbook owners assigned.

## Definition of Done
- [ ] Webhook handlers create pending profiles and entitlements with `pending_claim` status when checkout completes without authenticated context.
- [ ] Claim API verifies Auth0 tokens, links entitlements to the verified user, and emits audit trail entries.
- [ ] Reminder automation implemented (Novu/Listmonk) with configurable cadence and throttling to avoid spam.
- [ ] Unit/integration tests cover pending profile transitions, duplicate purchase handling, and claim retries.
- [ ] Runbooks updated (`docs/runbooks/ebooks-fulfillment.md`, `docs/runbooks/account-claiming.md`) and support tooling exposes resend claim action.
- [ ] Metrics and alerts emit claim conversion funnel data; dashboards updated in `metrics/flow.json` or similar.
- [ ] `npm run ebooks:claim-smoke` added/updated to validate end-to-end guest purchase → claim → shelf hydration.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Work Plan
- [ ] **Schema** — Apply Aurora migration adding `pending_claim_token`, `status`, timestamps, history table.
- [ ] **Webhook Enhancements** — Update Stripe/mission handlers to create pending profiles, log analytics, and enqueue emails.
- [ ] **Claim API** — Build endpoint/server action to validate Auth0 token, finalize profile, and migrate entitlements.
- [ ] **Reminder Automation** — Configure Novu/Listmonk workflows and rate limits; integrate with EventBridge-scheduled workflows.
- [ ] **Support Tooling** — Surface Admin UI controls for resend claim email, merge entitlements, audit logs.
- [ ] **Testing & Observability** — Write contract tests, smoke tests, and add OTel spans / log-based alert thresholds.

## Out of Scope
- Frontend entitlement shelf UI (tracked via `TSK-FE-017`).
- Non-ebook digital products (extend pattern once ebooks launch succeeds).
- SMS-based claim notifications (evaluate separately during rollout retro).
