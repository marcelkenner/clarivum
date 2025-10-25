---
id: TSK-PLAT-003
title: Implement OpenTelemetry Baseline
status: in-progress
area: platform
subarea: observability
owner: Observability Champion
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-25
links:
  - docs/adr/ADR-004-observability-stack.md
  - docs/PRDs/requierments/observability/feature-requirements.md
  - docs/architecture.md
  - docs/role-guides/backend.md
  - docs/role-guides/devops.md
context7:
  - /opentelemetry/docs/js
  - /grafana/docs
  - /vercel/next.js
  - /aws/lambda
tags:
  - observability
  - telemetry
  - otel
---

## Summary
Initialize OpenTelemetry instrumentation for the Next.js app and Lambda workers, wire exporters to Grafana Cloud, and publish dashboards/alerts matching error-budget policy.

## Definition of Ready
- [x] Critical user journeys cataloged with business analyst/product.
- [x] Exporter destination (Grafana Cloud) and API keys confirmed.
- [x] Sampling strategy aligned with reliability targets (error-budget policy).

## Definition of Done
- [x] OTel SDK initialized in Next.js (server/client where required) with resource attributes.
- [x] Lambda worker template instrumented with spans, metrics, and logs.
- [x] Grafana dashboards visualize latency, error rate, saturation, and business events.
- [x] Alert rules wired to PagerDuty/Slack per `error-budget-policy.md` thresholds.
- [x] Documentation updated and knowledge-share session scheduled.

## Notes
- Baseline landed in `instrumentation*.ts` + `/api/observability/v1/traces` proxy; Grafana configs documented under `docs/observability/`.
- Coordinate with frontend/backend teams to add manual spans for critical flows. Consider adding synthetic monitoring follow-up task once baseline is live.
