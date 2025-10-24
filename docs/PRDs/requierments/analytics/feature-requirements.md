# Feature Requirements — Analytics & Insights

> **Canonical reference:** Implementation decisions, event schemas, and operational guardrails live in `docs/adr/ADR-029-plausible-analytics-platform.md`. This PRD captures product outcomes only—update the ADR whenever analytics behaviour changes.

## Objective
- Provide reliable instrumentation and reporting that reveal funnel performance for home, vertical hubs, tools, ebooks, and subscriptions.
- Deploy Plausible Analytics (sole provider) to validate product decisions outlined in `clarivum_brand.md` and `first_steps.md` without additional engineering work or additional vendors.

## Target Outcomes
- Business: increase ebook conversion rate (visits → lead magnet download → purchase), monitor affiliate click-through, measure subscription renewals.
- Experience: ensure analytics collection adds <10 ms overhead per page view and does not degrade Core Web Vitals; surface actionable dashboards to product and marketing within one business day of data collection.

## Primary Users & Segments
- Internal: product managers, marketing, growth analysts, founder team.
- Segmentation dimensions: vertical (`skin`, `fuel`, `habits`), visitor type (anonymous, lead, customer, subscriber), campaign source (organic, paid, partner).

## Experience Principles
- Follow privacy-by-design and communicate clearly about tracking at first touch.
- Default dashboards should mirror the sitemap hierarchy (home → vertical → category) for intuitive navigation.
- Keep instrumentation composable so new tools or ebooks can inherit baseline events automatically.

## Functional Requirements
- FR1 — Capture page view, scroll depth, CTA interactions, email sign-ups, tool launches, ebook downloads/purchases, coupon clicks, affiliate link clicks, ad impressions/clicks, and subscription events with consistent event schemas. The canonical event definitions and property lists reside in ADR-029.
- FR2 — Provide dashboard modules for funnels: home → vertical hub → CTA; blog category → tool; ebook detail → checkout; coupon list → outbound click; blog article → affiliate/ad engagement.
- FR3 — Support cohorting by acquisition channel, persona quiz outcome, and vertical preference gathered through diagnostics.
- FR4 — Expose daily anomaly detection (e.g., >20% drop in conversions, >2% discrepancy between partner-reported revenue and internal click logs) via automated alerts to Slack/email.
- FR5 — Allow exporting aggregated data (CSV/JSON) while masking PII unless user has Data Analyst role.
- FR6 — Maintain instrumentation version history and change logs tied to ADRs when schemas change.

## Content & Data Inputs
- Page metadata and taxonomy from Strapi (vertical, category, CTA mapping).
- User status from auth/profile service (lead vs customer vs subscriber).
- Campaign UTM parameters, Flagsmith feature flag states, consent preferences.

## Integrations & Dependencies
- Internal: Next.js frontend event dispatcher, profile service for user IDs, subscription manager for lifecycle events.
- External: Plausible Analytics (managed EU cloud, proxied through Vercel), optional BigQuery or warehouse export for long-term storage via Plausible API.

## Analytics & KPIs
- KPIs: ebook lead conversion %, tool completion rate, newsletter sign-up rate per vertical, subscription activation and retention, coupon CTR, diagnostic completion.
- Monetization KPIs: affiliate click-through rate, revenue per thousand impressions (RPM) for ad placements, partner revenue gap %, fraudulent click detection rate.
- Instrumentation checklist: verify event payloads in the dev environment, ensure consent flags attached, publish dictionary in shared analytics repo.
- Plausible dashboards (must-have, align with ADR-029):
  - **Acquisition & Homepage Funnel:** monitor diagnostic starts, tool launches, and engagement speed (<20 s) segmented by campaign and pillar.
  - **Diagnostics Performance:** track completion rates, drop-off steps, and experiment variants for each quiz.
  - **Tools Adoption:** measure launches/completions per tool slug with consent-aware filtering and retention splits.
  - **Ebook & Lead Magnet Revenue:** connect downloads, CRM handoff, and revenue extension metrics per offer.
  - **Subscription & Checkout Health:** expose checkout step conversions, payment outcomes, and provider/device variance.
  - **Retention & Engagement Roll-up:** surface returning-visitor behavior, sessions per user, and cohort comparisons using Supabase exports.
  - **Consent & Compliance:** reconcile analytics opt-ins, script loads, and Flagsmith consent traits to keep leakage under 0.5%.
  - **Monetization & Affiliate Integrity:** monitor impressions, clicks, RPM, partner revenue variance, and fraud flags across affiliate links and ad placements.

## Non-Functional Requirements
- Client bundles must lazy-load analytics to preserve LCP ≤ 2.5 s (per `first_steps.md` web performance guardrails).
- Data ingestion SLO: 99% of events available in dashboards ≤ 5 minutes after occurrence.
- Ensure resilience with retry/backoff strategies and offline queue for client events.

## Compliance & Access Control
- Respect GDPR/CCPA: honor opt-out, support data deletion within 30 days, and anonymize IPs by default.
- Role-based access: marketing can view aggregated data, analysts can export, engineering can manage schema.

## Launch Readiness Checklist
- Consent banner live with analytics-specific callouts.
- Event tracking plans reviewed with marketing; QA in the dev environment validates payloads and Plausible ingestion.
- Dashboards seeded with baseline visualizations and shared with stakeholders.
- Incident playbook documented for data gaps or Plausible outages (see `docs/runbooks/analytics-qa.md` for QA and triage steps).

## Open Questions & Assumptions
- Need confirmation on Plausible revenue reporting requirements (script extensions vs server API) and associated budget.
- Determine data warehouse integration cadence (real-time sync vs nightly export) for finance reporting.
- Assume diagnostics outcomes will feed segmentation tags; requires API contract confirmation.
