---
id: TSK-FE-020
title: Add Client Interaction Test Suite
status: backlog
area: frontend
subarea: testing
owner: Frontend Lead
collaborators: [Platform Tech Lead, QA Lead]
effort: medium
created_at: 2025-11-03
updated_at: 2025-11-03
links:
  - docs/PRDs/first_steps.md#8
  - docs/adr/ADR-015-testing-strategy.md
  - docs/QA/testing-strategy.md
context7:
  - /vitest/cli
  - /testing-library/user-event
tags:
  - testing
  - vitest
  - guardrail
---

## Summary
Introduce an interaction-focused Vitest suite that covers client components and shared hooks, giving us a fast safety net before Playwright regression passes.

## Definition of Ready
- [ ] Candidate flows agreed with product/QA (e.g., onboarding wizard, feature flag toggles).
- [ ] Required mocks/stubs documented (Auth0, Supabase, feature flag APIs).
- [ ] Test data fixtures reviewed with security for PII compliance.

## Definition of Done
- [ ] Interaction suite scaffolding added (directory structure, helper utilities, sample test).
- [ ] `npm run test:interaction` (or similar) wired into CI `ci.yml`.
- [ ] Documentation updated (`tests/AGENTS.md`, relevant role guides) to outline when to use the suite.
- [ ] Follow-up tasks created for remaining flows not covered by the initial interaction specs.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
- Coordinate with QA-001 (Playwright smoke) to avoid duplicate coverage.
- Evaluate MSW or mocked service workers if network-bound hooks require deterministic responses.
