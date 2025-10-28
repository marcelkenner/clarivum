---
id: sprint-17
title: Sprint 17 Plan
status: planned
start: 2026-07-07
end: 2026-07-18
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/affiliate/feature-requirements.md
  - docs/PRDs/requierments/tools/fuel/feature-requirements.md
  - docs/runbooks/affiliate-ad-ops.md
  - docs/runbooks/ebooks-fulfillment.md
  - docs/runbooks/mailing-operations.md
  - docs/runbooks/analytics-qa.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-035-affiliate-catalog-and-offer-management.md
---

# Sprint 17 Plan (Summer Weeks 5–6)

- **Window:** 2026-07-07 → 2026-07-18  
- **Sprint Goal:** Operationalize partner launches—train ops, automate nurture campaigns, and ship north-star monetization dashboards so growth teams can iterate quickly.  
- **Theme:** “Partner launch readiness” — tie catalog, placements, and lifecycle together with actionable analytics.  
- **Owners:** Partner Ops Lead, Lifecycle Engineering Lead, Growth Analytics Lead, Monetization Product Manager  
- **Slack check-ins:** `#clarivum-growth`, `#clarivum-lifecycle`, `#clarivum-analytics`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-046-affiliate-catalog-service.md`](../../backlog/platform/plat-046-affiliate-catalog-service.md) | Backlog → Ready → In-progress | Phase 2: partner onboarding portal, asset previews, lifecycle webhooks |
| [`tasks/backlog/shared/shared-010-affiliate-operations-workflow.md`](../../backlog/shared/shared-010-affiliate-operations-workflow.md) | Backlog → Ready → In-progress | Partner training materials, freshness automation, payout SOP videos |
| [`tasks/backlog/platform/plat-029-listmonk-infrastructure.md`](../../backlog/platform/plat-029-listmonk-infrastructure.md) | Backlog → Ready → In-progress | Phase 2: monetization journeys, coupons + affiliate segmentation, reporting |
| [`tasks/backlog/frontend/fe-018-monetization-sdk-integration.md`](../../backlog/frontend/fe-018-monetization-sdk-integration.md) | Backlog → Ready → In-progress | Phase 3: experiment hooks, UTMs, A/B toggles for high-value placements |

### Stretch

- [`tasks/backlog/platform/plat-010-coupons-platform.md`](../../backlog/platform/plat-010-coupons-platform.md) — automate partner self-serve updates if core scope completes early.
- [`tasks/in-progress/qa/qa-004-monetization-telemetry-validation.md`](../../in-progress/qa/qa-004-monetization-telemetry-validation.md) — expand coverage to Forest Day monetization tasks.

## Definition of Success

- Affiliate catalog exposes secure onboarding UI, asset preview flow, lifecycle webhooks, and partner kill switch with audit trails.
- Ops workflow includes training deck, recorded session, automation scripts (freshness audit, payout reconciliation) stored in updated mailing + affiliate runbooks.
- Listmonk monetization journeys segmented by offer + lifecycle stage, with dashboards highlighting conversion + unsubscribe metrics.
- Monetization placements support experiments via Flagsmith, emit UTMs, log to telemetry platform, and surface experiment dashboards.

## Dependencies & Prep

- Schedule partner training + content review ahead of sprint (Marketing + Legal sign-off).
- Capture segmentation rules + nurture copy for new Listmonk automations.
- Align analytics instrumentation with Data team (naming, retention, attribution).
- Confirm Ops capacity for automation maintenance, add to Kaizen backlog where needed.

## Risks & Mitigations

- **Partner onboarding delays** → prepare sandbox + documentation, leverage async recordings, keep backlog of follow-up tasks.
- **Lifecycle spam risk** → enforce throttling, double opt-in, and easy opt-out; monitor unsubscribes daily during rollout.
- **Experiment fatigue** → coordinate with Product on concurrent tests, document guardrails in `docs/runbooks/affiliate-ad-ops.md`.

## Key Dates

- **Sprint Planning:** 2026-07-07  
- **Partner training workshop:** 2026-07-11 (recording stored in `/docs/runbooks/affiliate-ad-ops.md`)  
- **Demo & Retro:** 2026-07-18
