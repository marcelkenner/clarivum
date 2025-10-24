# docs/PRDs/requierments/homepage · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Scope
- Describes the `/` experience, including hero storytelling, vertical entry points, and newsletter/tool highlights.
- Ensures homepage modules respect brand pillars and feed priority funnels (ebooks, diagnostics, subscriptions).

## Must Read
- `feature-requirements.md`, `docs/PRDs/clarivum_brand.md`, `docs/PRDs/requierments/analytics/feature-requirements.md`, `docs/PRDs/requierments/components/feature-requirements.md`.
- Confirm personalization rules with diagnostics/profile PRDs before altering conditional content.

## Execution Guardrails
- Maintain consistent CTA language and Jade accent usage; align any experiments with feature flag governance.
- Keep performance and SEO requirements explicit (ISR strategy, hero image budgets, structured data).
- Coordinate trust signals (testimonials, metrics) with legal and marketing to ensure freshness and approvals.
- Personalization decisions must degrade gracefully when diagnostics data is unavailable; document fallbacks.

## Handoff Checklist
- Validate hero → target funnel journey (CTA click-through, analytics tracking) in the dev environment.
- Update marketing and lifecycle teams when homepage messaging or promotions change.
- Refresh support and incident playbooks if new modules introduce additional dependencies (e.g., feature flags, coupons).
