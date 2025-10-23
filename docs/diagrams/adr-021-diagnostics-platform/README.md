# Diagnostics & Quiz Platform Diagrams
- **ADR:** `docs/adr/ADR-021-diagnostics-platform.md`
- **Last updated:** 2025-10-23
- **Owners:** Diagnostics Squad

## Overview
These diagrams depict the diagnostic engine architecture, including question management, scoring workflows, state persistence, and telemetry. They document data flow from Strapi to Supabase, the class collaborations that deliver quizzes, and the lifecycle for running and monitoring diagnostics.

## Files
- `architecture-overview.mmd` — Question bank, evaluation engine, and presentation layers.
- `data-lineage.mmd` — Question schemas, responses, outcomes, and telemetry records.
- `uml-components.mmd` — Managers, evaluators, state repositories, and telemetry orchestrators.
- `bpmn-session.mmd` — Quiz session lifecycle including consent, branching, and completion.
