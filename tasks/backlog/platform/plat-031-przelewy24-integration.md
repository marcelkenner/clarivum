---
id: TSK-PLAT-031
title: Integrate Przelewy24 Payment Rail
status: backlog
area: platform
subarea: payments
owner: Revenue Engineering Lead
collaborators:
  - Backend Engineer
  - QA Lead
  - Finance Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-011-payments-and-checkout-orchestration.md
  - docs/runbooks/payments-operations.md
context7:
  - /stripe/stripe
  - /payu/docs
  - /aws/aws-cli
tags:
  - payments
  - przelewy24
  - revenue
---

## Summary
Add Przelewy24 as a first-class Clarivum payment option, covering contract onboarding, API integration, webhook processing, and reconciliation so Polish users gain local payment coverage alongside Stripe and PayU.

## Definition of Ready
- [x] Merchant onboarding checklist created covering contracts, sandbox creds, settlement accounts with Finance owner.
- [x] API flows mapped: checkout, refund, chargeback scenarios aligned to subscription use cases with error normalization to Stripe codes.
- [x] Webhook infra plan aligned with `TSK-PLAT-006`: shared idempotency and retry/backoff plus observability hooks.
- [x] QA matrix prepared with sandbox data and manual regression coverage documented.
- [x] Compliance requirements captured: receipt formatting, dispute timelines, retention expectations signed off by Legal.

## Definition of Done
- [ ] Przelewy24 sandbox integrated with checkout, entitlements, and analytics instrumentation; QA sign-off recorded.
- [ ] Production credentials secured in AWS Secrets Manager and rotated per policy.
- [ ] Webhook handlers deployed with idempotency, signature validation, and alerting for failure scenarios.
- [ ] Finance reporting and reconciliation exports validated end-to-end.
- [ ] Support documentation and incident response playbooks updated; follow-up items logged for optimizations or new payment methods.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
