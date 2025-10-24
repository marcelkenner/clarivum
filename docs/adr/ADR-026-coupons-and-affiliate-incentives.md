# ADR-026: Coupons & Affiliate Incentives Platform
Date: 2025-10-24
Status: Accepted

## Context
- The coupons PRD (`docs/PRDs/requierments/coupons/feature-requirements.md`) outlines inbound affiliate codes, deal aggregation, and outbound tracking requirements.
- Coupons interact with recommendations (ADR-025), ecommerce flows (ADR-011), and analytics (ADR-029). We need a canonical platform to avoid duplication and ensure compliance.

## Decision
- Maintain coupon metadata in **Supabase** (ADR-001) with Strapi-managed editorial descriptions.
  - Schema includes partner IDs, expiration, vertical, localization, stacking rules.
  - Background jobs (ADR-003) expire or refresh deals nightly.
- API & delivery:
  - Provide server actions returning filtered coupon lists by persona, vertical, diagnostics outcome.
  - Expose copy-to-clipboard + outbound click handlers instrumented per ADR-029.
- Partner compliance & telemetry:
  - Log every outbound click with required UTM/affiliate parameters and an immutable event ID stored in Supabase (`affiliate_click_events`), including timestamp, referrer context, campaign, and hashed user identifier (when consented).
  - Validate outbound URLs against approved partner allowlists; block or flag unexpected domains for review.
  - Run fraud detection rules (e.g., >3 clicks per session on same partner, geo mismatches) and alert the partnerships team via Slack + Kaizen issue automation.
  - Store disclosure copy per partner; enforce rendering per FTC guidelines.
- Integration points:
  - Recommendations engine (ADR-025) requests coupon overlays.
  - Subscriptions checkout applies valid codes through Stripe/PayU (ADR-011).
  - Feature flags (ADR-005) enable staged rollouts or partner exclusives.
- Observability:
  - Track success metrics (CTR, redemption, revenue-per-click) via Plausible Analytics, Supabase exports, and OpenTelemetry traces that tie click events to downstream conversions.
  - Alert on expiring high-value coupons and anomalous click behaviour (spikes/drops >20% vs 7-day baseline, suspected click inflation) via Slack automation and PagerDuty when thresholds breached.

## Diagrams
- [Architecture Overview](../diagrams/adr-026-coupons-and-affiliate-incentives/architecture-overview.mmd) — Coupon ingestion, storage, APIs, and consumer integrations.
- [Data Lineage](../diagrams/adr-026-coupons-and-affiliate-incentives/data-lineage.mmd) — Coupon metadata, click logs, redemptions, and alerts.
- [UML Components](../diagrams/adr-026-coupons-and-affiliate-incentives/uml-components.mmd) — Ingestion manager, repository, compliance, telemetry, and alert services.
- [BPMN Lifecycle](../diagrams/adr-026-coupons-and-affiliate-incentives/bpmn-lifecycle.mmd) — Coupon creation, publication, monitoring, and retirement workflow.

## Consequences
- **Benefits:** Centralized coupon governance, consistent partner tracking, easy integration into UI.
- **Trade-offs:** Requires ongoing data hygiene; dependencies on partner feeds.
- **Follow-ups:**
  - Automate feed ingestion where available; otherwise schedule manual reviews.
  - Document escalation paths for partner disputes.
  - Build QA checklist for new coupons ensuring analytics + legal copy present.
