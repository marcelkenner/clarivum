---
id: TSK-PLAT-026
title: Validate Subscription Trial Reminder Flow
status: backlog
area: platform
subarea: subscriptions
owner: QA Lead
collaborators:
  - Revenue Engineering Lead
  - Lifecycle Marketing Lead
effort: small
created_at: 2025-10-26
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
  - docs/adr/ADR-012-notification-experience-and-toasts.md
  - docs/runbooks/mailing-operations.md
  - docs/runbooks/notifications.md
context7:
  - /stripe/stripe
  - /novuhq/novu
  - /playwright/test
tags:
  - subscriptions
  - lifecycle
  - qa
---

## Summary
Configure automated and manual tests that ensure 14-day trials trigger reminder emails at T-3 and T-1 via Novu when Stripe webhooks fire, and document expected behavior in support runbooks.

## Definition of Ready
- [x] Stripe trial config confirmed: 14-day trial on `Subscriber` product in test mode.
- [x] Novu workflows selected: templates `trial_T-3` and `trial_T-1` with IDs recorded in ticket.
- [x] Seed data prepared: script seeds three cohorts covering opt-in/out and converted paths for QA matrix.

## Definition of Done
- [ ] Automated QA scenario (Playwright or integration test) simulates Stripe trial webhooks and validates reminder delivery.
- [ ] Monitoring/alerting added for missing reminders (e.g., Novu workflow failures).
- [ ] Support and lifecycle teams briefed; documentation updated with escalation steps.
- [ ] Checklist item in subscription PRD marked as satisfied with test evidence linked.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
