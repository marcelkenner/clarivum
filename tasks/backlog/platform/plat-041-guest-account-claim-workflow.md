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
updated_at: 2025-10-27
links:
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
context7:
  - /supabase/supabase
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
- Stripe checkout webhooks, Supabase profile + entitlement persistence, claim token lifecycle.
- Auth0 magic-link invitation flows and fallback password setup.
- Novu/Listmonk automations for claim reminders and confirmations.
- Analytics event emission, logging, and alerting around claim conversion and download health.

## Dependencies
- ADR-032 approved and any upstream schema migrations merged.
- Auth0 tenant able to send production-ready magic-link emails (branding finalized).
- Supabase background job infrastructure available for nightly reconciliation (ADR-003).
- Listmonk/Listmonk SMTP throughput confirmed for reminder cadence.

## Definition of Ready
- [ ] Supabase schema changes for `profiles.status`, claim tokens, and entitlement status history reviewed with DBA.
- [ ] Auth0 email template drafts and branding reviewed by marketing.
- [ ] Lifecycle & support stakeholders sign off on reminder cadence (24h, 7d) and messaging copy.
- [ ] Analytics events (`entitlement.claim_initiated`, `entitlement.claim_success`) defined with tracking plan entry.
- [ ] Support tooling requirements (resend claim, merge entitlements) refined with ops.
- [ ] Runbook updates outlined with owners (`docs/runbooks/ebooks-fulfillment.md`, `docs/runbooks/account-claiming.md`).

## Definition of Done
- [ ] Webhook handlers create pending profiles and entitlements with `pending_claim` status when checkout completes without authenticated context.
- [ ] Claim API verifies Auth0 tokens, links entitlements to the verified user, and emits audit trail entries.
- [ ] Reminder automation implemented (Novu/Listmonk) with configurable cadence and throttling to avoid spam.
- [ ] Unit/integration tests cover pending profile transitions, duplicate purchase handling, and claim retries.
- [ ] Runbooks updated (`docs/runbooks/ebooks-fulfillment.md`, `docs/runbooks/account-claiming.md`) and support tooling exposes resend claim action.
- [ ] Metrics and alerts emit claim conversion funnel data; dashboards updated in `metrics/flow.json` or similar.
- [ ] `npm run ebooks:claim-smoke` added/updated to validate end-to-end guest purchase → claim → shelf hydration.

## Work Plan
- [ ] **Schema** — Apply Supabase migration adding `pending_claim_token`, `status`, timestamps, history table.
- [ ] **Webhook Enhancements** — Update Stripe/mission handlers to create pending profiles, log analytics, and enqueue emails.
- [ ] **Claim API** — Build endpoint/server action to validate Auth0 token, finalize profile, and migrate entitlements.
- [ ] **Reminder Automation** — Configure Novu/Listmonk workflows and rate limits; integrate with Supabase cron job.
- [ ] **Support Tooling** — Surface Admin UI controls for resend claim email, merge entitlements, audit logs.
- [ ] **Testing & Observability** — Write contract tests, smoke tests, and add OTel spans / log-based alert thresholds.

## Out of Scope
- Frontend entitlement shelf UI (tracked via `TSK-FE-017`).
- Non-ebook digital products (extend pattern once ebooks launch succeeds).
- SMS-based claim notifications (evaluate separately during rollout retro).
