---
id: TSK-PLAT-032
title: Enable Google Pay Wallet Support
status: backlog
area: platform
subarea: payments
owner: Revenue Engineering Lead
collaborators:
  - Frontend Engineer
  - QA Lead
  - Finance Partner
effort: small
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/adr/ADR-011-payments-and-checkout-orchestration.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/runbooks/payments-operations.md
context7:
  - /stripe/stripe
  - /stripe-samples/checkout-one-time-payments
tags:
  - payments
  - google-pay
  - wallet
---

## Summary
Activate Google Pay via Stripe’s Payment Element and Przelewy24 redundancy so Clarivum shoppers on supported devices can complete wallet-based checkouts without PCI scope expansion.

## Definition of Ready
- [x] Supported footprint confirmed: launch in PL/EU regions with PLN baseline and approved branding assets.
- [x] Stripe dashboard plan set: enable Google Pay, verify domain, and record security approval.
- [x] Fallback requirements agreed: fall back to Przelewy24 when wallet fails with analytics tracking.
- [x] QA test matrix drafted covering desktop Chrome and Android Chrome with simulator coverage and key edge cases.
- [x] Telemetry events defined: `wallet.start`, `wallet.success`, `wallet.cancel`, `wallet.error`.

## Definition of Done
- [ ] Google Pay enabled in Stripe with domain verification and test transactions passing SCA requirements.
- [ ] Checkout UI exposes Google Pay button via Payment Element; fallback through Przelewy24 validated.
- [ ] Webhooks and ledger entries capture wallet-specific metadata; finance reconciliation updated.
- [ ] Documentation (`docs/runbooks/payments-operations.md`) updated with maintenance steps and troubleshooting; support playbooks notified.
- [ ] Follow-up tasks filed for expanded locale support or wallet-specific promotions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
