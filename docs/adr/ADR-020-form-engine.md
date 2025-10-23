# ADR-020: Form Engine & Validation Stack
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum funnels rely heavily on data capture: diagnostics, subscriptions, ecommerce intents, and regulatory consent flows.
- We need consistent form behavior across server components, client interactions, and feature-flagged experiments while respecting accessibility and localization.
- The requirements in `docs/PRDs/requierments/form-engine/feature-requirements.md` mandate schema validation, async enrichment, error handling, and telemetry hooks.
- Alternative stacks considered: Formik, React Final Form, custom hooks. Previous projects highlighted performance and DX issues with those options.

## Decision
- Standardize on **React Hook Form (RHF)** for UI form state management.
  - Use controller components with `render` props for complex inputs.
  - Co-locate field adapters under `src/view-models/forms/<domain>/`.
  - Default to uncontrolled inputs for performance; fall back to controlled only when necessary.
- Use **Zod** for schema validation and type inference.
  - Generate TypeScript types from shared Zod schemas to eliminate drift between frontend and server.
  - Compose schemas per domain (lead capture, diagnostics responses) and reuse in API handlers.
- Architecture patterns:
  - Wrap forms in `FormCoordinator` objects that orchestrate managers (network) and view models (UI state).
  - Inject dependencies (APIs, analytics clients) for testability.
  - Provide `FormTelemetryManager` to emit analytics events (ADR-029) and observability traces (ADR-004).
- Accessibility & UX:
  - Enforce 44×44 px hit targets, semantic labels, and error announcements.
  - Manage optimistic updates vs. server validation through `ServerActionManager`.
- Tooling integration:
  - Use RHF DevTools in Storybook (ADR-027) for component previews.
  - Write Vitest unit tests with testing-library helpers; cover Zod schema edge cases.

## Diagrams
- [Architecture Overview](../diagrams/adr-020-form-engine/architecture-overview.mmd) — Form coordinators, RHF controllers, validation, network, and telemetry interactions.
- [Data Lineage](../diagrams/adr-020-form-engine/data-lineage.mmd) — Zod schemas, form state, submission records, and telemetry events.
- [UML Components](../diagrams/adr-020-form-engine/uml-components.mmd) — Coordinator, manager, validation, telemetry, and server action collaborators.
- [BPMN Submission Flow](../diagrams/adr-020-form-engine/bpmn-submission.mmd) — Validation, submission, fallback, and analytics lifecycle.

## Consequences
- **Benefits:** Strong DX with RHF + Zod pairing, shared validation logic across server/client, fast re-render performance.
- **Trade-offs:** Team must stay current with RHF/Zod updates; schema complexity can grow—mitigate with decomposition and documentation.
- **Follow-ups:**
  - Publish reusable form primitives (input, select, checkbox) aligned with brand tokens.
  - Add lint rules ensuring Zod schemas exported alongside form implementations.
  - Document fallback strategy for non-JS environments (progressive enhancement).
