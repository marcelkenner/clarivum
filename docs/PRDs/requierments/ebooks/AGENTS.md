# docs/PRDs/requierments/ebooks · AGENTS Guide

## Scope
- Defines the ebook catalog, purchase flows, and fulfillment experience for `/ebooks/` and vertical catalogs.
- Covers free lead magnets, paid products, bundles, and post-purchase delivery expectations.

## Must Read
- `feature-requirements.md`, `docs/PRDs/clarivum_brand.md`, `docs/PRDs/requierments/subscriptions/feature-requirements.md`, and `docs/PRDs/requierments/coupons/feature-requirements.md` for cross-sell logic.
- Confirm checkout assumptions with relevant ADRs and consult payment platform docs via Context7 when integration details shift.

## Execution Guardrails
- Maintain Strapi schemas for ebook metadata in sync with checkout requirements (pricing, assets, testimonials).
- Ensure fulfillment flows (email delivery, profile library) are resilient and comply with download security policies.
- Keep SEO and performance budgets in mind when proposing dynamic content—document ISR or caching choices.
- Align legal disclosures and refund policies with the legal PRD before changing copy.

## Handoff Checklist
- Validate purchase → access journey end-to-end (checkout, email, profile library) in staging.
- Update analytics dashboards and marketing collateral when introducing new bundles or funnels.
- Brief support on new products, pricing, or fulfillment changes and attach runbook updates if workflows shift.
