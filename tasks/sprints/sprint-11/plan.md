---
id: sprint-11
title: Sprint 11 Plan
status: planned
start: 2026-04-14
end: 2026-04-25
updated_at: 2025-10-28
links:
  - docs/adr/ADR-023-account-center.md
  - docs/adr/ADR-021-diagnostics-platform.md
  - docs/runbooks/ops-hub.md
  - docs/runbooks/account-claiming.md
  - docs/runbooks/analytics-qa.md
  - docs/PRDs/requierments/profile/feature-requirements.md
  - docs/PRDs/requierments/diagnostics/feature-requirements.md
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
---

# Sprint 11 Plan (Spring Weeks 3–4)

- **Window:** 2026-04-14 → 2026-04-25  
- **Sprint Goal:** Ship the Account Center service, diagnostics experience, and Ops Hub UI polish so support and customers can self-serve entitlement and operational insights.  
- **Theme:** “Self-serve confidence” — close the loop between backend orchestration and front-of-house tooling.  
- **Owners:** Platform Tech Lead, Frontend Account Center pod, Ops Hub Design Lead  
- **Slack check-ins:** `#clarivum-platform`, `#clarivum-frontend`, `#clarivum-ops`, `#clarivum-support`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-007-account-center.md`](../../backlog/platform/plat-007-account-center.md) | Backlog → Ready → In-progress | Build Account Center service + Aurora schemas + APIs |
| [`tasks/backlog/frontend/fe-006-tools-platform-rollout.md`](../../backlog/frontend/fe-006-tools-platform-rollout.md) | Backlog → Ready → In-progress | Deliver shared tools framework + integration hooks |
| [`tasks/backlog/frontend/fe-007-diagnostics-experience.md`](../../backlog/frontend/fe-007-diagnostics-experience.md) | Backlog → Ready → In-progress | Ship diagnostics hub UI with analytics + Ops linkage |
| [`tasks/backlog/frontend/fe-016-ops-hub-interface.md`](../../backlog/frontend/fe-016-ops-hub-interface.md) | Backlog → Ready → In-progress | Polish `/ops` UI, RBAC affordances, and action dashboards |
| [`tasks/backlog/shared/shared-001-open-decisions-alignment.md`](../../backlog/shared/shared-001-open-decisions-alignment.md) | Backlog → Ready → In-progress | Close open decisions/ADRs from Ops + Account workstreams |

### Stretch

- [`tasks/backlog/frontend/fe-023-skin-vertical-ui.md`](../../backlog/frontend/fe-023-skin-vertical-ui.md) — begin if account/ops flows finish early.
- [`tasks/backlog/shared/shared-010-affiliate-operations-workflow.md`](../../backlog/shared/shared-010-affiliate-operations-workflow.md) — outline future ops workflow requirements.

## Definition of Success

- Account Center APIs, Aurora schemas, and entitlements views live with auditing + RBAC, integrated with Ops Hub logging.
- Tools platform foundation exposes reusable shells + data contracts for upcoming calculators.
- Diagnostics experience surfaces lifecycle/telemetry data with action hooks into Ops Hub.
- Ops Hub UI polished for account/diagnostics flows, accessible and instrumented.
- Outstanding ADR decisions documented; runbooks updated with new access patterns.
- Runbooks (ops hub, account claiming, analytics QA) refreshed with entitlement/diagnostics procedures and escalation paths.

## Dependencies & Prep

- Confirm account center schema + migration approvals with data governance before sprint start.
- Coordinate with Support Ops on required diagnostics actions + access levels.
- Ensure Strapi/Meilisearch outputs from Sprint 10 are available for tools/diagnostics integration.
- Align tooling/QA checklists with Fe/QA leads to keep coverage high.

## Risks & Mitigations

- **Schema churn** → hold rapid syncs with product/support; version APIs to avoid breaking partners.
- **Ops Hub coupling** → keep UI updates behind feature flags; add smoke tests covering RBAC states.
- **Docs drift** → dedicate time mid-sprint to update ADRs/runbooks; pair product + docs leads.

## Key Dates

- **Sprint Planning:** 2026-04-14  
- **Ops Hub design review:** 2026-04-19  
- **Demo & Retro:** 2026-04-25

---

Sprint 11 ensures customers and operators can see the same data the platform orchestrates, closing feedback loops before Summer feature work.
