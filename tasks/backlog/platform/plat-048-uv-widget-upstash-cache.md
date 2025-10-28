---
id: TSK-PLAT-048
title: Harden UV Widget Caching & Rate Limits With Upstash
status: backlog
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - DevOps Lead
  - QA Lead
effort: small
created_at: 2025-11-07
updated_at: 2025-11-07
links:
  - docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-038-uv-widget-service-guardrails.md
  - docs/runbooks/tools-platform-operations.md
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
context7:
  - /upstash/redis
  - /vercel/next.js
tags:
  - caching
  - rate-limiting
  - tools
---

## Summary
Replace the in-memory UV widget cache and ad-hoc rate limiter with shared Upstash Redis primitives so the service scales across instances and preserves SLA guardrails.

## Definition of Ready
- [x] Upstash databases confirmed: `clarivum-cache` and `clarivum-guardrails` namespaces provisioned.
- [x] TTL/burst/sustained limits approved and documented in ADR-006.
- [x] Secrets stored for REST tokens (`UPSTASH_*` entries in Secrets Manager).
- [x] Failure playbook updated with remediation steps for Upstash outages.

## Definition of Done
- [ ] UV widget manager uses `@upstash/redis` (cache) and `@upstash/ratelimit` (throttle) with metrics hooks.
- [ ] Integration tests cover cache hit, stale revalidation, and throttled response.
- [ ] Ops runbook documents new keys, TTLs, and alert thresholds; synthetic probe validates warm cache path.
- [ ] Feature toggles or env overrides allow fallback to graceful degraded mode (serve stale data) if Upstash unavailable.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.
