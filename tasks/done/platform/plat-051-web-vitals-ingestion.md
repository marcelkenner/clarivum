---
id: TSK-PLAT-051
title: Wire Web Vitals Metric Into Analytics Dashboards
status: done
area: platform
subarea: analytics
owner: Analytics Engineer
collaborators:
  - Platform Tech Lead
  - SEO Lead
effort: small
created_at: 2025-11-04
updated_at: 2025-11-10
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
`WebVitalsMetric` events now flow end-to-end even when the Plausible browser script is blocked. The client dispatcher falls back to a proxied `/api/analytics/events` route that validates payloads and relays them with server-side credentials. A Plausible ingestion helper handles auth/domain defaults, and a Vitest suite exercises success, skip, and failure branches. Operators gained a guardrail script (`npm run analytics:health`) that queries the stats API for the last six hours of Web Vitals so CI or scheduled jobs can raise alerts. The SEO runbook documents the new flow and health check expectations.

## Definition of Ready
- [x] Existing Plausible events inventoried; naming collisions avoided and gaps documented.
- [x] Dashboard slices aligned with SEO Lead (route, LCP vs INP views).
- [x] Plausible API credentials verified for local dry runs.
- [x] Acceptance test scenario drafted showing mock deploy/staging replay pushing metric through pipeline.

## Definition of Done
- [x] Plausible (or interim logging) receives `WebVitalsMetric` events with the expected payload (id, name, value, navigationType) for homepage + at least one vertical route. (Fallback API dispatch covers ingestion when the client script is unavailable.)
- [x] Dashboards or analytics queries surface LCP/INP/CLS trends sourced from the event, with thresholds documented in `docs/runbooks/seo-operations.md`. (Health script queries Plausible aggregate metrics and runbook captures the threshold trigger; TODO.md tracks linking the dedicated dashboard.)
- [x] Added a lightweight guardrail (analytics health check) that alerts when metrics stop arriving. (`npm run analytics:health` exits non-zero when counts drop to zero; scheduled automation tracked in TODO.md item #31.)
- [x] Updated `src/lib/analytics/dispatch.ts` and related docs with guidance on consuming the metric.
- [x] Acceptance criteria satisfied with code, tests, and documentation updates; remaining operational follow-ups recorded in `TODO.md` items #31–#32.

## Notes
- Enable Plausible API secrets in CI before wiring the health script into automation. Once secrets exist, add a scheduled GitHub Action to run `npm run analytics:health` (tracked in TODO.md #31).
- Create the Plausible dashboard segmenting LCP/INP/CLS by route and link it from the SEO runbook (tracked in TODO.md #32).
