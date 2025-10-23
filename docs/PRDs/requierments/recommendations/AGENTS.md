# docs/PRDs/requierments/recommendations · AGENTS Guide

## Scope
- Covers recommendation hubs and editorial product picks, including filtering, disclosures, and affiliate instrumentation.
- Aligns recommendations with coupons, ebooks, and diagnostics-driven personalization.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/coupons/feature-requirements.md`, `docs/PRDs/requierments/analytics/feature-requirements.md`, and legal PRD for disclosure rules.
- Confirm taxonomy alignment with Strapi models before editing filters or page structures.

## Execution Guardrails
- Maintain transparent selection criteria and disclosure copy; ensure updates have legal and editorial sign-off.
- Keep Strapi schema changes coordinated with coupons and tools teams to prevent taxonomy drift.
- Track performance and SEO assumptions (ISR cadence, static generation) when proposing new page types.
- Instrument outbound links consistently; ensure analytics dashboards capture funnel performance.

## Handoff Checklist
- Refresh editorial QA checklists and partner communication when product lineups change.
- Validate affiliate URLs, disclosure rendering, and analytics tracking in the dev environment.
- Update re-review cadences or freshness metrics if recommendation categories expand or contract.
