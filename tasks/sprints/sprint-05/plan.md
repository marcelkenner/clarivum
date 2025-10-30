---
id: sprint-05
title: Sprint 05 Plan
status: planned
start: 2026-01-20
end: 2026-01-31
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/adr/ADR-023-account-center.md
  - docs/adr/ADR-004-observability-stack.md
  - docs/adr/ADR-008-product-analytics-platform.md
  - docs/runbooks/ops-hub.md
  - docs/runbooks/observability-operations.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/background-jobs.md
  - docs/runbooks/security-baseline.md
  - docs/runbooks/incident-response.md
  - metrics/README.md
---

# Sprint 05 Plan (Winter Weeks 3–4)

- **Window:** 2026-01-20 → 2026-01-31  
- **Sprint Goal:** Stand up the `/ops` surface, integrations, and telemetry so Operations Hub becomes the single cockpit for content, communications, and commerce status.  
- **Theme:** “Ops Hub foundation” — activate RBAC, audit trails, and cross-system views built on the Sprint 04 guardrails.  
- **Owners:** Platform Tech Lead, SRE Lead, Platform Integration Lead, Analytics Lead  
- **Slack check-ins:** `#clarivum-platform`, `#clarivum-ops`, `#clarivum-dev`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-037-engineering-metrics-pipeline.md`](../../backlog/platform/plat-037-engineering-metrics-pipeline.md) | Backlog → Ready → In-progress | Automate metrics JSON snapshots feeding Ops Hub widgets |
| [`tasks/backlog/platform/plat-038-ops-hub-foundation.md`](../../backlog/platform/plat-038-ops-hub-foundation.md) | Backlog → Ready → In-progress | `/ops` namespace, Auth0 RBAC, Aurora ops_audit schema |
| [`tasks/backlog/platform/plat-039-ops-hub-integrations.md`](../../backlog/platform/plat-039-ops-hub-integrations.md) | Backlog → Ready → In-progress | Wire Strapi, Aurora, Listmonk, Stripe/PayU, Grafana, Plausible |
| [`tasks/backlog/platform/plat-040-ops-hub-observability.md`](../../backlog/platform/plat-040-ops-hub-observability.md) | Backlog → Ready → In-progress | Telemetry, alerts, audit exports, access reviews |
| [`tasks/backlog/platform/plat-017-grafana-observability-stack.md`](../../backlog/platform/plat-017-grafana-observability-stack.md) | Backlog → Ready → In-progress | Stand up Grafana Cloud, OTEL schema, alert routing |
| [`tasks/backlog/platform/plat-048-uv-widget-upstash-cache.md`](../../backlog/platform/plat-048-uv-widget-upstash-cache.md) | Backlog → Ready → In-progress | Move UV widget caches/rate limits to shared Upstash |
| [`tasks/backlog/platform/plat-049-uv-widget-analytics-guardrails.md`](../../backlog/platform/plat-049-uv-widget-analytics-guardrails.md) | Backlog → Ready → In-progress | Instrument Plausible guardrails for UV widget + dashboards |

### Stretch

- [`tasks/backlog/shared/shared-005-glossary-platform.md`](../../backlog/shared/shared-005-glossary-platform.md) — embed glossary module in Ops Hub if integrations wrap early.
- [`tasks/backlog/frontend/fe-016-ops-hub-interface.md`](../../backlog/frontend/fe-016-ops-hub-interface.md) — polish `/ops` UI if backend integrations stabilize quickly.

## Definition of Success

- Engineering metrics automation exports flow/quality/sustainability JSON consumed by Ops Hub widgets.
- Ops Hub foundation delivered with Auth0 RBAC, Aurora `ops_audit` schema, and integration proxies for Tier-0 systems.
- Grafana Cloud observability stack online with OTEL collectors; Ops Hub dashboards + alerts wired to on-call.
- UV widget caching/analytics guardrails leverage shared Upstash + Plausible instrumentation from Sprint 04.
- Runbooks (observability, Ops Hub, analytics QA) updated; operators trained with recorded walkthrough.
- Security, incident-response, and background-job runbooks reviewed to capture new alerting and recovery flows.

## Dependencies & Prep

- Confirm Auth0 role mapping + MFA enforcement by 2026-01-15 (Security + Platform).
- Finalize vendor credential storage (AWS Secrets Manager) and rotation plan.
- Gather integration requirements from Ops leads (payments, lifecycle, editorial) during pre-sprint workshop.
- Align metrics formulas + owners with Engineering Manager and Analytics prior to automation work.
- Ensure Upstash namespaces + secrets from Sprint 04 ready for integration.

## Risks & Mitigations

- **Integration sprawl** → begin with Tier-0 systems (Strapi, Aurora, Listmonk, Stripe/PayU, Grafana) and backlog the rest.
- **RBAC gaps** → pair Security + Platform on middleware implementation; add contract tests for role coverage.
- **Metrics accuracy** → double-enter first two weeks manually to validate automation before wiring dashboards.

## Key Dates

- **Sprint Planning:** 2026-01-20  
- **Integration dry run:** 2026-01-24 (walkthrough with Ops leads)  
- **Operator training + Retro:** 2026-01-31

---

Sprint 05 consumes the Terraform/CI guardrails from Sprint 04 to deploy Ops Hub safely. The resulting Ops telemetry + metrics snapshots become the baselines for revenue and lifecycle work in Sprints 06–07.
