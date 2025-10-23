# ADR-029: Plausible Analytics Platform
Date: 2025-10-28
Status: Accepted
Supersedes: ADR-008-product-analytics-platform.md

## Context
- Product scope is anchored in `docs/PRDs/requierments/analytics/feature-requirements.md`; keep PRD and ADR aligned as instrumentation evolves.
- Leadership mandated a privacy-first analytics strategy with zero tolerance for GA4, Google Tag Manager, Segment, or any alternative vendors.
- Marketing and product teams still require near-real-time funnel visibility (≤5 minutes lag) across homepage, diagnostics, tools, ecommerce, and lifecycle flows.
- The prior PostHog decision (ADR-008) introduced vendor lock-in concerns and heavier SDK overhead than desired for Core Web Vitals budgets.
- GDPR enforcement, cookie consent rules (ADR-014), and security policies (ADR-028) demand EU residency, first-party script delivery, IP anonymization, and auditable deletion hooks.
- Existing runbooks (`docs/runbooks/analytics-qa.md`, `docs/runbooks/cookie-consent-operations.md`, `docs/runbooks/secrets-management.md`) expect a single analytics provider with typed event schemas and deterministic governance.

## Decision
- Adopt **Plausible Analytics (EU-managed)** as the sole analytics platform.
  - Serve the Plausible script through a Vercel proxy (`/analytics/js/script.js`) to keep requests first-party, reinforce consent gating, and avoid ad-blocker heuristics.
  - Enforce IP anonymization, EU data residency, custom domain delivery, and API keys stored in AWS Secrets Manager per ADR-007.
  - Disable all Plausible integrations that reintroduce third-party trackers; only the revenue extension is allowed, proxied through the same domain.
- Build an instrumentation toolkit inside `@clarivum/analytics` with dedicated object-oriented components:
  - **`PlausibleScriptManager`** — Injects the proxied script after consent, ensures single attachment, and exposes hooks for view models; depends on an injected `ConsentEvaluator` interface for testability.
  - **`PlausibleEventDispatcher`** — Server-side class wrapping Plausible’s event API (`/api/event`). Handles retries, consent assertions, and structured logging; accepts an `HttpClient` dependency for mocking.
  - **`AnalyticsEventRegistry`** — Central catalogue mapping TypeScript event types to Plausible payloads; validates property schemas at compile time and during CI (`npm run analytics:schema-validate`).
  - **`AnalyticsConsentGuard`** — Coordinator ensuring script loading, client-side queues, and server dispatch all honor Flagsmith traits established in ADR-014.
- Governance & tooling:
  - Maintain the canonical event catalogue within this ADR; every schema change must update the table and the registry types.
  - Run `npm run analytics:proxy-audit` to confirm the Vercel rewrites point exclusively to Plausible endpoints.
  - Stream Plausible audit logs (project settings, API key usage) to Grafana Loki for traceability.
- Data residency & retention:
  - Configure Plausible retention to 18 months; export nightly aggregates to Supabase for long-term storage and finance reconciliation.
  - Implement a GDPR deletion worker invoking Plausible’s API whenever users trigger the privacy portal workflow.

## Diagrams
- [Architecture Overview](../diagrams/adr-029-plausible-analytics-platform/architecture-overview.mmd) — Event producers, Plausible proxy endpoints, and warehouse sync path.
- [Data Lineage](../diagrams/adr-029-plausible-analytics-platform/data-lineage.mmd) — Event schema, consent flags, Plausible ingestion, Supabase export.
- [UML Instrumentation Toolkit](../diagrams/adr-029-plausible-analytics-platform/uml-instrumentation.mmd) — Managers, dispatchers, registries, and consent guards.
- [BPMN Governance Flow](../diagrams/adr-029-plausible-analytics-platform/bpmn-governance.mmd) — Schema change review, QA validation, and rollback handling.

## Event Catalogue (Canonical)
Update this table whenever instrumentation changes. Any new event must include responsible owner, consent category, and QA plan.

### Conventions
- **Naming:** `ContextActionOutcome` (e.g., `SkinEbookDownloadStarted`).
- **Context fields:** Always attach `vertical`, `pillar_category`, `cta_variant`.
- **Identifiers:** No raw PII; use hashed member IDs and Flagsmith cohort tags.
- **Experiments:** Provide `flag_key` and `flag_variant` for any flag-governed event.

| Event key                  | Trigger                                           | Required properties                                                          | Destination             |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------- |
| `SkinEbookDownloadStarted` | User clicks primary CTA on `/skin/*` pages        | `vertical`, `pillar_category`, `cta_variant`, `lead_source`                  | Plausible               |
| `FuelToolLaunched`         | Tool modal/form opens under `/fuel/*`             | `vertical`, `tool_slug`, `cta_variant`, `session_region`, `flag_variant`     | Plausible               |
| `HabitsQuizCompleted`      | Diagnostics flow completes on `/habits/diagnose` | `vertical`, `result_segment`, `time_to_complete`, `question_version`, `ab_test` | Plausible               |
| `LeadSubmitSucceeded`      | Supabase lead insert + CRM handoff succeeds       | `vertical`, `offer_slug`, `form_variant`, `flagsmith_flag`, `crm_destination` | Plausible               |
| `PreviewDeploymentViewed`  | Internal QA opens preview URL                     | `branch_name`, `vercel_url`, `build_id`, `feature_flags_enabled`             | Plausible               |

### Maintenance checklist
- Review the catalogue during sprint planning with analytics and product; log changes in `docs/runbooks/analytics-qa.md`.
- Update dashboards and anomaly detectors whenever an event schema shifts.
- Validate instrumentation through Playwright smoke suites and manual Plausible debug sessions before release.

## Mandatory Plausible Dashboards
Create and maintain the following dashboards (or saved reports) inside Plausible. Each dashboard must include the listed primary metrics, filters, and alert hooks so product, marketing, and leadership share a single source of truth.

| Dashboard | Primary question | Required metrics & goals | Segmentation & filters | Alerting expectations |
| --------- | ---------------- | ------------------------ | ---------------------- | --------------------- |
| **Acquisition & Homepage Funnel** | Are we converting homepage traffic into diagnostic starts and tool launches within 20 s? | Pageviews, bounce rate, `diag_start`, `tool_card_click`, `newsletter_submit`; custom goal for `<20 s` engagement | Segment by `utm_source`, `pillar_category`, `cta_variant`, device type | Notify Slack `#clarivum-insights` on >20% drop in diagnostic starts or tool clicks day-over-day |
| **Diagnostics Performance** | Which diagnostics complete, where are users dropping? | `HabitsQuizCompleted`, intermediate step events (e.g., `diag_select_goal`), completion rate, median completion time | Filter by `vertical`, `result_segment`, experiment (`flag_variant`) | Alert on completion rate falling below 70% for any vertical |
| **Tools Adoption** | Which calculators/planners drive repeat usage? | `FuelToolLaunched`, tool-specific completion events, returning vs new visitors, average tool per session | Segment by `tool_slug`, `session_region`, consent status (`marketing_consent`) | Weekly anomaly report when any high-priority tool drops >15% usage |
| **Ebook & Lead Magnet Revenue** | Are ebooks generating leads and revenue as planned? | `SkinEbookDownloadStarted`, `LeadSubmitSucceeded`, revenue (Plausible revenue extension), conversion rate from visit → download → purchase | Filter by `offer_slug`, campaign (`utm_campaign`), `crm_destination` | Alert when revenue or lead volume deviates ±20% from 7-day mean |
| **Subscription & Checkout Health** | Is subscription checkout healthy across steps? | Checkout step events, `LeadSubmitSucceeded` (with `offer_slug` subscriptions), payment success/failure goals | Segment by payment provider, device, feature flag (`flag_variant`) | Real-time notification on spike in failures (>5 per 10 min) |
| **Retention & Engagement Roll-up** | How often do returning members engage tools/content? | Returning visitors %, average sessions per user, key event sequences, daily active metrics from Supabase export (merged via custom dimensions) | Filter by cohort (Flagsmith traits), subscription status | Monthly review; no automated alert unless DAU drops >10% WoW |
| **Consent & Compliance** | Are consent states respected and consistent? | `analytics_opt_in` goal, event counts gated vs ungated, script load events from `PlausibleScriptManager`, comparison against Flagsmith traits | Filter by locale, consent status, device | Alert on any increase in ungated events (>0.5% of total) |

Dashboards must be shared with view-only permissions for marketing/product, embedded into the internal Notion workspace, and referenced in the analytics QA checklist. Update dashboard configurations whenever event properties or consent rules change.

## Consequences
- **Benefits:** Lightweight, privacy-first analytics with first-party delivery, minimal bundle impact, and streamlined governance.
- **Trade-offs:** Plausible lacks advanced cohorting; supplement with Supabase exports and Looker Studio only if it does not introduce other analytics vendors.
- **Constraints:** Every feature must reuse `@clarivum/analytics` components—no ad-hoc script injection or third-party tags.
- **Follow-ups:**
  - Deliver Vercel rewrite templates and proxy monitoring for Plausible endpoints.
  - Add revenue attribution events once checkout flows go live; update this ADR accordingly.
  - Document migration steps for existing PostHog dashboards so stakeholders reference Plausible equivalents.
