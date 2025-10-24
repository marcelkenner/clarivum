---
id: TSK-PLAT-043
title: Build Monetization Telemetry Platform
status: backlog
area: platform
subarea: monetization
owner: Platform Engineer
collaborators:
  - Analytics Engineer
  - Finance Ops Lead
  - Partnerships Manager
effort: large
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/adr/ADR-026-coupons-and-affiliate-incentives.md
  - docs/PRDs/requierments/analytics/feature-requirements.md
  - docs/runbooks/affiliate-ad-ops.md
context7:
  - /supabase/supabase
  - /vercel/edge-functions
  - /plausible/docs
tags:
  - monetization
  - telemetry
  - guardrail
---

## Summary
Deliver the edge services, background workers, and reconciliation tooling that capture ad/affiliate impressions and clicks, detect fraud, and reconcile partner revenue so Clarivum can audit every payout.

## Scope
- Edge APIs for impressions (`/api/monetization/impression`) and signed redirect links (`/go/:partner/:slug/:eventId`).
- Supabase schemas & migrations for immutable click/impression logs and reconciliation tables.
- Background workers for fraud detection, nightly reconciliation, and alerting.
- CLI/admin tooling for partner report imports and job monitoring.

## Dependencies
- ADR-033 approved; analytics event catalogue updated with monetization events.
- Observability stack prepared for new metrics/alerts (ADR-004).
- Finance + partnerships agree on reconciliation thresholds and report formats.
- Consent gating logic aligned with ADR-014 and analytics SDK.

## Definition of Ready
- [ ] Data model RFC reviewed (tables, columns, retention, indexing).
- [ ] Edge runtime constraints validated (Vercel Edge vs Lambda) with performance budget (<20 ms logging overhead).
- [ ] Fraud signal rules documented with partnerships/finance (rate limits, geo, session).
- [ ] Alerting requirements captured (Slack, PagerDuty, thresholds).
- [ ] Synthetic monitoring plan defined (Checkly or GitHub Actions).

## Definition of Done
- [ ] Impression + click services deployed with HMAC-signed parameters, allowlists, and consent-aware logging.
- [ ] Supabase tables populated with immutable events; migrations and RLS policies reviewed.
- [ ] Background workers detect anomalies, enqueue alerts, and expose reconciliation outputs for finance.
- [ ] Admin tooling (CLI/UI) supports partner report import, job status review, and manual retries.
- [ ] Metrics/dashboards live (Grafana, Plausible, Looker) with CTR, RPM, and revenue variance tracking.
- [ ] Synthetic monitors and Playwright tests validate redirect pipeline end-to-end.
- [ ] Runbooks (`docs/runbooks/affiliate-ad-ops.md`, `docs/runbooks/analytics-qa.md`) updated with operational steps.

## Work Plan
- [ ] **Schema & Infrastructure** — Implement Supabase migrations, secrets, and edge deployment scaffolding.
- [ ] **Impression Logging** — Build IntersectionObserver-based SDK, edge endpoint, and consent guards.
- [ ] **Click Redirect** — Implement signed URL generator, redirect handler, and fallback UI.
- [ ] **Fraud Detection** — Develop worker to score events, throttle via Flagsmith, and alert.
- [ ] **Reconciliation** — Create pipelines/scripts to ingest partner data and compare against internal metrics.
- [ ] **Observability & Tooling** — Add metrics, dashboards, admin commands, and synthetic monitors.
- [ ] **Testing** — Unit/integration tests, load tests for edge endpoints, QA automation updates.

## Out of Scope
- Partner-side conversion APIs (future phase).
- Ad creative management and inventory negotiation (handled by marketing/partnerships).
- Payment processing of partner invoices (finance systems).

