---
id: TSK-PLAT-037
title: Automate Engineering Flow & Quality Metrics Snapshots
status: backlog
area: platform
subarea: observability
owner: Analytics Lead
collaborators:
  - DevOps Lead
  - Engineering Manager
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/AGENTS.md
  - metrics/README.md
context7:
  - /cli/cli
  - /pandas-dev/pandas
  - /vercel/next.js
tags:
  - metrics
  - automation
  - analytics
---

## Summary
Create scheduled scripts and storage that populate `metrics/flow.json`, `metrics/quality.json`, `metrics/sustainability.json`, and `metrics/coverage.json`, giving leadership a trustworthy picture of throughput, guardrails, and deep-work protection.

## Definition of Ready
- [ ] Metric definitions and data sources locked (lead time, deployment frequency, MTTR, change-failure rate from GitHub, CI, incident logs).
- [ ] Retention and access controls documented (12-month history, role-based dashboard access).
- [ ] Credentials approach agreed (GitHub OIDC + app installs, no personal access tokens).
- [ ] Hosting and alerting design chosen (lightweight daily job or service) with failure alerts routed to Platform.
- [ ] Anomaly verification playbook drafted so spikes are confirmed before paging stakeholders.

## Definition of Done
- [ ] Automation built (GitHub Action or scheduled job) generating all required JSON files and committing or uploading them per governance rules.
- [ ] Metrics validated against manual calculations for at least two historical periods; results recorded in runbook.
- [ ] `metrics/README.md` updated with calculation logic, sources, and troubleshooting procedures.
- [ ] Downstream dashboards or docs wired to consume the new metrics, with stakeholders briefed.
- [ ] Follow-up tasks filed for advanced visualizations or additional KPIs requested during rollout.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
