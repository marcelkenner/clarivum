---
id: sprint-05
title: Sprint 05 Plan
status: planned
start: 2026-01-20
end: 2026-01-31
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/runbooks/ops-hub.md
  - docs/runbooks/observability-operations.md
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
| [`tasks/backlog/platform/plat-038-ops-hub-foundation.md`](../../backlog/platform/plat-038-ops-hub-foundation.md) | Backlog → Ready → In-progress | `/ops` namespace, Auth0 RBAC, Supabase ops_audit schema |
| [`tasks/backlog/platform/plat-039-ops-hub-integrations.md`](../../backlog/platform/plat-039-ops-hub-integrations.md) | Backlog → Ready → In-progress | Wire Strapi, Supabase, Listmonk, Stripe/PayU, Grafana, Plausible |
| [`tasks/backlog/platform/plat-040-ops-hub-observability.md`](../../backlog/platform/plat-040-ops-hub-observability.md) | Backlog → Ready → In-progress | Telemetry, alerts, audit exports, access reviews |
| [`tasks/backlog/platform/plat-037-engineering-metrics-pipeline.md`](../../backlog/platform/plat-037-engineering-metrics-pipeline.md) | Backlog → Ready → In-progress | Automate metrics JSON snapshots feeding Ops Hub widgets |

### Stretch

- Add glossary surfacing (`tasks/backlog/shared/shared-005-glossary-platform.md`) inside Ops Hub if integrations stabilize early.
- Start drafting Ops Hub Forest Day retro template to capture first operator feedback.

## Definition of Success

- Auth0 roles enforce least privilege for `/ops`, with Supabase `ops_audit` schema + RLS live.
- Core integrations (content, comms, payments, incidents) surface read/write actions inside Ops Hub with caching + audit logging.
- Ops Hub telemetry populates Grafana dashboards, SLO alerts feed PagerDuty/Slack, and monthly access review automation runs.
- Engineering metrics pipeline generates flow/quality/sustainability snapshots consumed by Ops Hub widgets.
- Runbook + ADR-031 addenda updated with architecture diagrams, alert routing, and onboarding instructions.

## Dependencies & Prep

- Confirm Auth0 role mapping + MFA enforcement by 2026-01-15 (Security + Platform).
- Finalize vendor credential storage (AWS Secrets Manager) and rotation plan.
- Gather integration requirements from Ops leads (payments, lifecycle, editorial) during pre-sprint workshop.
- Align metrics formulas + owners with Engineering Manager and Analytics prior to automation work.

## Risks & Mitigations

- **Integration sprawl** → begin with Tier-0 systems (Strapi, Supabase, Listmonk, Stripe/PayU, Grafana) and backlog the rest.
- **RBAC gaps** → pair Security + Platform on middleware implementation; add contract tests for role coverage.
- **Metrics accuracy** → double-enter first two weeks manually to validate automation before wiring dashboards.

## Key Dates

- **Sprint Planning:** 2026-01-20  
- **Integration dry run:** 2026-01-24 (walkthrough with Ops leads)  
- **Operator training + Retro:** 2026-01-31

---

Sprint 05 consumes the Terraform/CI guardrails from Sprint 04 to deploy Ops Hub safely. The resulting Ops telemetry + metrics snapshots become the baselines for revenue and lifecycle work in Sprints 06–07.
