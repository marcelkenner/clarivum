---
id: sprint-14
title: Sprint 14 Plan
status: planned
start: 2026-05-26
end: 2026-06-06
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/PRDs/requierments/form-engine/feature-requirements.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/account-claiming.md
  - docs/runbooks/background-jobs.md
  - docs/runbooks/notifications.md
  - docs/adr/ADR-024-ebooks-and-digital-products.md
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/adr/ADR-020-form-engine.md
---

# Sprint 14 Plan (Early Summer Weeks 3–4)

- **Window:** 2026-05-26 → 2026-06-06  
- **Sprint Goal:** Finish the digital-product launch runway by wiring proactive communications, fulfillment guardrails, and reusable form scaffolds so the ebooks experience is observable end-to-end.  
- **Theme:** “Entitlement polish” — lock the last-mile automation and UX required for a confident paid content launch.  
- **Owners:** Platform Digital Products Lead, Lifecycle Engineering Lead, Frontend Forms Lead, QA Automation Lead  
- **Slack check-ins:** `#clarivum-platform`, `#clarivum-content`, `#clarivum-frontend`, `#clarivum-qa`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-029-listmonk-infrastructure.md`](../../backlog/platform/plat-029-listmonk-infrastructure.md) | Backlog → Ready → In-progress | Harden Listmonk (ECS, VPC, observability) to power fulfilment + nurture journeys |
| [`tasks/backlog/platform/plat-042-fulfillment-orchestrator-guardrails.md`](../../backlog/platform/plat-042-fulfillment-orchestrator-guardrails.md) | Backlog → Ready → In-progress | Production cutover runbook, failure injection drills, SLA dashboards |
| [`tasks/backlog/qa/qa-003-ebooks-fulfillment-guardrails.md`](../../backlog/qa/qa-003-ebooks-fulfillment-guardrails.md) | Backlog → Ready → In-progress | Synthetic monitors + CI smoke (`npm run ebooks:fulfillment-smoke`) with alerting |
| [`tasks/backlog/frontend/fe-009-form-engine-foundation.md`](../../backlog/frontend/fe-009-form-engine-foundation.md) | Backlog → Ready → In-progress | Shared form primitives + validation for gated downloads & nurture triggers |

### Stretch

- [`tasks/backlog/frontend/fe-015-lighthouse-ci-automation.md`](../../backlog/frontend/fe-015-lighthouse-ci-automation.md) — wire performance guardrails if fulfillment work lands early.
- [`tasks/backlog/platform/plat-037-engineering-metrics-pipeline.md`](../../backlog/platform/plat-037-engineering-metrics-pipeline.md) — extend dashboards with ebook conversion cohorts once Listmonk metrics emit.

## Definition of Success

- Listmonk production stack deployed with blue/green rollout procedure, secrets rotation, dashboards, and access reviews recorded in `docs/runbooks/ebooks-fulfillment.md`.
- Fulfillment orchestrator handles failure drills (timeouts, retries, duplicate webhooks) with alerting to `#clarivum-oncall`, SLA dashboard linked from Ops Hub, and reconciliation CLI updated.
- QA guardrails run hourly in staging + nightly in production with PagerDuty/Slack hooks and seeded fixtures; CI job blocks regressions.
- Form engine delivers accessible, localized patterns reused across lead capture, claim forms, and post-purchase flows; documentation added to component library and `docs/role-guides/continuous-improvement.md`.
- Runbooks (ebooks fulfillment, account claiming, notifications) and form engine documentation updated with new rollout + escalation guidance.

## Dependencies & Prep

- Confirm Listmonk infrastructure budget + IAM roles with DevOps before provisioning.
- Align comms copy, unsubscribe handling, and transactional template ownership with Lifecycle/Legal.
- Seed real-ish fixtures (ebooks, orders, emails) in staging for QA automation prior to sprint start.
- Collect form requirements from marketing + support and capture acceptance tests before development begins.

## Risks & Mitigations

- **Email deliverability friction** → warm up Listmonk IPs early, coordinate with SES team, log metrics for SPF/DKIM status.
- **Monitor flakiness** → use deterministic fixtures, snapshot emails, and retriable flows; add guardrail steps in CI to detect flakes.
- **Form UX regression** → pair Frontend + Accessibility leads on audits; add Storybook accessibility checks as part of `npm run validate`.

## Key Dates

- **Sprint Planning:** 2026-05-26  
- **Fulfillment chaos drill:** 2026-06-03 (recorded walkthrough shared in `#clarivum-platform`)  
- **Demo & Retro:** 2026-06-06
