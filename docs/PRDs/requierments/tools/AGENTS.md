# docs/PRDs/requierments/tools · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
## Scope
- Defines interactive tools and calculators (`/narzedzia/` and vertical hubs) that drive engagement, lead capture, and upsell paths.
- Covers tool taxonomy, UX patterns, saved states, exports, and supporting CTAs.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/diagnostics/feature-requirements.md`, `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/coupons/feature-requirements.md`, `docs/runbooks/tools-platform-operations.md`.
- Confirm formulas and disclaimers with subject-matter experts and legal PRD before capturing changes.

## Execution Guardrails
- Keep tool definitions modular with reusable logic packages; avoid embedding formulas directly in UI.
- Respect localization requirements (copy, units) and accessibility targets (keyboard support, 150 ms response).
- Coordinate save/export features with auth/profile and newsletter systems; document data retention plans.
- Instrument completions and CTA conversions per analytics schema; document metrics expectations in the requirement.

## Handoff Checklist
- Validate tool flows (inputs, edge cases, exports, reminders) in the dev environment and record QA outcomes.
- Update marketing/support collateral when launching or modifying tools; attach FAQs or troubleshooting notes.
- Notify observability owners if new tools require additional monitoring or alerting.
