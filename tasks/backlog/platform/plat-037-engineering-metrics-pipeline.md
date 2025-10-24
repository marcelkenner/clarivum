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
- [ ] Align required metrics, calculations, and data sources with engineering leadership (GitHub, Plausible, PagerDuty).
- [ ] Determine retention, storage format, and access controls for generated JSON snapshots.
- [ ] Confirm GitHub token scopes, Plausible API keys, and other credentials are approved per security policy.
- [ ] Decide hosting approach (GitHub Actions scheduled job vs Supabase function) and error alerting channel.
- [ ] Document verification steps and owners for interpreting anomalies.

## Definition of Done
- [ ] Automation built (GitHub Action or scheduled job) generating all required JSON files and committing or uploading them per governance rules.
- [ ] Metrics validated against manual calculations for at least two historical periods; results recorded in runbook.
- [ ] `metrics/README.md` updated with calculation logic, sources, and troubleshooting procedures.
- [ ] Downstream dashboards or docs wired to consume the new metrics, with stakeholders briefed.
- [ ] Follow-up tasks filed for advanced visualizations or additional KPIs requested during rollout.
