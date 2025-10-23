# ADR-026: Coupons & Affiliate Incentives Platform
Date: 2025-10-24
Status: Accepted

## Context
- The coupons PRD (`docs/PRDs/requierments/coupons/feature-requirements.md`) outlines inbound affiliate codes, deal aggregation, and outbound tracking requirements.
- Coupons interact with recommendations (ADR-025), ecommerce flows (ADR-011), and analytics (ADR-008). We need a canonical platform to avoid duplication and ensure compliance.

## Decision
- Maintain coupon metadata in **Supabase** (ADR-001) with Strapi-managed editorial descriptions.
  - Schema includes partner IDs, expiration, vertical, localization, stacking rules.
  - Background jobs (ADR-003) expire or refresh deals nightly.
- API & delivery:
  - Provide server actions returning filtered coupon lists by persona, vertical, diagnostics outcome.
  - Expose copy-to-clipboard + outbound click handlers instrumented per ADR-008.
- Partner compliance:
  - Log clicks with required UTM/affiliate parameters.
  - Store disclosure copy per partner; enforce rendering per FTC guidelines.
- Integration points:
  - Recommendations engine (ADR-025) requests coupon overlays.
  - Subscriptions checkout applies valid codes through Stripe/PayU (ADR-011).
  - Feature flags (ADR-005) enable staged rollouts or partner exclusives.
- Observability:
  - Track success metrics (CTR, redemption) via PostHog and OpenTelemetry.
  - Alert on expiring high-value coupons via Slack automation.

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
