# Recommendations & Merchandising Platform Diagrams
- **ADR:** `docs/adr/ADR-025-recommendations-and-merchandising.md`
- **Last updated:** 2025-10-23
- **Owners:** Merchandising Squad

## Overview
These diagrams depict the recommendation service architecture that blends curated collections, behavioral signals, diagnostics outcomes, and affiliate metadata. They explain data flows, class responsibilities, and the lifecycle of serving recommendations to Clarivum surfaces.

## Files
- `architecture-overview.mmd` — Data sources, recommendation engine, caching, and delivery endpoints.
- `data-lineage.mmd` — Collections, signals, outcomes, and impression/click telemetry.
- `uml-components.mmd` — Service classes for selection, fallback heuristics, and affiliate enrichment.
- `bpmn-serving.mmd` — Recommendation serving workflow from request through telemetry logging.
