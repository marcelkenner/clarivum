# ADR-021: Diagnostics & Quiz Platform
Date: 2025-10-24
Status: Accepted

## Context
- Diagnostics experiences (Habits quiz, SPF advisor, routine planners) are core to Clarivum’s value proposition and must feed personalization, recommendations, and analytics.
- `docs/PRDs/requierments/diagnostics/feature-requirements.md` outlines workflows, branching logic, consent, and integrations with Supabase, Flagsmith, and Plausible Analytics.
- We need a reusable architecture that separates question banks, scoring engines, and presentation layers while keeping compliance (GDPR) top of mind.

## Decision
- Build diagnostics on a **Composable Quiz Engine** with three layers:
  - **Question Bank Manager:** Stores content in Strapi (ADR-010) with versioned schemas and locale support.
  - **Evaluation Engine:** Executes scoring using stateless functions (supported by Zod validation per ADR-020) and writes outcomes to Supabase (ADR-001).
  - **Presentation ViewModels:** React server components render steps; client components handle interaction tokens.
- State management:
  - Use Flagsmith (ADR-005) to toggle experimental questions or flows.
  - Persist progress in Supabase via server actions; support resume/draft states.
- Privacy & compliance:
  - Capture explicit consent with Klaro! flags (ADR-014).
  - Hash personal identifiers and honor deletion requests within 30 days.
- Observability & analytics:
  - Emit diagnostics events through `DiagnosticsTelemetryManager` aligning with ADR-029.
  - Trace key spans with OpenTelemetry (ADR-004); monitor completion rates and errors.
- Extensibility:
  - Define question schemas using JSON Schema + Zod for consistent typing.
  - Support pluggable outcome calculators so teams can introduce new quizzes without rewriting framework.

## Diagrams
- [Architecture Overview](../diagrams/adr-021-diagnostics-platform/architecture-overview.mmd) — Question bank ingestion, presentation layer, evaluation engine, and telemetry flow.
- [Data Lineage](../diagrams/adr-021-diagnostics-platform/data-lineage.mmd) — Questions, responses, outcomes, telemetry, and consent records.
- [UML Components](../diagrams/adr-021-diagnostics-platform/uml-components.mmd) — Managers, coordinators, evaluators, repositories, and telemetry services.
- [BPMN Session Flow](../diagrams/adr-021-diagnostics-platform/bpmn-session.mmd) — Consent, branching, persistence, scoring, and outcome delivery.

## Consequences
- **Benefits:** Modular architecture enables reuse across Skin/Fuel/Habits, supports A/B testing, and enforces compliance.
- **Trade-offs:** Requires disciplined content governance and schema versioning; more upfront work than bespoke quizzes.
- **Follow-ups:**
  - Create Strapi content models and authoring guide for quizzes.
  - Build automated tests with Vitest and Playwright covering branching paths.
  - Schedule quarterly audits of scoring fairness and bias across segments.
