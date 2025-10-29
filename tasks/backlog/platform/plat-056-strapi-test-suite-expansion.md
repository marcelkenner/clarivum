---
id: TSK-PLAT-056
title: Expand Strapi Automated Test Coverage
status: backlog
area: platform
subarea: quality
owner: QA Lead
collaborators:
  - Editorial Engineering
  - DevOps Lead
effort: medium
created_at: 2025-10-29
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
context7:
  - /strapi/documentation
  - /vitest-dev/vitest
  - /testing-library/react-testing-library
tags:
  - testing
  - guardrail
  - quality
---

## Summary
Scale the Strapi quality gate beyond lint/typecheck by codifying schema unit tests, integration coverage for API endpoints, and Playwright smoke flows exercised after deployment. Ensure new collections, permissions, and webhooks always ship with guardrails.

## Definition of Ready
- [ ] Inventory existing tests in `cms/tests` and prioritise coverage gaps with Editorial Engineering.
- [ ] Align on acceptance thresholds (minimum suite runtime, coverage targets, blocking vs non-blocking) with platform leadership.
- [ ] Document data fixtures and factories required to run tests in isolation (SQLite vs Postgres).

## Definition of Done
- [ ] Vitest suites cover critical Strapi services (content type schema contracts, lifecycle hooks, webhook handlers) and run as part of `npm run strapi:ci`.
- [ ] Playwright smoke tests execute post-deploy via the Strapi CI/CD workflow and gate production promotion.
- [ ] Documentation (AGENTS, runbooks) updated with the expanded guardrail expectations and how to run suites locally.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
