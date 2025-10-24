---
id: TSK-FE-019
title: Maintain Component Coverage Targets
status: backlog
area: frontend
subarea: testing
owner: Frontend Lead
collaborators: [QA Lead]
effort: small
created_at: 2025-11-03
updated_at: 2025-11-03
links:
  - docs/PRDs/first_steps.md#8
  - docs/adr/ADR-015-testing-strategy.md
context7:
  - /vitest/cli
  - /testing-library/react
tags:
  - testing
  - coverage
---

## Summary
Document and enforce Vitest coverage targets for Clarivum’s shared UI modules so each sprint can track progress against the minimum line (70%) and branch (60%) thresholds defined in ADR-015.

## Definition of Ready
- [ ] Coverage baselines collected for `src/app` server components and shared utilities.
- [ ] Dashboard/metrics consumers aligned on how coverage data feeds into `metrics/coverage.json`.
- [ ] Follow-up owners identified for packages that fall more than 10 percentage points below target.

## Definition of Done
- [ ] Coverage goals and current percentages published in `docs/role-guides/frontend.md` (or linked doc).
- [ ] GitHub issue template or checklist updated so PRs capture coverage deltas automatically.
- [ ] Backlog follow-ups opened for any component group below agreed thresholds.
- [ ] QA + frontend signoff recorded in `#clarivum-dev`.

## Notes
- Coordinate with QA-005 (metrics pipeline) so reporting stays consistent.
- Consider adding a `--changed` coverage command once Vitest 2.2 ships incremental coverage.
