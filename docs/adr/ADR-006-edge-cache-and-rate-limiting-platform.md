# ADR-006: Edge Cache & Rate Limiting Platform
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum serves dynamic-yet-cachable marketing flows on Vercel edge/serverless runtimes where traditional stateful Redis connections are impractical.
- The platform requires shared response caching, idempotency coordination, and API abuse protection that work across edge middleware, server actions, and background workers.
- Solutions must guarantee EU data residency, scale elastically with traffic spikes, and avoid bespoke infrastructure management for the ≤4 person engineering team.
- Rate limiting needs to support burst handling (sliding window + token bucket) while keeping latency overhead below the 10 ms budget documented in the analytics PRD.
- Caching and guardrail expectations are described in `docs/PRDs/requierments/frontend-platform/feature-requirements.md` and `docs/PRDs/requierments/security/feature-requirements.md`.

## Decision
- Adopt **Upstash Redis (EU-central)** as the managed serverless data store for cacheable application state, rate limiting counters, and short-lived coordination locks.
  - Provision two logical databases: `clarivum-cache` (response/object cache, TTL ≤ 30 minutes) and `clarivum-guardrails` (rate limiting, dedupe locks, idempotency keys).
  - Interact with Redis via the Upstash REST-compatible SDKs to keep connections stateless across Vercel Edge, Node.js API routes, and Lambda workers.
- Publish an internal package `@clarivum/cache` that exposes OOP-style adapters:
  - `EdgeResponseCache` for ViewModel-layer composition (stale-while-revalidate with background refresh).
  - `RateLimiterManager` wrapping `@upstash/ratelimit` with policy injection per API scope.
  - `DistributedLockCoordinator` for one-at-a-time background jobs (leveraging `@upstash/lock`).
- Configure defaults aligned with Upstash guidance:
  - Enable the SDK’s ephemeral in-memory cache for hot rate-limit keys to minimize outbound requests.
  - Namespace keys with `<environment>:<domain>:<resource>` to prevent cross-environment bleed.
  - Store cached payloads as JSON with checksum/version metadata for safe invalidation.
- Manage lifecycle via Terraform (Upstash provider) with rotation of REST tokens every 90 days and audit bindings in the FinOps dashboard.
- Instrument cache hit/miss and throttling metrics via OpenTelemetry, exporting to Grafana Loki/Prometheus.

## Consequences
- **Benefits:** Serverless-native Redis removes connection pooling complexity, keeps latency low on the edge, and provides turnkey rate limiting primitives with EU residency.
- **Trade-offs:** Upstash enforces request quotas; exceeding the free tier incurs SaaS spend. Mitigate by monitoring usage and enabling SDK-side caching.
- **Constraints:** Cold regions outside Europe experience slightly higher latency; critical flows must fall back gracefully (serve stale cache or bypass throttles for known-safe origins).
- **Follow-ups:**
  - Document cache key conventions and invalidation procedures in `docs/runbooks/cache-invalidation.md`.
  - Add automated smoke tests that validate rate limiting rules per vertical before each release.
  - Revisit the need for multi-region replication once DAU exceeds 100k or latency SLOs fail.
