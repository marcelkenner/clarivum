# Notification Experience & Non-Blocking Toasts Diagrams
- **ADR:** `docs/adr/ADR-012-notification-experience-and-toasts.md`
- **Last updated:** 2025-10-23
- **Owners:** Frontend Platform

## Overview
These diagrams illustrate the Sonner-based toast architecture, including how ViewModels publish events, how coordinators enforce deduplication, and how telemetry captures notification effectiveness. They document the component topology, data persisted for dismissals, class responsibilities, and the lifecycle for showing and clearing notifications.

## Files
- `architecture-overview.mmd` — Application shell, ViewModel publishing, and Sonner rendering flow.
- `data-lineage.mmd` — Notification payloads, persisted dismissals, and telemetry events.
- `uml-collaborators.mmd` — Coordinator, manager, and adapter classes orchestrating toasts.
- `bpmn-notification.mmd` — Toast lifecycle from trigger through dismissal.
