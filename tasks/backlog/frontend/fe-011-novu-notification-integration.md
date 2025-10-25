---
id: TSK-FE-011
title: Integrate NotificationManager with Novu Workflows
status: backlog
area: frontend
subarea: platform
owner: Frontend Engineer
collaborators:
  - UI Platform Manager
  - Platform Engineer
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-26
links:
  - docs/adr/ADR-012-notification-experience-and-toasts.md
  - docs/runbooks/notifications.md
  - docs/PRDs/requierments/login/feature-requirements.md
  - docs/PRDs/requierments/subscriptions/feature-requirements.md
context7:
  - /emilkowalski/sonner
  - /novuhq/docs
tags:
  - notifications
  - frontend-platform
---

## Summary
Extend the React notification layer so `NotificationManager` dispatches Sonner toasts and Novu workflows with typed payloads, feature-flagged rollout, and comprehensive telemetry. Provide reusable ViewModel helpers for login, legal, and subscription flows.

## Definition of Ready
- [ ] Novu environments and API keys available in dev.
- [ ] Event schema (payload shape, subscriber identifiers) agreed with platform team.
- [ ] Sample workflows created for login verification and subscription renewal notices.
- [ ] Telemetry contract defined (toast + Novu delivery events).

## Definition of Done
- [ ] `NotificationManager` routes events to `ToastNotificationCoordinator` and `NovuNotificationPublisher` with test coverage.
- [ ] Feature flags guard channel enablement; fallback to toast-only state validated.
- [ ] Telemetry events (`notification.triggered`, `notification.delivered`) captured and visualized in dashboards.
- [ ] Storybook stories demonstrate usage patterns; documentation updated in `docs/design-system/notifications.md`.
- [ ] Follow-up tickets filed for additional channel logic (SMS, in-app inbox UI) or localization needs.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

