# Feature Requirements — Clarivum Operations Hub

> **Canonical decision:** See `docs/adr/ADR-031-admin-operations-hub.md` for architecture and integration choices.

## Objective
- Deliver a unified internal console (`/ops`) that aggregates operational signals, cross-system actions, and audits for Clarivum operators.
- Reduce tool-switching during incidents, Sisu guardrail follow-up, and day-to-day publishing/commerce tasks.

## Target Outcomes
- Business: cut mean time to acknowledge (MTTA) and resolve (MTTR) by 25%; reduce time spent on multi-tool reconciliations by 40%; support Kaizen guardrails with automated visibility.
- Experience: give operators a single login with contextual dashboards, quick links, and safe action triggers; preserve brand-quality UX for internal tools (accessible, responsive).

## Primary Users & Segments
- **Lifecycle Marketing & Comms:** evaluate campaigns, resend guardrails, monitor SES/Listmonk health.
- **Content Operations:** manage Strapi workflow states, cache invalidations, ISR status, glossary updates.
- **Support & Success:** resolve customer requests (entitlements, refunds, subscription status).
- **Payments & Finance:** review wallet health, webhooks, settlements, issue refunds within policy.
- **Engineering & SRE:** monitor incidents, rerun jobs, inspect feature flags, observe metrics.
- Segmentation via Auth0 roles: `ops_viewer`, `ops_editor`, `ops_admin`, with future specialized roles (e.g., `ops_finance`).

## Experience Principles
- Provide at-a-glance status using consistent color semantics (green/amber/red) linked to SLO thresholds.
- Fail safe: destructive actions require confirmation, logging, and flag gating.
- Deep-link to source systems for advanced workflows, showing last sync timestamps to build trust.
- Accessible by design (WCAG 2.1 AA), keyboard navigable, screen-reader friendly.

## Functional Requirements
- FR1 — Role-aware dashboard summarizing incidents, key metrics, active guardrails, and alerts.
- FR2 — Module navigation with feature flag support; modules shipped for launch:
  - FR2a Content & Publishing (Strapi workflow view, pending approvals, ISR triggers, Strapi webhook retries).
  - FR2b Communications (Listmonk campaign status, SES quotas, Novu workflow queue, Kaizen guardrail checklist).
  - FR2c Commerce & Billing (Stripe/PayU/P24 webhook health, wallet availability, refund initiation, settlement feed).
  - FR2d Support Console (search profiles, entitlements, subscriptions, support tickets, manual fulfillment actions).
- FR3 — Contextual deep links from every widget to the authoritative native console (Strapi entry, Listmonk campaign, Stripe dashboard, Grafana panel, etc.) respecting RBAC and audit logging.
- FR4 — Unified audit log capturing every action (timestamp, actor, module, payload) stored in Supabase `ops_audit`.
- FR5 — Configurable alerts integration with Slack (`#clarivum-ops`) and email digests; allow operators to subscribe/unsubscribe per module.
- FR6 — Global search bar crossing Supabase profiles, incidents, Kaizen notes, tasks, Strapi entries (requires role filtering).
- FR7 — Observability widget embedding Grafana panels with secure auth proxy.
- FR8 — Session timeout, idle warning, and seamless re-auth via Auth0 refresh tokens.
- FR9 — Support dark/light modes aligning with design system tokens.

## Content & Data Inputs
- Supabase (profiles, subscriptions, incidents, Sisu notes, ops_audit).
- Strapi REST API (collection types, workflow states).
- Listmonk API (campaigns, transactional logs).
- Amazon SES metrics (CloudWatch via AWS SDK) and SNS notifications.
- Novu API (workflow runs, errors).
- Stripe, PayU, P24 webhook logs (persisted in Supabase) and API metadata for settlements.
- Grafana Cloud API (dashboards/panels).
- Tasks board (read-only) for Kaizen and guardrail status.

## Integrations & Dependencies
- Internal: Next.js app, Supabase, feature flagging (Flagsmith), Sisu log directory, Kaizen workflows.
- External: Auth0, Strapi, Listmonk, Grafana Cloud, SES, Stripe, PayU, Przelewy24, Plausible (analytics), GitHub (Kaizen/guardrail issues), Slack webhooks.
- Requires server-side proxy layer to handle vendor credentials; reuses existing Terraform secrets.

## Analytics & KPIs
- Track MTTA/MTTR via incident timeline.
- Measure operator session counts per role, task completion rate, guardrail turnaround.
- Monitor module-level feature usage, error rates, and API retries.
- Collect satisfaction feedback (weekly Kaizen surveys) referencing module improvements.

## Non-Functional Requirements
- Availability ≥ 99.5% (internal SLO); graceful degradation if vendor API down (cache last known data, flag stale).
- Response times for dashboard queries ≤ 600 ms p95; search ≤ 1 s p95.
- Enforce rate limiting to respect vendor API quotas; use caching/TTL (60–180 s) where appropriate.
- Ensure audit logs immutable (append-only) with daily backups; align with compliance retention (1 year).
- Support localization scaffolding (initial launch English/Polish UI copy).

## Compliance & Access Control
- Enforce Auth0 MFA for all ops roles; map Auth0 roles to Supabase RLS policies and Next.js middleware.
- Log every privileged action and expose export to `sisu-log/` as needed.
- Respect GDPR: no unnecessary PII duplication; use redaction in UI for sensitive fields (partial emails, masked payment IDs).
- Provide least-privilege modules: finance-only features available to `ops_finance` subset; content actions to `ops_editor`.

## Launch Readiness Checklist
- Dashboard modules implemented with feature flags and QA’d with stakeholders (content, marketing, payments, support).
- Security review completed (Auth0 scopes, Supabase RLS, proxy audits).
- Runbook `docs/runbooks/ops-hub.md` published and operator training scheduled.
- Grafana panels embedded and tested; fallback messaging validated.
- Slack/email alert wiring verified; permission matrix documented.
- Lint/typecheck/validate tasks green; `npm run lint:tasks` updated after related tasks move.

## Open Questions & Assumptions
- Determine whether support ticketing (Linear/Zendesk) integration is read-only or bi-directional in MVP.
- Define future roadmap for automation (bulk refunds, guardrail creation) and multi-tenant scaling.
- Assume Plausible metrics available via API; confirm contract permissions.
