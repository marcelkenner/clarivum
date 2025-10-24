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
created_at: 2025-10-27
updated_at: 2025-10-27
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
- [ ] Confirm supported countries, currency (PLN baseline), and branding assets with product and marketing.
- [ ] Stripe dashboard configuration planned (payment method enablement, domain association) with security approval.
- [ ] Przelewy24 Google Pay fallback requirements reviewed alongside `TSK-PLAT-031`.
- [ ] QA test matrix drafted (desktop Chrome, Android Chrome, edge cases) with wallet simulators identified.
- [ ] Telemetry and analytics events defined for wallet starts/completions/cancellations.

## Definition of Done
- [ ] Google Pay enabled in Stripe with domain verification and test transactions passing SCA requirements.
- [ ] Checkout UI exposes Google Pay button via Payment Element; fallback through Przelewy24 validated.
- [ ] Webhooks and ledger entries capture wallet-specific metadata; finance reconciliation updated.
- [ ] Documentation (`docs/runbooks/payments-operations.md`) updated with maintenance steps and troubleshooting; support playbooks notified.
- [ ] Follow-up tasks filed for expanded locale support or wallet-specific promotions.
