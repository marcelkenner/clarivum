---
id: sprint-15
title: Sprint 15 Plan
status: planned
start: 2026-06-09
end: 2026-06-20
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/affiliate/feature-requirements.md
  - docs/PRDs/requierments/coupons/feature-requirements.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-035-affiliate-catalog-and-offer-management.md
  - docs/adr/ADR-026-coupons-and-affiliate-incentives.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/runbooks/affiliate-ad-ops.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/security-baseline.md
---

# Sprint 15 Plan (Summer Weeks 1–2)

- **Window:** 2026-06-09 → 2026-06-20  
- **Sprint Goal:** Stand up the monetization backbone—catalog service, telemetry pipeline, frontend SDK, and operational workflow—so affiliate offers can be launched with full compliance and analytics.  
- **Theme:** “Monetization runway” — deliver secure, observable foundations for partner revenue before July campaigns.  
- **Owners:** Platform Monetization Lead, Partner Ops Lead, Frontend Growth Pod, Analytics/Telemetry Lead  
- **Slack check-ins:** `#clarivum-growth`, `#clarivum-platform`, `#clarivum-frontend`, `#clarivum-analytics`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-046-affiliate-catalog-service.md`](../../backlog/platform/plat-046-affiliate-catalog-service.md) | Backlog → Ready → In-progress | API + SDK for affiliate offers with Auth0/Flagsmith controls |
| [`tasks/backlog/platform/plat-043-monetization-telemetry-platform.md`](../../backlog/platform/plat-043-monetization-telemetry-platform.md) | Backlog → Ready → In-progress | Event ingestion, fraud detection, ledger exports, Grafana dashboards |
| [`tasks/backlog/frontend/fe-018-monetization-sdk-integration.md`](../../backlog/frontend/fe-018-monetization-sdk-integration.md) | Backlog → Ready → In-progress | Reusable placements (server + client) with consent-aware tracking |
| [`tasks/backlog/shared/shared-010-affiliate-operations-workflow.md`](../../backlog/shared/shared-010-affiliate-operations-workflow.md) | Backlog → Ready → In-progress | Playbooks, partner onboarding, freshness audits, payout checklist |

### Stretch

- [`tasks/backlog/platform/plat-010-coupons-platform.md`](../../backlog/platform/plat-010-coupons-platform.md) — begin ingestion + governance if catalog work lands early.
- [`tasks/in-progress/qa/qa-004-monetization-telemetry-validation.md`](../../in-progress/qa/qa-004-monetization-telemetry-validation.md) — draft automated checks once the event schema stabilizes.

## Definition of Success

- Affiliate catalog service deployed with management + public endpoints, audited roles, SDK published, and rollback scripts documented.
- Telemetry platform captures impressions/clicks, flags anomalies, surfaces partner revenue dashboards, and stores immutable ledgers.
- Frontend monetization SDK exposes consent-aware placements with responsive variants, instrumentation hooks, and Storybook docs.
- Operations workflow documented in `docs/runbooks/affiliate-ad-ops.md`, including offer approval, kill switch, and payout reconciliation.
- Analytics QA and security baseline runbooks updated with monetization-specific dashboards, alerting, and secret handling.

## Dependencies & Prep

- Confirm Flagsmith segment strategy, Auth0 scopes, and governance approvals before exposing management endpoints.
- Align event schema + IDs across telemetry and frontend teams (include Fraud/Analytics stakeholders).
- Gather legal/compliance copy for disclosures + consent gating; record approvals.
- Collect partner onboarding requirements and payout cadence to feed workflow design.

## Risks & Mitigations

- **Data quality gaps** → instrument synthetic events, add replay tooling, and gate production export behind data completeness checks.
- **SDK adoption friction** → pair Growth + Frontend on integration patterns; provide quick-start docs and linting presets.
- **Ops workload overload** → pilot workflow with two partner cohorts, iterate before full rollout.

## Key Dates

- **Sprint Planning:** 2026-06-09  
- **Telemetry schema review:** 2026-06-13 (w/ Analytics + Finance)  
- **Demo & Retro:** 2026-06-20 (include Partner Ops + Marketing)
