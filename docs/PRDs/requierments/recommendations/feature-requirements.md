# Feature Requirements — Recommendations & Affiliate Picks

> **Canonical decision:** `docs/adr/ADR-025-recommendations-and-merchandising.md` defines the merchandising and personalization architecture.

## Objective
- Deliver curated recommendation hubs (`/polecenia/` + vertical-specific pages) that guide users toward trusted products and services aligned with Clarivum’s brand pillars.
- Generate affiliate revenue while maintaining editorial integrity and transparency.

## Target Outcomes
- Business: increase outbound click-through and affiliate conversions without eroding trust.
- Experience: help users understand why each recommendation matters and how it supports their routines or goals.

## Primary Users & Segments
- Visitors seeking reliable product suggestions for skincare, nutrition, or habit support.
- Segmentation: vertical interest, problem area (e.g., SPF, supplements), diagnostic outcomes, budget sensitivity.

## Experience Principles
- Lead with clarity: explain selection criteria, testing methodology, and disclosure.
- Align visuals and content with design system (tile cards, iconography).
- Provide actionable context (when to use, how to integrate with other Clarivum resources).

## Functional Requirements
- FR1 — Global recommendations hub with filters for vertical, product category, price range, availability (PL vs international).
- FR2 — Detailed recommendation pages (e.g., `/skin/polecenia/najlepsze-kremy-spf/`) including top picks, pros/cons, usage tips, CTA to related tools/ebooks, affiliate links.
- FR3 — Badge system for Clarivum favorites, dermatologist-approved, subscriber-only picks.
- FR4 — Support comparison tables, ingredient highlights, and caution notes (non-medical disclaimers).
- FR5 — Integrate analytics tracking for impressions, outbound clicks, click-through rates, and downstream conversions using the monetization telemetry platform (ADR-033); log immutable events before redirecting users.
- FR6 — Add fraud safeguards: rate-limit repeat clicks, monitor geo/IP anomalies, and surface alerts/dashboards for partner negotiations.
- FR7 — Handle inventory updates (out of stock, discontinued) via CMS flags and automated checks.

## Content & Data Inputs
- Product entries in Strapi with metadata: brand, product name, category, SKU/links, pricing, availability, highlights, cautionary notes, imagery, affiliate parameters.
- Testing methodology statements and editorial guidelines from brand team.
- Coupons integration for cross-promotion of relevant deals.

## Integrations & Dependencies
- Internal: component library, analytics, coupons, newsletter, profile (for subscriber-only content).
- External: affiliate networks, partner feeds, price tracking APIs (optional future integration).

## Analytics & KPIs
- Outbound CTR per product, revenue attribution, time on recommendations pages, bounce rate, newsletter signups triggered.
- Track editorial freshness (last review date) and mark items for re-validation.

## Non-Functional Requirements
- Pages should be statically generated with revalidation on content updates.
- Keep load times ≤ 2 s with optimized images and lazy-loaded comparison tables.
- Ensure accessible tables and carousels; maintain WCAG 2.2 AA compliance.

## Compliance & Access Control
- Display affiliate disclosures clearly (FTC compliance) and maintain change history.
- Provide non-medical disclaimers referencing legal content.
- Editorial roles: product team can curate, legal approves disclaimers, partners team manages affiliate parameters.

## Launch Readiness Checklist
- Editorial QA and legal sign-off on initial recommendation sets.
- Analytics verified for outbound links.
- Inventory monitoring process established (manual checklist or automated script).
- Support documentation prepared for customer inquiries about recommendations.

## Open Questions & Assumptions
- Determine cadence for re-review (quarterly vs monthly) and responsible roles.
- Clarify whether user reviews/comments will be supported in future.
- Assume affiliate data returns via manual reports initially; automation backlog item.
