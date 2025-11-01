---
id: TSK-PLAT-048
title: Harden UV Widget Caching & Rate Limits With Cache Gateway
status: backlog
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - DevOps Lead
  - QA Lead
effort: small
created_at: 2025-11-07
updated_at: 2025-11-08
links:
  - docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-038-uv-widget-service-guardrails.md
  - docs/runbooks/tools-platform-operations.md
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
context7:
  - /aws/elasticache
  - /vercel/next.js
tags:
  - caching
  - rate-limiting
  - tools
---

## Summary
Replace the in-memory UV widget cache and ad-hoc rate limiter with the shared Cache Gateway + ElastiCache Serverless stack so the service scales across edge instances and preserves SLA guardrails.

## Definition of Ready
- [x] Cache Gateway endpoint (`CACHE_GATEWAY_URL`) reachable from edge runtimes; IAM role assumption (`CACHE_GATEWAY_ROLE_ARN`) verified.
- [x] TTL/burst/sustained limits approved and documented in ADR-006.
- [x] Secrets/parameters for Data API (`ELASTICACHE_DATA_API_ENDPOINT`) and Cache Gateway stored in AWS Secrets Manager.
- [x] Failure playbook updated with remediation steps for Cache Gateway or ElastiCache outages.

## Definition of Done
- [ ] UV widget manager uses `EdgeResponseCache` + `RateLimiterManager` configured for Cache Gateway/ElastiCache with structured metrics.
- [ ] Integration tests cover cache hit, stale revalidation, and throttled response paths.
- [ ] Ops runbook documents new keys, TTLs, alert thresholds, and synthetic probe validates warm cache path.
- [ ] Feature toggles or env overrides allow fallback to graceful degraded mode (serve stale data) if Cache Gateway unavailable.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.
