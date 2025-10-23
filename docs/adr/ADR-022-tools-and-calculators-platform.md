# ADR-022: Tools & Calculators Platform
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum’s Narzędzia (tools) library includes calculators, planners, and estimators (e.g., SPF dose calculator, exfoliation planner) described across multiple PRDs under `docs/PRDs/requierments/tools/`.
- These experiences must share UI scaffolding, analytics instrumentation, localization, and safety checks while remaining easy to extend.
- Previous MVPs risked fragmentation (each tool built ad-hoc). We need a consistent platform that aligns with diagnostics, forms, and brand design.

## Decision
- Implement a **Tools Platform** composed of:
  - **ToolShell ViewModel:** Provides layout, hero messaging, CTA orchestration, and shared states (loading, error, result).
  - **Computation Manager:** Pure functions per tool handling domain logic; unit-tested with Vitest.
  - **Data Providers:** Optional integrations (Supabase for persistence, Strapi for copy blocks, external APIs where licensed) injected via interfaces.
- Frontend conventions:
  - Built atop the frontend platform (ADR-019) and form engine (ADR-020).
  - Each tool lives under `app/(marketing)/narzedzia/<slug>/` with view models/managers split to keep files <200 lines.
- Observability & analytics:
  - Instrument events using ADR-008 catalogue (e.g., `FuelToolLaunched`, `HabitsQuizCompleted`).
  - Expose metrics through OpenTelemetry spans (ADR-004).
- Accessibility & UX:
  - Enforce WCAG AA compliance, keyboard navigation, and 44×44 px interactive targets.
  - Provide inline validation, localization hooks, and offline resilience (cache last inputs client-side when safe).
- Governance:
  - New tools must follow template `ToolBlueprint` exporting metadata (slug, vertical, required consents).
  - Central registry enumerates tools for sitemap generation and feature flags.

## Diagrams
- [Architecture Overview](../diagrams/adr-022-tools-and-calculators-platform/architecture-overview.mmd) — Tool shell, computation managers, data providers, and analytics.
- [Data Lineage](../diagrams/adr-022-tools-and-calculators-platform/data-lineage.mmd) — Tool metadata, inputs, results, and instrumentation events.
- [UML Components](../diagrams/adr-022-tools-and-calculators-platform/uml-components.mmd) — ViewModel, computation manager, data provider interface, blueprint, and telemetry classes.
- [BPMN Tool Lifecycle](../diagrams/adr-022-tools-and-calculators-platform/bpmn-tool-lifecycle.mmd) — Ideation, build, review, launch, and monitoring workflow.

## Consequences
- **Benefits:** Reuse across tool specs, faster implementation, consistent analytics and compliance handling.
- **Trade-offs:** Shared abstractions add complexity; ensure documentation stays current.
- **Follow-ups:**
  - Publish authoring guide for new tools.
  - Automate linting to enforce template usage and analytics coverage.
  - Evaluate bundling domain logic into separate packages for reuse in mobile apps.
