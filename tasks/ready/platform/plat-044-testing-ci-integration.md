---
id: TSK-PLAT-044
title: Integrate Testing Suites into CI Pipeline
status: ready
area: platform
subarea: ci-tooling
owner: Platform Tech Lead
collaborators:
  - QA Lead
  - Frontend Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/adr/ADR-015-testing-strategy.md
  - docs/PRDs/requierments/testing-stack/feature-requirements.md
  - docs/QA/testing-strategy.md
  - docs/runbooks/testing-stack.md
context7:
  - /vercel/next.js
  - /microsoft/playwright
  - /vitest/dev
tags:
  - ci
  - testing
  - guardrail
---

## Summary
Extend GitHub Actions so `npm run test` (Vitest) and `npm run test:e2e -- --project smoke` run on every pull request, publish artifacts, and respect branch protection requirements described in ADR-015.

## Definition of Ready
- [ ] Confirm required secrets and OIDC roles with DevOps.
- [ ] Align runtime budgets and parallelization approach with QA.
- [ ] Update `package.json` scripts to match documented commands.
- [ ] Draft changes to `.github/workflows/ci.yml` and `sisu-on-bug.yml` for asynchronous review.

## Definition of Done
- [ ] `ci.yml` runs lint, typecheck, unit tests, and smoke e2e suites with artifact uploads.
- [ ] Failing Playwright runs annotate PRs with trace links and Slack notifications.
- [ ] Branch protection rules updated to require new checks.
- [ ] Runbooks (`docs/runbooks/testing-stack.md`, `docs/runbooks/deployment.md`) and QA guide reflect the CI flow.
- [ ] Metrics pipeline captures duration + pass/fail counts for the new jobs.
