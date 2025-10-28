---
id: TSK-PLAT-040
title: Instrument Operations Hub Observability & Compliance
status: backlog
area: platform
subarea: observability
owner: SRE Lead
collaborators:
  - Analytics Lead
  - Security Lead
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/runbooks/ops-hub.md
  - metrics/README.md
  - docs/policies/security-baseline.md
context7:
  - /grafana/grafana
  - /opentelemetry/opentelemetry-js
  - /cli/cli
tags:
  - observability
  - compliance
  - automation
---

## Summary
Implement tracing, metrics, logging, alerting, and compliance hooks for the Ops Hub, ensuring actions feed audit exports, SLO dashboards, and guardrail alerts, while automating monthly access reviews.

## Definition of Ready
- [x] SLO targets locked: availability 99.9% and p95 API ≤400 ms with documented alert policies and paging tree.
- [x] Telemetry schema finalized: spans/events plus PII handling shared with analytics.
- [x] Audit export plan set: daily export to S3 with 365-day retention and assigned access controls.
- [x] Tokens verified end-to-end: Grafana, Slack, email credentials tested and rotation noted in runbook.
- [x] Naming conventions aligned with analytics taxonomy for dashboards/reports consistency.

## Definition of Done
- [ ] Ops Hub instrumented with OTel spans + metrics (latency, error rate, action counts) shipped to Grafana Cloud.
- [ ] Supabase audit exports automated via GitHub Action or scheduled script with retention policies.
- [ ] Alerting configured for SLO breaches, audit anomalies, and vendor API rate limits; Slack notifications validated.
- [ ] Access review automation created (monthly GitHub Action posting to `#clarivum-ops` and logging to audit trail).
- [ ] Metrics JSON files updated (flow, quality, sustainability) to include Ops Hub KPIs; documentation refreshed.
- [ ] Runbook expanded with observability dashboards, alert response expectations, and audit export instructions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
