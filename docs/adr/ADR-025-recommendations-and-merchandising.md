# ADR-025: Recommendations & Merchandising Platform
Date: 2025-10-24
Status: Accepted

## Context
- The recommendations PRD (`docs/PRDs/requierments/recommendations/feature-requirements.md`) defines curated affiliate picks, dynamic bundles, and personalized suggestions across Clarivum surfaces.
- Recommendations must combine editorial curation (Strapi), behavior signals (PostHog), diagnostics outcomes, and affiliate tracking.
- Existing search ADR-009 covers Meilisearch but not the merchandising rules or affiliate compliance requirements.

## Decision
- Build a **Recommendations Service Layer** with three inputs:
  - **Curated collections** from Strapi (ADR-010) tagged by vertical, persona, and campaign.
  - **Behavioral signals** ingested from PostHog (ADR-008) and stored in Supabase for segmentation.
  - **Diagnostics outcomes** from ADR-021 to personalize content.
- Engine:
  - Run selection algorithms server-side (Next.js Route Handlers) using deterministic rules first; leave room for ML scoring later.
  - Provide fallback heuristics if personalization data missing (top sellers, editorial picks).
- Delivery:
  - Expose via GraphQL/REST endpoints consumed by frontend view models (ADR-019).
  - Cache rendered results at edge (ADR-006) with short TTL plus user-context revalidation.
- Affiliate & coupon integration:
  - Track outbound clicks and conversions; enrich with coupon availability (ADR-026).
  - Maintain compliance with partner policies (disclosure, UTM tagging).
- Observability:
  - Emit recommendation events (impression, click, convert) aligned with ADR-008.
  - Monitor zero-result rate via Search Operations Runbook.

## Diagrams
- [Architecture Overview](../diagrams/adr-025-recommendations-and-merchandising/architecture-overview.mmd) — Data sources feeding the recommendation engine, caching, and delivery endpoints.
- [Data Lineage](../diagrams/adr-025-recommendations-and-merchandising/data-lineage.mmd) — Collections, signals, outcomes, recommendations, and telemetry events.
- [UML Components](../diagrams/adr-025-recommendations-and-merchandising/uml-components.mmd) — Engine, repositories, signal aggregators, affiliate enrichers, and telemetry managers.
- [BPMN Serving Flow](../diagrams/adr-025-recommendations-and-merchandising/bpmn-serving.mmd) — Request handling, scoring, fallbacks, enrichment, and telemetry.

## Consequences
- **Benefits:** Unified merchandising logic, consistent personalization, easier experimentation.
- **Trade-offs:** Complexity increases as data sources grow; must guard against stale personalization.
- **Follow-ups:**
  - Define data contracts for diagnostics → recommendations feed.
  - Build experimentation hooks to test algorithms via Flagsmith (ADR-005).
  - Schedule quarterly affiliate compliance audits.
