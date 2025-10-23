# Edge Cache & Rate Limiting Platform Diagrams
- **ADR:** `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md`
- **Last updated:** 2025-10-23
- **Owners:** Platform Performance Team

## Overview
These diagrams illustrate how Clarivum uses Upstash Redis to provide response caching, rate limiting, and distributed coordination across edge and serverless runtimes. They describe the integration topology, key/value schemas, adapter classes, and operational playbook for guardrail enforcement.

## Files
- `architecture-overview.mmd` — Edge middleware, API routes, and workers sharing Upstash Redis.
- `data-lineage.mmd` — Namespaced cache entries, rate limit counters, and coordination locks.
- `uml-adapters.mmd` — Internal OOP adapters wrapping Upstash SDK capabilities.
- `bpmn-guardrail.mmd` — Workflow for quota evaluation and fallback handling.
