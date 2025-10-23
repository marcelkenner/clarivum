# ADR-008: Product Analytics Platform
Date: 2025-10-21
Status: Accepted

## Context
- Marketing and growth teams need near-real-time funnels (≤5 minutes lag) across Clarivum’s vertical experiences, diagnostics, and subscription flows.
- Engineering capacity is limited; self-hosting a full analytics stack would compete with roadmap delivery and observability maintenance.
- GDPR mandates EU data residency, consent management, right-to-forget workflows, and clear separation between aggregated insights and raw PII.
- Existing instrumentation plans (`docs/analytics_events.md`, analytics PRD) require cohesive SDK support across web clients, server actions, and background jobs.

## Decision
- Adopt **PostHog Cloud (EU residency)** as the primary product analytics platform.
  - Use the managed ingestion pipeline, dashboarding, anomaly alerts, and cohorting features instead of self-hosting.
  - Configure the project with IP anonymization, EU-only data routing, and organizational roles aligned to RBAC (Marketing: view, Analysts: export, Engineering: manage schema).
- Implement an instrumentation toolkit within `@clarivum/analytics`:
  - `BrowserEventClient` wrapping `posthog-js` with lazy loading, consent gating, and automatic attachment of feature flag metadata.
  - `ServerEventDispatcher` using the PostHog REST API for secure server-side events (lead enrichment, subscription changes).
  - Event schema registry that maps TypeScript types to the canonical dictionary in `docs/analytics_events.md`, enforcing compile-time safety.
- Enable warehouse sync using PostHog’s built-in destination to Supabase (nightly cadence) for long-term retention and finance reporting.
- Automate governance:
  - Capture schema changes via ADR change log updates.
  - Stream PostHog audit logs (project settings, dashboard edits) to Grafana Loki.
  - Integrate alerting with Slack for the >20% funnel drop detector.
- Embed privacy controls: respect Flagsmith-based consent flags, support user deletion via PostHog API hooks invoked from the GDPR portal.

## Consequences
- **Benefits:** Fully managed analytics reduces ops burden, keeps data in-region, and provides rapid iteration on funnels and cohorts.
- **Trade-offs:** Vendor lock-in and subscription cost; mitigate by exporting raw events to Supabase and maintaining schema parity.
- **Constraints:** Client bundle impact must stay under 10 ms; enforce through performance budgets and lazy loading.
- **Follow-ups:**
  - Produce implementation checklist in `docs/runbooks/analytics-qa.md` before first production release.
  - Evaluate experiment analysis overlap with Flagsmith once multivariate tests begin.
  - Reassess hosting if data volume exceeds PostHog Cloud tier limits or compliance needs change.
