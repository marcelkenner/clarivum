# Product Analytics Platform Diagrams (Archived)
- **ADR:** `docs/adr/ADR-008-product-analytics-platform.md` (superseded by `docs/adr/ADR-029-plausible-analytics-platform.md`)
- **Last updated:** 2025-10-23
- **Owners:** Growth Analytics

## Overview
These diagrams describe the former PostHog analytics stack, instrumentation toolkit, and governance workflows adopted in ADR-008. They are retained for historical context only—refer to ADR-029 for the active Plausible Analytics architecture.

## Files
- `architecture-overview.mmd` — Event producers and sinks across PostHog, Supabase, and alerting tools (historical).
- `data-lineage.mmd` — Canonical event schema relationships and warehouse sync mapping (historical).
- `uml-instrumentation.mmd` — Analytics SDK facades providing consent gating and type-safe event emission (historical).
- `bpmn-governance.mmd` — Workflow for publishing schema changes and remediation of funnel regressions (historical).
