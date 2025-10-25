---
id: TSK-QA-001
title: Establish Playwright E2E Smoke Suite
status: backlog
area: qa
subarea: e2e-testing
owner: QA Lead
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-21
links:
  - docs/PRDs/first_steps.md#8
  - docs/runbooks/deployment.md
  - docs/PRDs/clarivum_brand.md
  - docs/adr/ADR-015-testing-strategy.md
context7:
  - /microsoft/playwright
  - /vercel/next.js
  - /auth0/docs
tags:
  - testing
  - smoke-tests
  - qa
---

## Summary
Introduce Playwright-based smoke coverage for Clarivum’s critical funnels (home → pillar start → CTA) running in CI on previews and the dev environment.

## Definition of Ready
- [ ] Confirm prioritized user journeys and CTA destinations with business analyst/product.
- [ ] Obtain dev credentials, seeded data strategy, and environment URLs from DevOps.
- [ ] Define artifact retention (videos, traces) and reporting expectations with engineering/QA.
- [ ] Document how tests integrate with feature flags for staged rollouts.

## Definition of Done
- [ ] Playwright configured with `npm run test:e2e` script and environment-specific configuration.
- [ ] Smoke tests implemented for Skin, Fuel, and Habits primary funnels.
- [ ] CI workflow triggers tests on PR previews and dev deploys with results surfaced in Slack/dashboard.
- [ ] Documentation updated in `docs/role-guides/qa.md` and deployment runbook.
- [ ] Follow-up tasks created for broader regression coverage.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Move to `ready/` once environments and data resets are finalized. Coordinate with frontend team on selectors/data hooks to keep tests resilient.
