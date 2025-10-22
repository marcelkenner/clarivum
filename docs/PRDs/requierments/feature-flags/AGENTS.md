# docs/PRDs/requierments/feature-flags · AGENTS Guide

## Scope
- Outlines Flagsmith usage for progressive delivery, experiments, and safe rollouts across Clarivum.
- Captures targeting rules, ownership expectations, and stale-flag governance.

## Must Read
- `feature-requirements.md`, `docs/adr/ADR-005-feature-flags.md`, `docs/PRDs/requierments/frontend-platform/feature-requirements.md`.
- Reference Flagsmith docs via Context7 before altering SDK patterns or caching strategies.

## Execution Guardrails
- Require owner, rollout plan, and sunset date for every new flag; update inventories shared with product.
- Evaluate impact on server vs client performance; document caching, fallback, and outage behavior.
- Keep experimentation telemetry aligned with analytics dashboards—coordinate when adding multivariate tests.
- Avoid embedding business logic in flag checks; route outcomes through view models/managers for clarity.

## Handoff Checklist
- Update stale-flag CI jobs or lists when introducing new toggles.
- Notify QA and release managers of test scenarios and default states for each environment.
- Record flag rationale and retirement plan in the requirement doc and link to related tasks/runbooks.
