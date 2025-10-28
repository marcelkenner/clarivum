---
id: sprint-18
title: Sprint 18 Plan
status: planned
start: 2026-07-21
end: 2026-08-01
updated_at: 2025-10-29
links:
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-026-coupons-and-affiliate-incentives.md
  - docs/runbooks/affiliate-ad-ops.md
  - docs/runbooks/analytics-qa.md
  - docs/runbooks/security-baseline.md
  - docs/PRDs/requierments/affiliate/feature-requirements.md
  - docs/PRDs/requierments/security/feature-requirements.md
---

# Sprint 18 Plan (Summer Weeks 7–8)

- **Window:** 2026-07-21 → 2026-08-01  
- **Sprint Goal:** Hardening sprint for monetization—close revenue reconciliation loops, enforce security/performance guardrails, and prep for Autumn reliability focus.  
- **Theme:** “Guardrails before scale” — ensure every monetization signal is trustworthy and compliant.  
- **Owners:** Monetization Platform Lead, Security Lead, Frontend Performance Lead, QA Telemetry Lead  
- **Slack check-ins:** `#clarivum-growth`, `#clarivum-security`, `#clarivum-frontend`, `#clarivum-qa`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-043-monetization-telemetry-platform.md`](../../backlog/platform/plat-043-monetization-telemetry-platform.md) | Backlog → Ready → In-progress | Phase 3: partner statement ingestion, payouts reconciliation, alert fatigue tuning |
| [`tasks/in-progress/qa/qa-004-monetization-telemetry-validation.md`](../../in-progress/qa/qa-004-monetization-telemetry-validation.md) | In-progress → Ready → In-progress | Phase 2: nightly production monitors, Grafana thresholds, regression heatmaps |
| [`tasks/backlog/platform/plat-011-security-baseline.md`](../../backlog/platform/plat-011-security-baseline.md) | Backlog → Ready → In-progress | Security review (MFA, secrets rotation, IAM least privilege, penetration test follow-ups) |
| [`tasks/backlog/frontend/fe-015-lighthouse-ci-automation.md`](../../backlog/frontend/fe-015-lighthouse-ci-automation.md) | Backlog → Ready → In-progress | CI Lighthouse budget + monetization placement coverage, alerts on regressions |

### Stretch

- [`tasks/backlog/platform/plat-010-coupons-platform.md`](../../backlog/platform/plat-010-coupons-platform.md) — automate partner-facing anomaly reports once reconciliation lands.
- [`tasks/backlog/platform/plat-029-listmonk-infrastructure.md`](../../backlog/platform/plat-029-listmonk-infrastructure.md) — wrap monitoring + backups to satisfy security baseline findings.

## Definition of Success

- Monetization telemetry reconciles with partner statements; anomalies auto-create tickets/Sisu notes; fraud signals page the on-call rotation.
- QA dashboards track monetization KPIs, nightly monitors run in production with red/amber thresholds, and CI tests gate regressions.
- Security baseline scans pass (MFA coverage, secret rotation, IAM reviews), action items logged with owners/due dates, drifts captured in runbook.
- Lighthouse CI budgets enforced for monetization-heavy pages; failures block merges and are surfaced in Kaizen minute.
- Runbooks (affiliate ad ops, analytics QA, security baseline) refreshed with reconciliation procedures, alert routing, and secret rotation cadence.

## Dependencies & Prep

- Gather partner statement samples + reconciliation rules before sprint start.
- Schedule security review session with DevOps, record in `docs/runbooks/security-baseline.md`.
- Ensure QA has Grafana + telemetry access; configure Slack webhooks for alerts.
- Align Lighthouse budgets with Design/SEO to avoid conflicting thresholds.

## Risks & Mitigations

- **Telemetry noise** → implement suppression + grouping, add debug dashboards, iterate on thresholds mid-sprint.
- **Security findings backlog** → triage daily, create guardrail tickets, escalate blockers via Sisu process.
- **Performance budget drift** → pair Frontend + Platform on caching strategies; use feature flags to disable problematic placements.

## Key Dates

- **Sprint Planning:** 2026-07-21  
- **Security review workshop:** 2026-07-25 (output appended to `docs/runbooks/security-baseline.md`)  
- **Demo & Retro:** 2026-08-01
