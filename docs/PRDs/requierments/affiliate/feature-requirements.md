# Feature Requirements — Affiliate Catalog & Operations

> **Canonical references:** ADR-035 (Affiliate Catalog & Offer Management), ADR-026 (Coupons & Affiliate Incentives), ADR-033 (Advertising & Affiliate Telemetry), ADR-010 (Content Platform), ADR-022 (Tools Platform).
>
> Related ADR files:
> - `docs/adr/ADR-035-affiliate-catalog-and-offer-management.md`
> - `docs/adr/ADR-026-coupons-and-affiliate-incentives.md`
> - `docs/adr/ADR-033-advertising-and-affiliate-telemetry.md`

## Objective
- Provide a single system for creating, approving, rotating, and measuring affiliate offers across tools, glossary entries, trust pages, and recommendations.
- Enable non-engineering teams to manage partner relationships, disclosures, and creative assets without touching code while preserving telemetry integrity.

## Target Outcomes
- Business: increase affiliate revenue per session by 20% while reducing broken/stale links to <1% of daily clicks.
- Operational: cut partner change lead time from days to minutes via centralized editing and kill switches.
- Compliance: 100% of affiliate placements automatically render the correct FTC disclosure text and link to `/jak-zarabiamy/`.

## Scope
- Affiliate Catalog Service (ACS) data model, admin workflows, and APIs.
- SDK/consumption patterns for tools, glossary, recommendations, coupons, and Ops Hub dashboards.
- Automation for validation, payout reconciliation, and alerting.
- Excludes coupon redemption logic (remains in ADR-026) and paid media inventory.

## Personas
- **Partner Ops Lead:** manages contracts, payouts, and offer metadata.
- **Content/Glossary Editors:** attach offers to glossary entries, articles, or tools through Strapi.
- **Engineers:** consume offers via SDK; rely on ACS for disclosures and signed URLs.
- **Finance Analyst:** reviews payouts vs click telemetry via Ops Hub.

## Functional Requirements
1. **Catalog Management**
   - CRUD for partner programs (name, regions, payout terms, contact, status).
   - Offers with SKU, description, availability dates, target verticals, CTA copy, disclosure profile, and associated glossary/tool tags.
   - Asset storage (images, badges) linked by offer.
   - Version history with approvals (draft → review → live → sunset).
2. **Link Generation**
   - Template-based parameterization per partner (utm, subId, creative codes).
   - Short link service entry (`/go/<partner>/<offer>/<eventId>`) plus deep-link builder for external campaigns.
   - Kill switch toggles (per partner or offer) propagate within 60 seconds to all consumers.
3. **Integrations**
   - GraphQL/REST or RPC endpoints for:
     - Glossary & Strapi: query offers by taxonomy, fallback to editorial copy.
     - Tools blueprint SDK: fetch offers for CTA slots, receive disclosure text + telemetry payload.
     - Recommendations/coupons: show stacked incentives (coupon + affiliate).
     - Ops Hub: surface partner health, payout status, alerts.
4. **Telemetry & Reconciliation**
   - Every link request returns a telemetry context (offer id, program id, disclosure id) consumed by ADR-033 instrumentation.
   - Scheduled job imports partner payout CSVs, matches against click events, and raises discrepancies (>5% variance) to finance.
5. **Automation & QA**
   - Nightly freshness check verifying offer URLs return 2xx and product availability; failed checks auto-open Kaizen guardrail issues.
   - SLA monitors for upcoming offer expirations (<7 days) posting to `#clarivum-partners`.
6. **Glossary Enhancements**
   - Ingredient glossary entries display related offers when ACS marks them as relevant, including fallback educational copy if user declines cookies.
   - Editors can bulk update associations from a glossary admin view (Strapi plugin) hitting ACS APIs.

## Non-Functional Requirements
- Latency: catalog read API ≤150 ms (P95) within EU region.
- Availability: ≥99.5% monthly uptime for read endpoints; degrade gracefully with cached offers inside Next.js edge caches.
- Security: Auth0 RBAC for management endpoints, row-level security in Supabase, audit logs for every change (stored ≥13 months).
- Privacy: tie user-level tracking only when consent is granted; otherwise use session-level event IDs per ADR-033.

## Data Model (High-level)
- `affiliate_programs`: id, name, status, region, payout_terms, contact, disclosure_profile_id.
- `affiliate_offers`: id, program_id, slug, title, description, vertical, tags[], start_at, end_at, priority, url_template_id, disclosure_profile_id, status.
- `affiliate_assets`: offer_id, asset_type (image, badge, pdf), cdn_url, locale.
- `affiliate_taxonomy_links`: offer_id, taxonomy_type (`glossary_term`, `tool_slug`, `article_slug`), taxonomy_id.
- `affiliate_disclosure_profiles`: id, locale, short_copy, long_copy, url.

## Admin Workflow
1. Partner Ops creates/updates offer in Strapi (writes to Supabase via webhook).
2. Reviewer approves; offer transitions to `live`, ACS notifies relevant channels.
3. Tools/glossary automatically pick up new offer (via cached queries or on-demand fetch), and instrumentation begins emitting events.
4. When partner changes terms, Ops toggles kill switch or edits template; change propagates immediately.

## Analytics & KPIs
- CTR, RPM, payout variance by partner/vertical.
- Kill switch usage stats, stale link incidents, freshness check pass rate.
- Glossary-to-offer conversion rate (views → clicks → revenue).

## Dependencies
- Supabase (storage, functions).
- Strapi (editor UI) + its plugin system for catalog forms.
- Feature flags (ADR-005) for rolling out ACS consumption per surface.
- Ops Hub (ADR-031) for dashboards.

## Rollout Phases
1. **Foundation:** schema, APIs, SDK, Strapi admin, manual ingestion.
2. **Integration:** migrate affiliate-first tools + glossary to ACS, enable kill switch.
3. **Automation:** add freshness monitoring, payout reconciliation, Ops Hub panels.
4. **Expansion:** allow third-party feeds/importers, experimentation hooks (multi-offer rotation).

## Open Questions
- Do we need partner portal access for co-op campaigns? (defer)
- Should ACS support automatic price crawling? (phase 4)
- Ownership of glossary tagging workflow: Content vs Partner Ops?
