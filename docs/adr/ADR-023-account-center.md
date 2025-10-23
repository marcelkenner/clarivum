# ADR-023: Customer Profile & Account Center
Date: 2025-10-24
Status: Accepted

## Context
- The Profile PRD (`docs/PRDs/requierments/profile/feature-requirements.md`) defines a centralized account center covering personal data, subscriptions, diagnostics history, and preferences.
- We must comply with GDPR (data portability, deletion), integrate with Supabase auth (ADR-001 & ADR-002), and surface personalization outputs (diagnostics, recommendations).
- Prior architectures risked scattering user data across services, complicating compliance and UX.

## Decision
- Implement a **Profile Service Layer** backed by Supabase Postgres.
  - Use Supabase Row Level Security for tenant isolation (ADR-001).
  - Synchronize Auth0 user metadata with Supabase profiles; maintain hashed identifiers for analytics (ADR-029).
- Frontend architecture:
  - Build profile flows on the frontend platform (ADR-019) with view models that fetch via server actions.
  - Organize sections (Overview, Orders/Subs, Diagnostics, Preferences) into dedicated managers to keep files <200 lines.
  - Use Phosphor icons per ADR-017 and brand tokens (ADR-018).
- Integrations:
  - Subscription data from Stripe/PayU (ADR-011).
  - Diagnostics outcomes (ADR-021) and recommendations (ADR-025).
  - Notification preferences from mailing platform (ADR-013) and cookie consent (ADR-014).
- Compliance:
  - Provide self-service data export and deletion flows with audit logging.
  - Log preference changes through OpenTelemetry (ADR-004) and analytics events.
- Security:
  - Require MFA and confirm re-authentication for sensitive changes.
  - Encrypt PII at rest where supported; mask in UIs unless necessary.

## Diagrams
- [Architecture Overview](../diagrams/adr-023-account-center/architecture-overview.mmd) — Auth0 synchronization, Supabase profile service, integrations, and frontend consumption.
- [Data Lineage](../diagrams/adr-023-account-center/data-lineage.mmd) — Profile, subscription, diagnostics, and preference entities.
- [UML Components](../diagrams/adr-023-account-center/uml-components.mmd) — ViewModel, profile manager, compliance service, and adapters.
- [BPMN Compliance Flow](../diagrams/adr-023-account-center/bpmn-compliance.mmd) — Data export and deletion workflow with audit notifications.

## Consequences
- **Benefits:** Single source of truth for customer data, streamlined compliance, consistent UX.
- **Trade-offs:** Additional coordination with multiple services; must manage data freshness (webhooks/events).
- **Follow-ups:**
  - Define Supabase DB schema and migrations for profile entities.
  - Document data retention policy in `docs/policies/security-baseline.md`.
  - Build automated tests for access control and data export flows.
