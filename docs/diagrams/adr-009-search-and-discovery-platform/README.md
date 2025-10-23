# Search & Discovery Platform Diagrams
- **ADR:** `docs/adr/ADR-009-search-and-discovery-platform.md`
- **Last updated:** 2025-10-23
- **Owners:** Content Platform Team

## Overview
These diagrams explain the Meilisearch-based discovery platform, covering ingestion from Strapi, index management, client usage, and operational guardrails. They visualize the managed architecture, schema assets, SDK abstractions, and the cadence for keeping indexes healthy.

## Files
- `architecture-overview.mmd` — Content ingestion, Meilisearch indexes, and consumer applications.
- `data-lineage.mmd` — Index schemas, ranking rules, and synchronization state.
- `uml-clients.mmd` — Service objects handling indexing, search queries, and analytics hooks.
- `bpmn-reindex.mmd` — Zero-downtime reindexing and validation workflow.
