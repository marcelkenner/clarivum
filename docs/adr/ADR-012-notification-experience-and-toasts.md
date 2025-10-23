# ADR-012: Notification Experience & Non-Blocking Toasts
Date: 2025-10-21
Status: Accepted

## Context
- Product requirements emphasize lightweight, non-intrusive feedback (multiple PRDs call for “toast” confirmations) and explicitly avoid modal popups that interrupt key funnels.
- The web experience spans server components, client interactivity, and edge middleware; feedback must behave consistently across these surfaces and degrade gracefully when JavaScript is unavailable.
- Accessibility guardrails demand announcements through ARIA live regions with configurable focus handling, while maintaining sub-10 ms interaction overhead.
- We require a reusable abstraction so future ViewModels can trigger notifications without duplicating styling or business rules.
- Usage patterns are specified in `docs/PRDs/requierments/frontend-platform/homepage.md` and interface sketches in `docs/PRDs/requierments/ascii_designs.md`.

## Decision
- Standardize on **toast-based notifications only** for transient feedback; block modal popups for confirmations, error states, and marketing prompts.
- Adopt the **Sonner** toast component (`/emilkowalski/sonner` usage via Context7) as the UI primitive:
  - Render a single `<Toaster />` provider at the application shell and expose typed helpers (`toast.success`, `toast.error`, `toast.promise`) to maintain consistent copy and animation.
  - Leverage Sonner’s accessibility defaults (ARIA live region, focus retention) while customizing duration, position, and dark/light mode per brand guidelines.
- Implement an OOP-oriented notification layer:
  - `ToastNotificationCoordinator` (Coordinator) orchestrates display rules based on event severity and deduplication.
  - `NotificationManager` (Manager) receives domain events from ViewModels and maps them to toast payloads (title, description, CTA).
  - ViewModels consume the `NotificationManager` via dependency injection, enabling isolated testing.
- Persist dismissible state for critical alerts in local storage keyed by digest to avoid repeat toasts within a session.
- Disallow modal/pop-up introductions in lint rules and design reviews; any persistent messaging must use inline banners rendered by ViewModels instead.

## Diagrams
- [Architecture Overview](../diagrams/adr-012-notification-experience-and-toasts/architecture-overview.mmd) — ViewModel publishing, coordinators, and Sonner rendering path.
- [Data Lineage](../diagrams/adr-012-notification-experience-and-toasts/data-lineage.mmd) — Notification events, persisted dismissals, and telemetry records.
- [UML Collaborators](../diagrams/adr-012-notification-experience-and-toasts/uml-collaborators.mmd) — Manager, coordinator, adapter, and storage roles.
- [BPMN Notification Lifecycle](../diagrams/adr-012-notification-experience-and-toasts/bpmn-notification.mmd) — Trigger, deduplication, dismissal, and metric emission flow.

## Consequences
- **Benefits:** Preserves uninterrupted user flow, aligns with PRD expectations, and offers a consistent accessible feedback mechanism with minimal engineering overhead.
- **Trade-offs:** Toasts are easy to ignore; mitigate by escalating critical failures to inline banners or dedicated pages as needed.
- **Operational notes:** Telemetry should record notification triggers (type, conversion) to evaluate effectiveness; integrate with OpenTelemetry custom events.
- **Follow-ups:**
  - Add usage guidelines to `docs/design-system/notifications.md`, including copywriting standards.
  - Extend ESLint rules to forbid new modal-based notification components.
  - Create visual regression tests ensuring toast theming aligns with dark/light palettes.
