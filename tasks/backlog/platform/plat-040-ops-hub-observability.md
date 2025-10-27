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
updated_at: 2025-10-24
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
- [ ] SLO targets confirmed (availability 99.9%, p95 API latency ≤400 ms) with alert policies and paging tree documented.
- [ ] Telemetry schema finalized (span/event names, attributes, PII handling rules) and shared with analytics.
- [ ] Audit export pipeline defined (daily export destination, 365-day retention, access controls) with owners assigned.
- [ ] Grafana, Slack, and email tokens verified end-to-end and rotation plan captured in runbook.
- [ ] Naming conventions aligned with analytics taxonomy to ensure dashboards and reports stay consistent.

## Definition of Done
- [ ] Ops Hub instrumented with OTel spans + metrics (latency, error rate, action counts) shipped to Grafana Cloud.
- [ ] Supabase audit exports automated via GitHub Action or scheduled script with retention policies.
- [ ] Alerting configured for SLO breaches, audit anomalies, and vendor API rate limits; Slack notifications validated.
- [ ] Access review automation created (monthly GitHub Action posting to `#clarivum-ops` and logging to audit trail).
- [ ] Metrics JSON files updated (flow, quality, sustainability) to include Ops Hub KPIs; documentation refreshed.
- [ ] Runbook expanded with observability dashboards, alert response expectations, and audit export instructions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
