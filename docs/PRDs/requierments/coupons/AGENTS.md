# docs/PRDs/requierments/coupons · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Scope
- Governs the coupons and deals hub, including filtering rules, gating, and affiliate disclosures.
- Ensures coupon metadata in Strapi maps cleanly into Next.js experiences and analytics funnels.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/recommendations/feature-requirements.md`, `docs/PRDs/requierments/subscriptions/feature-requirements.md`.
- Consult legal requirements in `docs/PRDs/requierments/legal/feature-requirements.md` and confirm affiliate guidelines before editing disclosures.

## Execution Guardrails
- Maintain taxonomy parity (verticals, offer categories) with recommendations and Strapi models—document any new facet before rollout.
- Validate gating logic against auth/profile capabilities; subscriber-only offers must fail safe.
- Keep performance targets in mind when proposing client filtering vs SSR; capture caching strategy decisions in ADRs if they impact infra.
- Ensure analytics tagging for coupon events matches the canonical schema defined in the analytics PRD.

## Handoff Checklist
- Expiration automation or cron updates documented with owners and schedules.
- Legal reviewed disclosure copy; partner links tested in the dev environment with analytics verification.
- Notify support and marketing when offer states change (new, expiring, archived) and update playbooks as needed.
