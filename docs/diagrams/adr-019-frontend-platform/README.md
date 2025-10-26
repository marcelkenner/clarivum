# Frontend Application Platform Diagrams
- **ADR:** `docs/adr/ADR-019-frontend-platform.md`
- **Last updated:** 2025-11-05
- **Owners:** Frontend Platform Guild

## Overview
These diagrams describe the structure of the Next.js-based frontend platform, including routing boundaries, ViewModel/Manager relationships, styling token flow, and the deployment toolchain that supports the app.

## Files
- `architecture-overview.mmd` — Highlights `(marketing)` + dynamic vertical routes, the `_vertical-experience` module, and how ContentLibrary feeds sitemaps/RSS.
- `data-lineage.mmd` — Module boundaries for view models, managers, shared utilities, and styling tokens.
- `uml-components.mmd` — Core classes and interfaces orchestrating UI composition.
- `bpmn-release.mmd` — Feature delivery workflow across development, review, and deployment.
