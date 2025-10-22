# docs/PRDs/requierments/subscriptions · AGENTS Guide

## Scope
- Defines subscription and membership experiences: plan catalogs, checkout, billing, lifecycle messaging, and access control.
- Interfaces with ebooks, coupons, profile, and analytics to deliver recurring value.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/profile/feature-requirements.md`, `docs/PRDs/requierments/coupons/feature-requirements.md`, and legal guidance on billing.
- Consult payment processor documentation through Context7 (Stripe Billing, etc.) before altering integration assumptions.

## Execution Guardrails
- Keep plan definitions centralized (Strapi or billing platform) and document how each maps to entitlements.
- Capture compliance obligations (VAT, renewal notices) and ensure legal copy remains synchronized.
- Specify lifecycle touchpoints (welcome, renewal, churn saves) with newsletter team; avoid duplicate messaging.
- Budget performance for checkout APIs and account management flows; note caching and error fallback behaviors.

## Handoff Checklist
- Validate checkout → entitlement activation → profile access end-to-end with analytics tracking.
- Update finance/support runbooks when pricing, trials, or cancellation flows change.
- Notify marketing of plan changes so promotional assets and funnels stay accurate.
