---
id: sprint-07
title: Sprint 07 Plan
status: planned
start: 2026-02-17
end: 2026-02-28
updated_at: 2025-10-27
links:
  - docs/adr/ADR-012-notification-experience-and-toasts.md
  - docs/runbooks/notifications.md
  - docs/PRDs/requierments/newsletter/feature-requirements.md
  - docs/adr/ADR-013-mailing-platform-and-campaign-automation.md
  - docs/runbooks/mailing-operations.md
---

# Sprint 07 Plan (Winter Weeks 7–8)

- **Window:** 2026-02-17 → 2026-02-28  
- **Sprint Goal:** Operationalize notifications + lifecycle communications to reinforce the new revenue flows (renewals, guest claims, onboarding).  
- **Theme:** “Signals & nurture” — connect platform events to Novu/Listmonk channels with CI/CD and UX guardrails.  
- **Owners:** DevOps Lead, UI Platform Manager, Lifecycle Marketing Lead  
- **Slack check-ins:** `#clarivum-notifications`, `#clarivum-lifecycle`, `#clarivum-platform`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-023-novu-notification-platform.md`](../../backlog/platform/plat-023-novu-notification-platform.md) | Backlog → Ready → In-progress | Provision Novu on ECS (API + workers + data stores) |
| [`tasks/backlog/platform/plat-024-novu-cicd-and-governance.md`](../../backlog/platform/plat-024-novu-cicd-and-governance.md) | Backlog → Ready → In-progress | GitHub Actions, promotion gates, template linting |
| [`tasks/backlog/frontend/fe-011-novu-notification-integration.md`](../../backlog/frontend/fe-011-novu-notification-integration.md) | Backlog → Ready → In-progress | NotificationManager toasts + Novu workflows + telemetry |
| [`tasks/backlog/shared/shared-004-newsletter-lifecycle.md`](../../backlog/shared/shared-004-newsletter-lifecycle.md) | Backlog → Ready → In-progress | Newsletter capture, double opt-in, segmentation automations |

### Stretch

- Layer in `tasks/backlog/shared/shared-001-open-decisions-alignment.md` outcomes for notification governance if capacity remains.
- Draft experimentation backlog for notification copy/trigger tests once baseline is stable.

## Definition of Success

- Novu infrastructure live with autoscaling, backups, alerting, and documented recovery steps.
- Notification workflows versioned in GitHub, linted/tested via CI, and promoted with secrets pulled from AWS.
- Frontend NotificationManager routes events to Sonner + Novu with feature flags, telemetry, and Storybook coverage.
- Newsletter capture and lifecycle funnels deploy with consent-compliant forms, Listmonk segments, and analytics instrumentation.
- Notifications runbooks updated; lifecycle/lifecycle marketing receives training + dashboards for delivery health.

## Dependencies & Prep

- Terraform modules from Sprint 04 reused for Novu networking/secrets—confirm capacity before sprint start.
- Collect workflow requirements from Revenue + Support (renewal reminders, claim nudges) by 2026-02-12.
- Align consent/legal copy for newsletter/lifecycle flows with legal partner.
- Ensure Ops Hub (Sprint 05) exposes the metrics/alerts that trigger notifications.

## Risks & Mitigations

- **Infra complexity** → start with dev environment, run load/perf tests before enabling prod; document rollback scripts.
· **Template drift** → enforce codeowners + required reviews on workflow JSON; include change log in PR template.
- **Lifecycle segmentation bugs** → add dry-run mode + sample subscribers before emailing real cohorts.

## Key Dates

- **Sprint Planning:** 2026-02-17  
- **Novu live-fire test:** 2026-02-22 (send internal-only workflows)  
- **Lifecycle soft launch + Retro:** 2026-02-28

---

Sprint 07 attaches user-facing communications to the monetization + fulfillment signals shipped in Sprint 06, paving the way for telemetry-heavy monetization analytics in Sprint 08.
