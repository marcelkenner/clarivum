# Edge Cache & Rate Limiting Platform Diagrams
- **ADR:** `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md`
- **Last updated:** 2025-11-01
- **Owners:** Platform Performance Team

## Overview
These diagrams illustrate how Clarivum uses AWS ElastiCache Serverless for Redis (plus an Edge Cache Gateway) to provide response caching, rate limiting, and distributed coordination across edge and serverless runtimes. Dev (`platform-dev-cache`) and prod (`platform-prod-cache`) now run through the Terraform-managed platform stack; update node labels when regenerating visuals.

## Files
- `architecture-overview.mmd` — Edge middleware, Cache Gateway, and VPC workloads sharing ElastiCache Serverless.
- `data-lineage.mmd` — Namespaced cache entries, rate limit counters, and coordination locks.
- `uml-adapters.mmd` — Internal OOP adapters wrapping ElastiCache Data API & gateway capabilities.
- `bpmn-guardrail.mmd` — Workflow for quota evaluation and fallback handling.
