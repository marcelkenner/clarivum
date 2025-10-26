# ADR-035: Affiliate Catalog & Offer Management
Date: 2025-10-27  
Status: Proposed

## Context
- Affiliate funnels now span tools, glossary entries, recommendations, and trust pages. Individual teams manually paste partner links into copy, making disclosure, rotation, and telemetry brittle.
- ADR-026 governs coupon data, and ADR-033 defines monetization telemetry, but we lack a canonical service for affiliate offers, disclosures, payout metadata, and link templates.
- Upcoming glossary work plus the affiliate-first tools (Analiza Etykiety, Smart Zamienniki, Checklista Sypialni, Ocena Ergonomii) need a single source of truth to fetch product cards, signed URLs, and status flags.

## Decision
- **Affiliate Catalog Service (ACS):**
  - Store partner programs, offers, creatives, and disclosure copy in Supabase tables (`affiliate_programs`, `affiliate_offers`, `affiliate_assets`, `affiliate_disclosure_profiles`).
  - Manage editorial metadata through Strapi components so content teams can select offers by taxonomy (vertical, ingredient, tool, glossary term) without editing code.
  - Keep offer state machine (`draft → approved → live → sunset`) with auditing and ownership metadata.
- **APIs & SDK:**
  - Ship a typed SDK (`@clarivum/affiliate`) consumed by Next.js server components, the tools blueprint packages, glossary pages, and Ops Hub. The SDK resolves offers by slug/tag, returns disclosure text, and issues signed redirect URLs using ACS link templates.
  - Provide `/api/affiliates/v1/offers` endpoints (read-only for web app) and `/api/affiliates/v1/manage` (admin) protected through Auth0 RBAC.
- **Link governance:**
  - Generate short links (`/go/<partner>/<offer>/<eventId>`) that wrap partner URLs with ACS-managed parameters before delegating to the existing redirect handler defined in ADR-033.
  - Expose a “kill switch” per partner/offer that immediately disables links across all consumers (tools, glossary, recommendations) by toggling the ACS state.
- **Glossary & tool integration:**
  - Glossary entries reference ACS offers through Strapi relations; updates propagate automatically to ingredient pages, comparison tables, and trust disclosures.
  - Tools blueprint CTA regions default to ACS-driven offers; they fall back to editorial copy when no active offer matches.
- **Operations & automation:**
  - Scheduled jobs validate offer freshness (price/stock cached from partner feeds), rotate utm parameters, and sync payout results back into ACS for finance review.
  - Observability hooks push ACS events to ADR-033 telemetry streams so finance can reconcile clicks vs payouts.

## Consequences
- **Benefits:** Centralized affiliate data removes duplicate partner management, enforces disclosures, and unlocks experiments (offer rotation, A/B tests) without code deploys.
- **Trade-offs:** Requires upfront schema, migration tooling, and admin UI work; all affiliate-consuming features depend on ACS availability.
- **Follow-ups:**
  1. Build the ACS Supabase schema, Strapi components, management APIs, and SDK (TSK-PLAT-046).
  2. Define affiliate operations workflow + runbook updates (TSK-SHARED-010).
  3. Extend ADR-033 diagram set with ACS integration and update monetization telemetry dashboards.

## References
- ADR-026 Coupons & Affiliate Incentives Platform.
- ADR-033 Advertising & Affiliate Telemetry.
- PRD: `docs/PRDs/requierments/affiliate/feature-requirements.md` (companion spec).

## Diagrams
- Architecture: [architecture-overview.mmd](../diagrams/adr-035-affiliate-catalog-and-offer-management/architecture-overview.mmd)
- Data: [data-model.mmd](../diagrams/adr-035-affiliate-catalog-and-offer-management/data-model.mmd)
- UML: [uml-sequence.mmd](../diagrams/adr-035-affiliate-catalog-and-offer-management/uml-sequence.mmd)
- BPMN: [bpmn-operations.mmd](../diagrams/adr-035-affiliate-catalog-and-offer-management/bpmn-operations.mmd)
