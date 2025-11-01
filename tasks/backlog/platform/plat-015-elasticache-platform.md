---
id: TSK-PLAT-015
title: Provision AWS ElastiCache Serverless for Redis Platform
status: backlog
area: platform
subarea: edge-platform
owner: Edge Platform Manager
collaborators:
  - DevOps Lead
  - Frontend Lead
effort: small
created_at: 2025-10-25
updated_at: 2025-11-08
links:
  - docs/PRDs/requierments/frontend-platform/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md
  - docs/runbooks/cache-invalidation.md
context7:
  - /aws/elasticache
  - /vercel/next.js
tags:
  - caching
  - rate-limiting
  - infrastructure
---

## Summary
Provision the shared AWS ElastiCache Serverless for Redis footprint (cache + guardrail namespaces) plus the Cache Gateway (API Gateway + Lambda) that exposes HTTP access for edge runtimes. Wire observability, secrets, and IAM policies so all workloads can replace legacy Upstash usage without downtime.

## Definition of Ready
- [x] Namespaces, TTLs, and throughput documented: `cache:*` and `guardrail:*` prefixes with default TTL 300–900 s and per-scope rate limits approved by architecture.
- [x] Terraform modules for VPC access, security groups, IAM roles, and API Gateway baseline reviewed with platform team.
- [x] Monitoring plan set: CloudWatch dashboards and alerts defined for `AWS/ElastiCache` + Cache Gateway latency; OTEL metrics schema agreed.
- [x] Fallback requirements captured: incident playbook updated to cover Cache Gateway bypass and memory-mode fallback.

## Definition of Done
- [ ] Dev and prod ElastiCache Serverless caches created with IAM-authenticated users and metric alarms.
- [ ] Cache Gateway stack (API Gateway + Lambda) deployed with provisioned concurrency and WAF protections.
- [ ] Secrets (`CACHE_GATEWAY_URL`, `CACHE_GATEWAY_ROLE_ARN`, `ELASTICACHE_DATA_API_ENDPOINT`) stored in AWS Secrets Manager and injected into Next.js environments via CI.
- [ ] `@clarivum/cache` package configured to use new endpoints; smoke tests executed in dev.
- [ ] Grafana dashboards and runbooks updated with new operational checks.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.
