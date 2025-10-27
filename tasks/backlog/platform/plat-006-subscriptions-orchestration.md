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
updated_at: 2025-10-24
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
- [ ] Product catalog and plan requirements finalized (plan matrix, trials, proration rules, discounts/vouchers, gift logic).
- [ ] Supabase schema alignment confirmed (`subscriptions`, `invoices`, `payments`, `entitlements`) with idempotency keys defined.
- [ ] Legal and compliance checklist reviewed (tax/VAT handling, ToS/consent storage, refund policy obligations).
- [ ] Checkout UX sequencing agreed (happy path, 3DS fallback, error recovery flows, receipt email templates).
- [ ] Wallet enablement scope decided (post-MVP if necessary) and feature-flag rollout plan documented.

## Definition of Done
- [ ] Checkout flows implemented with Stripe + PayU integrations, including edge cases and retries.
- [ ] Supabase entitlements + invoices synchronized via secure webhooks.
- [ ] Renewal, cancellation, and dunning automations configured and tested.
- [ ] Analytics + observability instrumentation shipped (conversion, churn, errors).
- [ ] Runbooks updated with support playbooks and rollback strategy.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
