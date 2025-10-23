# Plausible Analytics Platform Diagrams
- **ADR:** `docs/adr/ADR-029-plausible-analytics-platform.md`
- **Last updated:** 2025-10-28
- **Owners:** Growth Analytics

## Overview
These diagrams illustrate the Plausible-first analytics architecture adopted in ADR-029. They cover script proxying, event dispatch, consent governance, and data exports to Supabase.

## Files
- `architecture-overview.mmd` — End-to-end event flow across clients, proxies, Plausible ingestion, and downstream alerts.
- `data-lineage.mmd` — Consent inputs, Plausible storage, nightly exports, and warehouse consumption.
- `uml-instrumentation.mmd` — Object-oriented components inside `@clarivum/analytics`.
- `bpmn-governance.mmd` — Schema change and rollout workflow.
