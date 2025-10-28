---
id: TSK-PLAT-019
title: Build Wttr.in UV Widget Service Layer
status: backlog
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - Frontend Engineer
  - QA Lead
effort: medium
created_at: 2025-10-23
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/widget_indeks_uv.md
  - docs/PRDs/requierments/homepage/feature-requirements.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md
  - docs/runbooks/tools-platform-operations.md
context7:
  - /nodejs/node
  - /whatwg/fetch
  - /upstash/redis
tags:
  - api
  - caching
  - observability
---

## Summary
Create the `/api/tools/uv-widget` service pipeline that calls Wttr.in, applies caching and rate limits, enriches responses with Strapi copy, and surfaces fallback metadata for the hero widget.

## Definition of Ready
- [x] Legal sign-off secured: Wttr.in terms, rate limits, attribution, and risk text captured in ADR with Ops approval.
- [x] Env vars/secrets cataloged: `UV_API_BASE`, `TIMEOUT_MS`, `CACHE_TTL`, optional `API_KEY` stored in Secrets Manager.
- [x] Strapi risk-copy model defined: localized entries (`en`, `pl`) for risk levels low→extreme with disclaimers and CTA metadata owned by Content Strategy.
- [x] Observability plan locked: capture timing, upstream status, fallback counts; alert when upstream 5xx >2% over 5 min.

## Definition of Done
- [ ] Edge handler integrates Wttr.in forecast responses with retries, timeouts, and 5 min cache.
- [ ] Strapi copy loader returns localized risk messages and CTA configs.
- [ ] Rate limiting (per IP + global) and analytics instrumentation implemented.
- [ ] Feature flag + configuration toggles documented and covered with unit/integration tests.
- [ ] `docs/runbooks/tools-platform-operations.md` updated with failure modes and manual failover steps.
- [ ] DataDog monitors live for error rate, latency, and fallback percentage.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
