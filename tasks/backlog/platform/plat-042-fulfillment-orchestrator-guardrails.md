---
id: TSK-PLAT-042
title: Launch Fulfillment Orchestrator Guardrails
status: backlog
area: platform
subarea: digital-products
owner: Platform Engineer
collaborators:
  - DevOps Lead
  - Lifecycle Marketing Lead
  - Support Ops Lead
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/runbooks/ebooks-fulfillment.md
context7:
  - /supabase/supabase
  - /stripe/stripe
  - /listmonk/docs
  - /auth0/docs
tags:
  - guardrail
  - reliability
  - entitlements
---

## Summary
Implement a durable fulfillment orchestrator, monitoring, and reconciliation tooling so every successful payment automatically produces receipts, download links, and account entitlements without manual intervention.

## Scope
- Durable queue / job table for fulfillment events with idempotency and exponential backoff.
- Separation of concerns for storage upload, entitlement persistence, email send, analytics events, and receipt generation.
- Alerting, dashboards, and reconciliation scripts to ensure zero silent failures.
- Admin tooling to view/retry jobs and resend receipts/downloads.

## Dependencies
- Stripe webhook infrastructure configured with secret rotation strategy (ADR-011).
- Observability stack (ADR-004) ready for new metrics/logs.
- Email infrastructure (Listmonk/Novu + SMTP provider) supports idempotent send API.
- Supabase admin role available for job table access.

## Definition of Ready
- [ ] Data model for `fulfillment_jobs` and `fulfillment_job_events` reviewed with DBA.
- [ ] Alert thresholds agreed with lifecycle marketing and support (e.g., >3 failures/hour).
- [ ] Support requirements for admin tooling captured (search by email, order ID, status).
- [ ] Incident playbook draft prepared (`docs/runbooks/ebooks-fulfillment.md` updates staged).
- [ ] DevOps confirms infrastructure for worker scaling and secure secrets storage.

## Definition of Done
- [ ] Fulfillment orchestrator service persists job records, runs idempotent steps, and handles retries with jitter.
- [ ] Metrics emitted (`fulfillment_jobs_active`, `fulfillment_jobs_failed_total`, `fulfillment_latency_seconds`) with dashboards in Grafana/Looker.
- [ ] PagerDuty/Slack alerts triggered when jobs remain pending beyond SLA or failure rate exceeds threshold.
- [ ] Admin UI or CLI provides search, retry, and resend actions with audit logging.
- [ ] Daily reconciliation script compares Stripe payments, Supabase entitlements, and email receipts; discrepancies auto-create Kaizen issue.
- [ ] End-to-end smoke test (`npm run ebooks:fulfillment-smoke`) validates successful payment results in receipt email + shelf visibility within SLA.
- [ ] Documentation updated (ADR-032 consequences, runbook guardrails) and support team trained.

## Work Plan
- [ ] **Model & Migration** — Create Supabase tables for jobs and events; enforce unique payment intent constraint.
- [ ] **Worker Implementation** — Build orchestrator worker with modular steps and shared context.
- [ ] **Instrumentation** — Add OTel spans, Prometheus metrics, and structured logs.
- [ ] **Alerting & Reconciliation** — Implement daily reconciliation script + dashboards + alert rules.
- [ ] **Admin Tooling** — Expose job search/resend UI in internal console; ensure RBAC.
- [ ] **Testing** — Unit + integration tests covering retries, partial failures, and replayed webhooks; update smoke scripts.

## Out of Scope
- Frontend account center UI (handled by FE-017).
- SMS receipts/notifications (future enhancement).
- Full digital product bundling logic (covered by other platform tasks).
