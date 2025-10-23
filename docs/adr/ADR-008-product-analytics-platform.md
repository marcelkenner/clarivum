# ADR-008: Product Analytics Platform
Date: 2025-10-21
Status: Superseded by ADR-029

> ⚠️ **Superseded:** This ADR captured the former PostHog Cloud strategy. See `docs/adr/ADR-029-plausible-analytics-platform.md` for the current Plausible Analytics decision. Retain this document for historical context only.

## Context
- Marketing and growth teams need near-real-time funnels (≤5 minutes lag) across Clarivum’s vertical experiences, diagnostics, and subscription flows.
- Engineering capacity is limited; self-hosting a full analytics stack would compete with roadmap delivery and observability maintenance.
- GDPR mandates EU data residency, consent management, right-to-forget workflows, and clear separation between aggregated insights and raw PII.
- Existing instrumentation plans (analytics PRD plus the former event catalogue) require cohesive SDK support across web clients, server actions, and background jobs.
- Product analytics expectations are detailed in `docs/PRDs/requierments/analytics/feature-requirements.md`.

## Decision
- Adopt **PostHog Cloud (EU residency)** as the primary product analytics platform.
  - Use the managed ingestion pipeline, dashboarding, anomaly alerts, and cohorting features instead of self-hosting.
  - Configure the project with IP anonymization, EU-only data routing, and organizational roles aligned to RBAC (Marketing: view, Analysts: export, Engineering: manage schema).
- Implement an instrumentation toolkit within `@clarivum/analytics`:
  - `BrowserEventClient` wrapping `posthog-js` with lazy loading, consent gating, and automatic attachment of feature flag metadata.
  - `ServerEventDispatcher` using the PostHog REST API for secure server-side events (lead enrichment, subscription changes).
- Event schema registry that maps TypeScript types to the canonical dictionary maintained in this ADR, enforcing compile-time safety.
- Enable warehouse sync using PostHog’s built-in destination to Supabase (nightly cadence) for long-term retention and finance reporting.
- Automate governance:
  - Capture schema changes via ADR change log updates.
  - Stream PostHog audit logs (project settings, dashboard edits) to Grafana Loki.
  - Integrate alerting with Slack for the >20% funnel drop detector.
- Embed privacy controls: respect Flagsmith-based consent flags, support user deletion via PostHog API hooks invoked from the GDPR portal.

## Diagrams
- [Architecture Overview](../diagrams/adr-008-product-analytics-platform/architecture-overview.mmd) — Event producers, PostHog ingestion, and Supabase warehouse sync.
- [Data Lineage](../diagrams/adr-008-product-analytics-platform/data-lineage.mmd) — Event schema, properties, cohorts, and warehouse facts.
- [UML Instrumentation Toolkit](../diagrams/adr-008-product-analytics-platform/uml-instrumentation.mmd) — Clients and registries enforcing consent and type safety.
- [BPMN Governance Flow](../diagrams/adr-008-product-analytics-platform/bpmn-governance.mmd) — Schema change review, rollout, and regression response.

## Event Catalogue (Canonical)
This appendix replaces `docs/analytics_events.md`. Update this table whenever instrumentation changes and reference it from implementation PRs.

### Conventions
- **Naming:** Follow the `ContextActionOutcome` pattern (e.g., `SkinEbookDownloadStarted`).
- **Context fields:** Always attach `vertical`, `pillar_category`, and `cta_variant`.
- **Identifiers:** Never include PII; use hashed member IDs and Flagsmith cohort tags.
- **Experiments:** Flag-gated experiments must include `flag_key` and `flag_variant`.

### Event inventory

| Event key                  | Trigger                                           | Required properties                                                          | Destination             |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------- |
| `SkinEbookDownloadStarted` | User clicks primary CTA on `/skin/*` pages        | `vertical`, `pillar_category`, `cta_variant`, `lead_source`                  | PostHog                 |
| `FuelToolLaunched`         | Tool modal/form opens under `/fuel/*`             | `vertical`, `tool_slug`, `cta_variant`, `session_region`, `flag_variant`     | PostHog                 |
| `HabitsQuizCompleted`      | Diagnostics flow completes on `/habits/diagnose` | `vertical`, `result_segment`, `time_to_complete`, `question_version`, `ab_test` | PostHog                 |
| `LeadSubmitSucceeded`      | Supabase lead insert + CRM handoff succeeds       | `vertical`, `offer_slug`, `form_variant`, `flagsmith_flag`, `crm_destination` | Supabase → PostHog sync |
| `PreviewDeploymentViewed`  | Internal QA opens preview URL                     | `branch_name`, `vercel_url`, `build_id`, `feature_flags_enabled`             | PostHog                 |

### Maintenance checklist
- Review the catalogue with analytics and product during each sprint planning.
- Update this ADR before shipping new funnels; reference the related task in the Notes section.
- Regenerate dashboard mappings when events change (PostHog insights + Supabase syncs).
- Validate instrumentation via Playwright smoke flows when adding events.

## Consequences
- **Benefits:** Fully managed analytics reduces ops burden, keeps data in-region, and provides rapid iteration on funnels and cohorts.
- **Trade-offs:** Vendor lock-in and subscription cost; mitigate by exporting raw events to Supabase and maintaining schema parity.
- **Constraints:** Client bundle impact must stay under 10 ms; enforce through performance budgets and lazy loading.
- **Follow-ups:**
  - Produce implementation checklist in `docs/runbooks/analytics-qa.md` before first production release.
  - Evaluate experiment analysis overlap with Flagsmith once multivariate tests begin.
  - Reassess hosting if data volume exceeds PostHog Cloud tier limits or compliance needs change.
