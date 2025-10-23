# Form Engine & Validation Stack Diagrams
- **ADR:** `docs/adr/ADR-020-form-engine.md`
- **Last updated:** 2025-10-23
- **Owners:** Funnel Engineering

## Overview
These diagrams show how React Hook Form, Zod schemas, and Clarivum coordinators collaborate to deliver consistent forms. They outline architecture layers, shared validation data, object-oriented collaborators, and the lifecycle from user input to telemetry emission.

## Files
- `architecture-overview.mmd` — Form coordinators, managers, RHF controllers, and network boundaries.
- `data-lineage.mmd` — Zod schemas, form state, submissions, and telemetry events.
- `uml-components.mmd` — Coordinator, manager, validation, and telemetry classes.
- `bpmn-submission.mmd` — Form submission flow including validation, enrichment, and response handling.
