---
id: TSK-PLAT-051
title: Wire Web Vitals Metric Into Analytics Dashboards
status: backlog
area: platform
subarea: analytics
owner: Analytics Engineer
collaborators:
  - Platform Tech Lead
  - SEO Lead
effort: small
created_at: 2025-11-04
updated_at: 2025-11-07
links:
  - docs/runbooks/seo-operations.md
  - docs/PRDs/seo-foundation.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
context7:
  - /vercel/next.js
tags:
  - analytics
  - telemetry
  - seo
---

## Summary
Confirm the new `WebVitalsMetric` analytics event emitted by `WebVitalsReporter` is ingested, persisted, and charted in Plausible dashboards so Platform and SEO leads can monitor Core Web Vitals regressions in near real time.

## Definition of Ready
- [x] Existing Plausible events inventoried; naming collisions avoided and gaps documented.
- [x] Dashboard slices aligned with SEO Lead (route, LCP vs INP views).
- [x] Plausible API credentials verified for local dry runs.
- [x] Acceptance test scenario drafted showing mock deploy/staging replay pushing metric through pipeline.

## Definition of Done
- [ ] Plausible (or interim logging) receives `WebVitalsMetric` events with the expected payload (id, name, value, navigationType) for homepage + at least one vertical route.
- [ ] Dashboards or analytics queries surface LCP/INP/CLS trends sourced from the event, with thresholds documented in `docs/runbooks/seo-operations.md`.
- [ ] Add a lightweight guardrail (e.g., Playwright smoke or analytics health check) that alerts when metrics stop arriving.
- [ ] Update `src/lib/analytics/dispatch.ts` or related docs with guidance on consuming the metric.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are reviewed and updated to reflect this telemetry addition.

## Notes
- Coordinate with TSK-SEO-002 (SEO governance rollout) to fold the dashboard into the governance rituals.
- If Plausible integration is blocked, create a stub pipeline writing to `metrics/quality.json` and track follow-up work.
