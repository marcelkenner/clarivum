# docs/PRDs/requierments/tools/fuel/narzedzia · AGENTS Guide

## Scope
- Individual tool PRDs for Clarivum Fuel calculators, planners, analyzers, and data sets.
- Defines formulas, business rules, state management, content hooks, and analytics for `/fuel/narzedzia/*`.

## Workflow Notes
- Follow the Feature Requirements template; keep files < 500 lines and focused on one tool.
- Cross-link to shared services (Profile, Meal Plans, Shopping Lists) instead of duplicating requirements.
- Align ingredient and nutritional thresholds with `docs/policies/food-claims.md` (update if new claims arise).

## Collaboration
- Product science lead validates formulas; content lead approves copy tone & disclaimers.
- Analytics owner configures GA4 + server events; document naming conventions inside each PRD.

## Before You Ship Changes
- Run `npm run validate` after updating PRDs to catch formatting/link issues.
- Notify Docs maintainers if taxonomy or navigation slugs change (`docs/PRDs/clarivum_brand.md`).
