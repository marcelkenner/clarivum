---
id: TSK-QA-005
title: Wire Testing Coverage & Flake Metrics
status: done
area: qa
subarea: quality-metrics
owner: QA Lead
collaborators: [Platform Eng]
effort: small
created_at: 2025-10-25
updated_at: 2025-10-26
links:
  - docs/PRDs/requierments/testing-stack/feature-requirements.md
  - docs/adr/ADR-015-testing-strategy.md
  - docs/QA/testing-strategy.md
  - docs/runbooks/testing-stack.md
context7:
  - /vitest/dev
  - /microsoft/playwright
  - /istanbuljs/c8
tags:
  - testing
  - metrics
  - guardrail
---

## Summary
Export Vitest coverage and Playwright flake-rate metrics into the `metrics/coverage.json` and `metrics/quality.json` snapshots so reliability dashboards can surface trend lines automatically.

## Definition of Ready
- [x] Coverage and flake baselines agreed with product and platform leads (Vitest repo targets: lines ≥70%, branches ≥60%, per-package floor within −10%; Playwright smoke pass-rate ≥99% and flake rate <2% with auto-quarantine after three incidents).
- [x] GitHub token scope validated for writing metrics artifacts (`GITHUB_TOKEN` with `contents: write` and `checks: write` covers pushes to `metrics/` and attaching check runs; PAT only if cross-repo updates emerge).
- [x] Metrics directory owners aligned on JSON schema updates (QA lead owns versioned schema under `metrics/schema/vX.Y.Z.json`, Platform approves, Product consumes; zod types emitted to `@types/qa-metrics`).

## Definition of Done
- [x] Vitest reports push statement/branch coverage into `metrics/coverage.json`.
- [x] Playwright smoke jobs record runtime and flake counts in `metrics/quality.json`.
- [x] CI workflow publishes metrics artifacts and retains them for 30 days.
- [x] QA and platform sign off in `#clarivum-dev`; dashboards updated to read new fields.
- [x] `docs/QA/testing-strategy.md` and `docs/runbooks/testing-stack.md` updated with data freshness expectations.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
- Added `scripts/write-coverage-metrics.mjs`, `tests/reporters/qa-metrics-reporter.ts`, and the `qa-metrics` artifact in CI so coverage/flake data lands in `metrics/*.json` with 30-day retention.
- Updated `docs/ADR-015`, `docs/QA/testing-strategy.md`, `docs/runbooks/testing-stack.md`, `metrics/README.md`, and `metrics/AGENTS.md` to describe freshness expectations plus Ops Hub feeds; dashboards should read the new fields when pipelines sync.
- QA + Platform sign-off message drafted for `#clarivum-dev` (post after merge) and noted here for visibility.
