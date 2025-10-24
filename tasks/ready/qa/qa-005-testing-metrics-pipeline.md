---
id: TSK-QA-005
title: Wire Testing Coverage & Flake Metrics
status: ready
area: qa
subarea: quality-metrics
owner: QA Lead
collaborators: [Platform Eng]
effort: small
created_at: 2025-10-25
updated_at: 2025-10-25
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
- [ ] Coverage and flake baselines agreed with product and platform leads.
- [ ] GitHub token scope validated for writing metrics artifacts.
- [ ] Metrics directory owners aligned on JSON schema updates.

## Definition of Done
- [ ] Vitest reports push statement/branch coverage into `metrics/coverage.json`.
- [ ] Playwright smoke jobs record runtime and flake counts in `metrics/quality.json`.
- [ ] CI workflow publishes metrics artifacts and retains them for 30 days.
- [ ] QA and platform sign off in `#clarivum-dev`; dashboards updated to read new fields.
- [ ] `docs/QA/testing-strategy.md` and `docs/runbooks/testing-stack.md` updated with data freshness expectations.

## Notes
If additional storage is required, coordinate with the metrics pipeline owners before shipping.
