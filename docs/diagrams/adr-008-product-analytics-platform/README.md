# Product Analytics Platform Diagrams
- **ADR:** `docs/adr/ADR-008-product-analytics-platform.md`
- **Last updated:** 2025-10-23
- **Owners:** Growth Analytics

## Overview
These diagrams describe the managed PostHog analytics stack, instrumentation toolkit, and governance workflows adopted in ADR-008. They show ingestion paths, schema relationships, domain services that emit events, and the retention process that synchronizes data to Supabase.

## Files
- `architecture-overview.mmd` — Event producers and sinks across PostHog, Supabase, and alerting tools.
- `data-lineage.mmd` — Canonical event schema relationships and warehouse sync mapping.
- `uml-instrumentation.mmd` — Analytics SDK facades providing consent gating and type-safe event emission.
- `bpmn-governance.mmd` — Workflow for publishing schema changes and remediation of funnel regressions.
