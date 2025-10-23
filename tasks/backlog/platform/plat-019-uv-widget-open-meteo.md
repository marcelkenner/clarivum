---
id: TSK-PLAT-019
title: Build Open-Meteo UV Widget Service Layer
status: backlog
area: platform
subarea: tools-platform
owner: Platform Engineer
collaborators:
  - Frontend Engineer
  - QA Lead
effort: medium
created_at: 2025-10-23
updated_at: 2025-10-23
links:
  - docs/PRDs/requierments/tools/widget_indeks_uv.md
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
Create the `/api/tools/uv-widget` service pipeline that calls Open-Meteo, applies caching and rate limits, enriches responses with Strapi copy, and surfaces fallback metadata for the hero widget.

## Definition of Ready
- [ ] Open-Meteo usage terms and attribution requirements confirmed with legal.
- [ ] Environment variables and secrets prepared for stage/prod deploys.
- [ ] Strapi content model for risk copy finalized (keys, locales).
- [ ] Observability events and alerts defined with SRE.

## Definition of Done
- [ ] Edge handler integrates Open-Meteo forecast + geocoding with retries, timeouts, and 5 min cache.
- [ ] Strapi copy loader returns localized risk messages and CTA configs.
- [ ] Rate limiting (per IP + global) and analytics instrumentation implemented.
- [ ] Feature flag + configuration toggles documented and covered with unit/integration tests.
- [ ] `docs/runbooks/tools-platform-operations.md` updated with failure modes and manual failover steps.
- [ ] DataDog monitors live for error rate, latency, and fallback percentage.
