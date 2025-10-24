# ADR-034 Diagrams · AGENTS Guide

Maintain lightweight Mermaid diagrams that illustrate the SEO platform decisions from ADR-034. Update these files whenever the metadata pipeline, governance flow, or monitoring stack changes. Keep diagrams ASCII-only and ensure they render with the mermaid CLI used in CI.

## Files

- `architecture-overview.mmd` — container view of the SEO platform components.
- `metadata-pipeline.mmd` — sequence diagram for metadata and structured data generation.
- `search-console-ingestion.mmd` — ingestion flow for Search Console metrics.
- `uml-components.mmd` — component relationships for metadata, structured data, and monitoring services.
- `bpmn-governance.mmd` — BPMN-style governance cadence illustrating guardrail adoption.
- `governance-swimlane.mmd` — swimlane diagram depicting roles and guardrail responsibilities.

Run `npm run lint:diagrams` after editing to confirm formatting.
