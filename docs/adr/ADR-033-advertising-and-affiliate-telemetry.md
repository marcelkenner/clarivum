# ADR-033: Advertising & Affiliate Telemetry Platform
Date: 2025-10-27
Status: Proposed

## Context
- Clarivum monetizes content through affiliate recommendations (`docs/PRDs/requierments/recommendations/feature-requirements.md`), coupon programs (`docs/PRDs/requierments/coupons/feature-requirements.md`), and upcoming on-site ad placements across blogs and vertical hubs.
- Leadership requires auditable evidence of every outbound click, impression, and partner payout to avoid revenue leakage and resolve partner disputes.
- Existing analytics (ADR-029) covers Plausible event governance but lacks a dedicated pipeline for high-precision click and impression tracking, fraud detection, and reconciliation against partner statements.
- Ads and affiliate units must respect privacy rules (ADR-014) while still capturing enough signal for finance reconciliation and optimization.

## Decision
- Establish an **Outbound Monetization Telemetry** subsystem with the following components:
  - **Impression Service** (Edge function) records ad/affiliate impressions with de-identified session identifiers, consent state, placement metadata, and experiment flags. Stores events in Supabase (`monetization_impressions`) and emits Plausible goals when consented.
  - **Click Redirect Service** issues short-lived signed redirect URLs (`/go/<partner>/<slug>/<event-id>`) that log click metadata (timestamp, placement, partner, hashed user/session, source article) before forwarding to partner URLs. Enforce allowlists and per-partner throttling.
  - **Fraud Detection Worker** (background job) runs hourly to flag anomalies (CTR spikes, repetitive IPs, bot signatures) and publishes alerts to `#clarivum-partnerships`.
  - **Reconciliation Pipeline** exports daily aggregates (impressions, clicks, conversions, revenue) to Supabase analytics schemas for finance to cross-check partner statements; discrepancies raise Kaizen guardrail issues automatically.
  - **Dashboard Suite** in Plausible + Looker/Metabase providing CTR, RPM, revenue-per-session, and seasonal trend analysis segmented by vertical, partner, and placement.
- All monetization events adopt a shared schema (`MonetizationEvent`) with typed clients inside `@clarivum/analytics` to ensure compile-time validation and consent gating.
- Blog and recommendation modules must instrument both impressions and clicks; ads load lazily and only after consent but impressions are logged using IntersectionObserver thresholds to avoid inflated counts.
- Support offline-safe queues in the frontend so user actions taken during temporary network loss replay once connectivity resumes.

## Robustness & Guardrails
- Redirect service stores every event before HTTP redirect completes; failures return a branded fallback landing page instructing users to retry while logging the error for follow-up.
- All redirect endpoints enforce HMAC-signed parameters; tampering triggers a 400 response and security alert (ADR-028).
- Monetization events older than 5 minutes without a downstream redirect confirmation remain in `pending_forward` and trigger retries/alerts.
- Nightly reconciliation compares recorded clicks vs Plausible vs partner reports; mismatches >2% escalate to platform + finance within one business day.
- Synthetic monitors hit key placements hourly to confirm redirect availability and logging.

## Consequences
- **Benefits:** Provides audit-ready monetization data, deters fraud, and enables optimization for high-performing placements and partners.
- **Trade-offs:** Adds complexity (edge functions, background workers, reconciliation scripts) and demands consistent consent handling to remain compliant.
- **Follow-ups:**
  - Implement Supabase schema migrations for impressions, clicks, and reconciliation tables.
  - Update analytics event registry (ADR-029) with `AffiliateLinkClicked`, `AffiliateLinkRedirected`, `AdPlacementViewed`, `AdPlacementClicked`.
  - Extend runbooks for partnerships/ads to cover monitoring, dispute resolution, and fraud response.
  - Collaborate with finance to define import format for partner revenue statements.

## References
- `docs/PRDs/requierments/analytics/feature-requirements.md`
- `docs/PRDs/requierments/recommendations/feature-requirements.md`
- `docs/PRDs/requierments/coupons/feature-requirements.md`
- `docs/PRDs/requierments/blog-content/AGENTS.md`
- `docs/runbooks/analytics-qa.md`

## Diagrams
- [Architecture Overview](../diagrams/adr-033-advertising-and-affiliate-telemetry/architecture-overview.mmd)
- [Data Lineage](../diagrams/adr-033-advertising-and-affiliate-telemetry/data-lineage.mmd)
- [UML — Monetization Services](../diagrams/adr-033-advertising-and-affiliate-telemetry/uml-components.mmd)
- [Sequence — Click Redirect to Partner](../diagrams/adr-033-advertising-and-affiliate-telemetry/sequence-click-redirect.mmd)
- [BPMN — Daily Reconciliation Loop](../diagrams/adr-033-advertising-and-affiliate-telemetry/bpmn-reconciliation.mmd)
