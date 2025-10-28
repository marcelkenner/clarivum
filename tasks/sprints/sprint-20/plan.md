---
id: sprint-20
title: Sprint 20 Plan
status: planned
start: 2026-08-18
end: 2026-08-29
updated_at: 2025-10-29
links:
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/adr/ADR-004-observability-stack.md
  - docs/runbooks/ops-hub.md
  - docs/runbooks/security-baseline.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/observability-operations.md
  - docs/runbooks/incident-response.md
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/PRDs/requierments/analytics/feature-requirements.md
---

# Sprint 20 Plan (Late Summer Weeks 3–4)

- **Window:** 2026-08-18 → 2026-08-29  
- **Sprint Goal:** Complete Ops Hub reliability work—lock monitoring pipelines, compliance workflows, and Listmonk/telemetry integrations as we enter Autumn stabilization.  
- **Theme:** “Ops Hub hardening” — ensure on-call can rely on a single pane of glass for observability, incidents, and partner comms.  
- **Owners:** Ops Hub Product Owner, Observability Lead, Security Champion, Analytics QA Lead  
- **Slack check-ins:** `#clarivum-ops-hub`, `#clarivum-platform`, `#clarivum-analytics`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-040-ops-hub-observability.md`](../../backlog/platform/plat-040-ops-hub-observability.md) | Backlog → Ready → In-progress | Phase 2: Ops Hub dashboards, alert routing, access controls, docs |
| [`tasks/backlog/platform/plat-029-listmonk-infrastructure.md`](../../backlog/platform/plat-029-listmonk-infrastructure.md) | Backlog → Ready → In-progress | Phase 3: backup/restore tests, retention policies, Ops Hub widgets |
| [`tasks/backlog/platform/plat-011-security-baseline.md`](../../backlog/platform/plat-011-security-baseline.md) | Backlog → Ready → In-progress | Phase 3: audit evidence collection, SOC2 controls, incident response updates |
| [`tasks/backlog/platform/plat-038-ops-hub-foundation.md`](../../backlog/platform/plat-038-ops-hub-foundation.md) | Backlog → Ready → In-progress | Phase 2: permissions model, runbook linking, metric definitions |

### Stretch

- [`tasks/backlog/platform/plat-039-ops-hub-integrations.md`](../../backlog/platform/plat-039-ops-hub-integrations.md) — integrate monetization telemetry stream if core work completes.
- [`tasks/backlog/platform/plat-043-monetization-telemetry-platform.md`](../../backlog/platform/plat-043-monetization-telemetry-platform.md) — pipe partner alerts into Ops Hub notifications.

## Definition of Success

- Ops Hub surfaces unified dashboards (fulfillment, monetization, incidents), routes alerts to the right rotations, and logs access reviews.
- Listmonk integrates with Ops Hub, nightly backup/restore tests recorded, retention policies codified, and incidents documented.
- Security baseline evidence packaged for Autumn review (MFA reports, IAM diffs, runbook updates, penetration test results).
- Ops Hub foundation tasks deliver RBAC matrix, metric dictionary, and updated runbook including `/library` cross-links.
- Runbooks (ops hub, observability operations, incident response, security baseline) refreshed with new evidence workflows and dashboard ownership.

## Dependencies & Prep

- Collect Ops Hub stakeholder requirements (support, finance, growth) before sprint start.
- Align security evidence templates with compliance team; schedule review session.
- Ensure observability dashboards from Sprint 18 feed into Ops Hub (Grafana links ready).
- Prepare migration plan for Ops Hub RBAC changes; notify impacted teams.

## Risks & Mitigations

- **Dashboard overload** → prioritize critical signals, archive stale widgets, document metrics in `/docs`.
- **Security evidence gaps** → create follow-up guardrail issues, assign owners, track in Kaizen.
- **Ops Hub adoption** → run enablement session, gather feedback via survey, incorporate improvements quickly.

## Key Dates

- **Sprint Planning:** 2026-08-18  
- **Ops Hub enablement session:** 2026-08-22 (recording stored in `/docs/runbooks/ops-hub.md`)  
- **Demo & Retro:** 2026-08-29
