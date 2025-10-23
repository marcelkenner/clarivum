# Notification Experience & Non-Blocking Toasts Diagrams
- **ADR:** `docs/adr/ADR-012-notification-experience-and-toasts.md`
- **Last updated:** 2025-10-23
- **Owners:** Frontend Platform

## Overview
These diagrams illustrate the Sonner + Novu notification architecture, including how ViewModels publish events, how coordinators enforce deduplication, how multi-channel workflows dispatch through Novu, and how telemetry captures notification effectiveness. They document the component topology, data persisted for dismissals, class responsibilities, and the lifecycle for showing and clearing notifications.

## Files
- `architecture-overview.mmd` — Application shell, ViewModel publishing, Sonner rendering, and Novu workflow dispatch.
- `data-lineage.mmd` — Notification payloads, persisted dismissals, Novu delivery receipts, and telemetry events.
- `uml-collaborators.mmd` — Coordinator, manager, Novu publisher, and adapter classes orchestrating notifications.
- `bpmn-notification.mmd` — Toast + Novu lifecycle from trigger through dismissal and delivery acknowledgment.
