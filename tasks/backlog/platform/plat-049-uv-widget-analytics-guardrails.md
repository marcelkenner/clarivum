---
id: TSK-PLAT-049
title: Instrument UV Widget Analytics Guardrails
status: backlog
area: platform
subarea: analytics
owner: Analytics Engineer
collaborators:
  - Frontend Engineer
  - Platform Engineer
effort: small
created_at: 2025-11-07
updated_at: 2025-11-07
links:
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/adr/ADR-038-uv-widget-service-guardrails.md
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
  - docs/runbooks/tools-platform-operations.md
context7:
  - /plausible/docs
  - /vercel/next.js
tags:
  - analytics
  - guardrail
  - tools
---

## Summary
Add Plausible custom events and dashboards that monitor UV widget load, fallback, and CTA engagement so product and ops can confirm the tool is healthy after launch.

## Definition of Ready
- [x] Event schema reviewed and appended to ADR-029.
- [x] Plausible API credentials scoped for server-side ingestion stored securely.
- [x] Success thresholds defined: widget load rate and fallback percentage with alert wiring.
- [x] QA plan covers consent handling and locale-specific payloads.

## Definition of Done
- [ ] Server emits `uv_widget_load`, `uv_widget_refresh`, and `uv_widget_error` events with properties (`has_consent`, `source_city`, `fallback_reason`, `uv_now_bucket`).
- [ ] CTA clicks fire `uv_widget_cta_click` with `cta_id` and locale; documentation updated for marketing teams.
- [ ] Plausible dashboard or reports created with baseline alerts (e.g., fallback >10% during 30m window).
- [ ] Tests/assertions verify analytics calls during unit or integration suites without hitting the network.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents updated to reflect this work.
