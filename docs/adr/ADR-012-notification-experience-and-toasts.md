# ADR-012: Notification Experience & Non-Blocking Toasts
Date: 2025-10-21
Status: Accepted

## Context
- Product requirements emphasize lightweight, non-intrusive feedback (multiple PRDs call for “toast” confirmations) and explicitly avoid modal popups that interrupt key funnels.
- The web experience spans server components, client interactivity, and edge middleware; feedback must behave consistently across these surfaces and degrade gracefully when JavaScript is unavailable.
- Accessibility guardrails demand announcements through ARIA live regions with configurable focus handling, while maintaining sub-10 ms interaction overhead.
- We require a reusable abstraction so future ViewModels can trigger notifications without duplicating styling or business rules.
- Stakeholders also need an extensible path for in-app inbox, email, or SMS notifications without rewriting delivery logic per channel.
- Open-source self-hosting keeps operating costs aligned with budget constraints and allows EU deployment control.
- Usage patterns are specified in `docs/PRDs/requierments/frontend-platform/homepage.md` and interface sketches in `docs/PRDs/requierments/ascii_designs.md`.

## Decision
- Standardize on **toast-based notifications only** for transient feedback; block modal popups for confirmations, error states, and marketing prompts.
- Adopt the **Sonner** toast component (`/emilkowalski/sonner` usage via Context7) as the UI primitive:
  - Render a single `<Toaster />` provider at the application shell and expose typed helpers (`toast.success`, `toast.error`, `toast.promise`) to maintain consistent copy and animation.
  - Leverage Sonner’s accessibility defaults (ARIA live region, focus retention) while customizing duration, position, and dark/light mode per brand guidelines.
- Adopt the **Novu** open-source notification platform (`/novuhq/docs`) for multi-channel delivery and in-app inbox support, self-hosted on Clarivum AWS infrastructure:
  - Deploy Novu’s Dockerized stack on ECS Fargate; `NotificationManager` authenticates via the Novu Node SDK with `serverURL` pointing at the internal ALB (per Context7 self-host guidance).
  - Model notification workflows (email, in-app inbox, SMS) in Novu; store channel preferences and message templates centrally.
- Implement an OOP-oriented notification layer:
  - `ToastNotificationCoordinator` (Coordinator) orchestrates display rules based on event severity and deduplication.
  - `NovuNotificationPublisher` (Manager) prepares Novu payloads (trigger key, payload, subscriber) and handles async delivery results.
  - `NotificationManager` (Manager) receives domain events from ViewModels and maps them to toast payloads (title, description, CTA) while delegating cross-channel dispatch to the `NovuNotificationPublisher`.
  - ViewModels consume the `NotificationManager` via dependency injection, enabling isolated testing.
- Persist dismissible state for critical alerts in local storage keyed by digest to avoid repeat toasts within a session.
- Expose feature-flagged configuration for enabling Novu channels per cohort so rollout can be staged across environments.
- Disallow modal/pop-up introductions in lint rules and design reviews; any persistent messaging must use inline banners rendered by ViewModels instead.

## Diagrams
- [Architecture Overview](../diagrams/adr-012-notification-experience-and-toasts/architecture-overview.mmd) — ViewModel publishing, coordinators, Novu publisher, and Sonner rendering path.
- [Data Lineage](../diagrams/adr-012-notification-experience-and-toasts/data-lineage.mmd) — Notification events, persisted dismissals, Novu delivery receipts, and telemetry records.
- [UML Collaborators](../diagrams/adr-012-notification-experience-and-toasts/uml-collaborators.mmd) — Manager, coordinator, Novu publisher, adapter, and storage roles.
- [BPMN Notification Lifecycle](../diagrams/adr-012-notification-experience-and-toasts/bpmn-notification.mmd) — Trigger, deduplication, Novu dispatch, dismissal, and metric emission flow.

## Consequences
- **Benefits:** Preserves uninterrupted user flow, aligns with PRD expectations, and introduces a reusable Novu workflow so teams can add channels without rebuilding infrastructure.
- **Trade-offs:** Hosting Novu increases platform surface area (MongoDB/Redis dependencies, ECS workloads); mitigated through Terraform automation and observability hooks.
- **Operational notes:** Telemetry should record notification triggers (type, conversion) across Sonner and Novu (delivery status) to evaluate effectiveness; integrate with OpenTelemetry custom events.
- **Follow-ups:**
  - Add usage guidelines to `docs/design-system/notifications.md`, including copywriting standards.
  - Extend ESLint rules to forbid new modal-based notification components.
  - Create visual regression tests ensuring toast theming aligns with dark/light palettes.
  - Author runbooks for Novu operations (backups, channel credentials) in `docs/runbooks/notifications.md`.
