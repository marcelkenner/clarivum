# Feature Flag & Experimentation Platform Diagrams
- **ADR:** `docs/adr/ADR-005-feature-flags.md`
- **Last updated:** 2025-10-23
- **Owners:** Product Engineering

## Overview
These diagrams explain how Flagsmith integrates with Clarivum’s delivery pipeline. They cover the runtime architecture, flag configuration data, SDK abstractions that protect performance, and the governance workflow for creating, rolling out, and retiring flags.

## Files
- `architecture-overview.mmd` — Next.js SDK integration with Flagsmith and observability hooks.
- `data-lineage.mmd` — Flag metadata entities, audit trails, and cache storage.
- `uml-sdk.mmd` — Client abstractions handling environment fallback and caching.
- `bpmn-flag-lifecycle.mmd` — Workflow for proposing, approving, and removing flags.
