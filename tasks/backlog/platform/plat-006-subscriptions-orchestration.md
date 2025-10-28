---
id: TSK-PLAT-006
title: Orchestrate Subscription & Membership Platform
status: backlog
area: platform
subarea: subscriptions
owner: Revenue Engineering Lead
collaborators:
  - Backend Engineer
  - Product Manager
  - Finance Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/adr/ADR-011-payments-and-checkout-orchestration.md
  - docs/runbooks/payments-operations.md
context7:
  - /stripe/stripe
  - /payu/docs
  - /supabase/supabase
tags:
  - subscriptions
  - payments
  - revenue
---

## Summary
Deliver the membership infrastructure that powers subscription checkout, entitlements, renewals, and lifecycle webhooks across Stripe, PayU, and Supabase so users can purchase and retain Clarivum offerings.

## Definition of Ready
- [x] Product catalog/plan rules finalized: plans `Member`, `Subscriber` (monthly/yearly with 14-day trial), `Ebook Bundle`, `Gift`; proration via Stripe default; discounts via coupons/promo codes; vouchers through mission coupon table; gift flow emails claim token.
- [x] Supabase schema/idempotency aligned: tables `subscriptions`, `invoices`, `payments`, `entitlements`, `claims`, `webhook_events` with idempotency key `SUBS:<cust_id>:<action>:<ts>` stored unique and writes via security-definer RPCs.
- [x] Legal/compliance checklist complete: VAT via Stripe Tax; ToS/consent snapshots in `consent_acceptances`; refund policy 14 days (digital exceptions) and chargeback playbook documented.
- [x] Checkout UX sequencing agreed: Stripe Checkout happy path with 3DS fallback handled by Stripe, error recovery CTA, receipts via SES/Novu with templates stored in Novu & Strapi.
- [x] Wallet enablement scoped: wallets behind Flagsmith (`wallets.enabled`, `wallets.apple`, `wallets.google`) post-MVP referencing TSK-PLAT-032/033 rollout.

## Definition of Done
- [ ] Checkout flows implemented with Stripe + PayU integrations, including edge cases and retries.
- [ ] Supabase entitlements + invoices synchronized via secure webhooks.
- [ ] Renewal, cancellation, and dunning automations configured and tested.
- [ ] Analytics + observability instrumentation shipped (conversion, churn, errors).
- [ ] Runbooks updated with support playbooks and rollback strategy.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
