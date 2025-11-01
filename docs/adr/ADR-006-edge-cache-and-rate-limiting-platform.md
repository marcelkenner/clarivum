# ADR-006: Edge Cache & Rate Limiting Platform
Date: 2025-10-21
Status: Accepted (updated 2025-11-08)

## Context
- Clarivum serves dynamic-yet-cacheable marketing flows on CloudFront, Lambda, and Next.js runtimes that span Vercel edge functions and AWS Lambda workers.
- The platform requires shared response caching, idempotency coordination, and API abuse protection that work across edge middleware, server actions, and background workers without coupling business logic to infrastructure.
- Solutions must guarantee EU data residency, scale elastically with traffic spikes, and remain fully within the AWS ecosystem to satisfy Guardrail #7.
- Edge-adjacent components (CloudFront Functions, Lambda@Edge, Vercel Edge runtime) still need HTTP-compatible access to caching primitives, while VPC workloads can rely on Redis protocols directly.
- Rate limiting needs to support burst handling (sliding window + token bucket) while keeping latency overhead below the 10 ms budget documented in the analytics PRD.
- Caching and guardrail expectations are described in `docs/PRDs/requierments/frontend-platform/feature-requirements.md` and `docs/PRDs/requierments/security/feature-requirements.md`.

## Decision
- Adopt **AWS ElastiCache Serverless for Redis (eu-central-1)** as the managed data store for cacheable application state, rate limiting counters, and short-lived coordination locks.
  - Provision a single shared serverless cache `clarivum-shared-cache` with environment-prefixed key namespaces (`dev|prod:<surface>:<resource>`). Guardrail keys use the `guardrail:` prefix; response caches use `cache:`.
  - Enable TLS and IAM authentication; rotate user passwords via Terraform and distribute short-lived auth tokens through AWS Secrets Manager (`clarivum/platform/<env>/cache/*`).
- Provide two access patterns:
  1. **Cache Data API Clients** — VPC-based Lambda & Fargate workloads connect via the ElastiCache Data API using SigV4-signed HTTPS requests. The `RedisCacheGateway` class encapsulates connection pooling and retry/backoff rules.
  2. **Edge Cache Gateway** — An API Gateway + Lambda (`cache-gateway`) exposes a minimal HTTP surface (GET/SET/DELETE/BATCH) for CloudFront Functions, Lambda@Edge, and other edge runtimes that cannot reach VPC resources directly. Lambda invokes Redis commands using the Data API in the same VPC.
- Platform Lambda runtimes initially connect directly to ElastiCache over TLS; the Cache Gateway rollout is tracked as a follow-up for edge execution contexts.
- Publish an internal package `@clarivum/cache` that exposes OOP adapters:
  - `EdgeResponseCache` for ViewModel-layer composition (stale-while-revalidate with background refresh) using either direct Data API access or the edge gateway based on environment.
  - `RateLimiterManager` implementing token bucket + sliding window policies atop ElastiCache scripts, ensuring per-scope configuration and telemetry hooks.
  - `DistributedLockCoordinator` for one-at-a-time background jobs leveraging Redis `SET NX PX` semantics through the gateway.
- Configure defaults aligned with AWS guidance:
  - Namespace keys with `<environment>:<domain>:<resource>` to prevent cross-environment bleed.
  - Persist JSON payloads with checksum/version metadata for safe invalidation.
  - Capture CloudWatch metrics (`CurrConnections`, `CacheHitRate`, `EngineCPUUtilization`) and export structured logs via OpenTelemetry for hit/miss and throttling signals.
- Manage lifecycle entirely with Terraform (`aws_elasticache_serverless_cache`, supporting security group/route table rules, cache users) and embed provisioning scripts under `tools/cache/`.
- Decommission Upstash artefacts (accounts, secrets, runbook references) after ElastiCache smoke tests complete and incident playbooks are updated. ✅ Completed for dev/prod; caches `platform-dev-cache` and `platform-prod-cache` now deliver TLS RESP connections via the platform Terraform stack.

### Design sketch

```mermaid
flowchart LR
    subgraph Edge
        CF[CloudFront Functions] -->|HTTP| GW[Cache Gateway API (API Gateway)]
    end
    subgraph Platform VPC
        GW --> LG[Cache Gateway Lambda]
        LG -->|Data API| EC[(ElastiCache Serverless Redis)]
        LambdaJobs[AWS Lambda Jobs] -->|Data API| EC
        NextAPI[Next.js Server Actions] -->|Data API| EC
    end
    EC --> CW[CloudWatch Metrics/Otel]
```

## Diagrams
- [Architecture Overview](../diagrams/adr-006-edge-cache-and-rate-limiting-platform/architecture-overview.mmd) — Edge, API, and worker integrations with AWS ElastiCache via the Cache Gateway.
- [Data Lineage](../diagrams/adr-006-edge-cache-and-rate-limiting-platform/data-lineage.mmd) — Cache entries, rate-limit counters, and distributed lock records.
- [UML Adapters](../diagrams/adr-006-edge-cache-and-rate-limiting-platform/uml-adapters.mmd) — Internal OOP abstractions over ElastiCache Data API and gateway calls.
- [BPMN Guardrail Flow](../diagrams/adr-006-edge-cache-and-rate-limiting-platform/bpmn-guardrail.mmd) — Request evaluation from cache lookup through throttling.

## Consequences
- **Benefits:** AWS ElastiCache Serverless keeps caching fully within AWS with automatic scaling, IAM-based auth, and CloudWatch observability while retaining low-latency Redis semantics.
- **Trade-offs:** Edge runtimes require the Cache Gateway hop, introducing ~5–10 ms additional latency versus direct REST services. The gateway must be highly available (provisioned concurrency) to avoid cache outages.
- **Constraints:** CloudFront Functions remain limited to HTTP operations; complex multi-command pipelines should execute from VPC workloads whenever possible. Ensure per-environment quotas stay within ElastiCache limits.
- **Follow-ups:**
  - Update `infra/aws/platform` Terraform modules to provision the serverless cache, cache users, security groups, and Cache Gateway stack.
  - Update `docs/runbooks/cache-invalidation.md`, `docs/runbooks/tools-platform-operations.md`, and related SOPs to reference ElastiCache operations.
  - Add automated smoke tests that validate rate limiting rules per vertical before each release.
  - Revisit the need for multi-region replication once DAU exceeds 100k or latency SLOs fail.
