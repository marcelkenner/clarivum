# docs/PRDs/requierments/testing-stack · AGENTS Guide

## Scope
- Defines Clarivum’s automated testing strategy across unit (Vitest), component (Testing Library), and e2e (Playwright) layers.
- Coordinates coverage expectations, tooling configuration, and CI enforcement for feature delivery.

## Must Read
- `feature-requirements.md`, `docs/role-guides/qa.md`, `docs/checklists/pull-request.md`, and analytics PRD for funnel monitoring alignment.
- Reference Vitest, Testing Library, and Playwright docs via Context7 before altering tooling or runtime assumptions.

## Execution Guardrails
- Keep tests behavior-focused; document fixtures and utilities so teams can reuse them without coupling.
- Track runtime budgets (PR pipeline <10 min, nightly e2e <15 min) and raise ADRs if tooling changes impact targets.
- Align visual or accessibility testing additions with component/storybook requirements—avoid duplicate coverage.
- Ensure secrets and test data strategies follow security policies; no real PII in fixtures.

## Handoff Checklist
- Update CI configuration and `package.json` scripts when suite composition changes; run `npm run lint` + relevant tests before sign-off.
- Refresh testing strategy docs and onboarding material with new coverage maps or conventions.
- Notify feature owners when adding smoke tests for their funnels so they can monitor results.
