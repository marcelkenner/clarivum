# Testing Strategy & Tooling Diagrams
- **ADR:** `docs/adr/ADR-015-testing-strategy.md`
- **Last updated:** 2025-10-23
- **Owners:** Quality Engineering

## Overview
These diagrams outline the layered testing strategy spanning Vitest, Playwright, accessibility audits, and CI orchestration. They depict the tooling architecture, test artifact data flows, helper components, and the continuous delivery workflow that enforces quality gates.

## Files
- `architecture-overview.mmd` — Test harnesses, CI pipelines, and deployment touch points.
- `data-lineage.mmd` — Test artifacts, reports, and trace storage across Vitest and Playwright.
- `uml-modules.mmd` — Helper classes that provision fixtures, feature flags, and environment setup.
- `bpmn-ci.mmd` — Pull request validation workflow from submission through merge.
- `test-layer-sequence.mmd` — Sequence of developer, QA, and metrics hand-offs during suite execution.
