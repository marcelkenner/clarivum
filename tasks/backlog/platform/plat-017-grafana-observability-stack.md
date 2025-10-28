---
id: TSK-PLAT-017
title: Establish Grafana Observability Stack
status: backlog
area: platform
subarea: observability
owner: SRE Lead
collaborators:
  - Platform Engineer
  - QA Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/observability/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-004-observability-stack.md
  - docs/runbooks/observability-operations.md
  - docs/runbooks/analytics-qa.md
context7:
  - /grafana/docs
  - /opentelemetry/docs
tags:
  - observability
  - sre
  - infrastructure
---

## Summary
Deploy the Grafana Tempo, Loki, and Prometheus stack (managed or self-hosted), configure OpenTelemetry collectors, and deliver baseline dashboards and alerts that uphold Clarivum’s error budget policy.

## Definition of Ready
- [x] Hosting and budget approved: proceed with Grafana Cloud Pro subscription under Ops ownership and documented cost cap.
- [x] Telemetry schema locked: span naming `svc.op` with attributes (`env`, `route`, `user_anonymous`), retention 30 d logs, 90 d metrics, 365 d traces.
- [x] Integrations inventoried: Next.js OTEL auto-instrumentation, Lambda workers, Strapi middleware, ECS FireLens shipping logs identified.
- [x] Alert routing defined: severity P1 to PagerDuty, P2 to Slack/email with documented escalation tree.

## Definition of Done
- [ ] Grafana stack provisioned with environments separated for dev and prod plus access controls enforced.
- [ ] OpenTelemetry collectors configured and receiving traces, logs, and metrics from key services.
- [ ] Core dashboards (Web Vitals, API latency, subscription funnel) published and shared.
- [ ] Alert policies created and tested with simulated incidents; `docs/runbooks/observability-operations.md` updated and shared with on-call engineers.
- [ ] Follow-up items filed for synthetic monitoring and cost optimization.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
