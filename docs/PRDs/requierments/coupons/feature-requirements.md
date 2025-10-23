# Feature Requirements — Coupons & Deals Hub

> **Canonical decision:** `docs/adr/ADR-026-coupons-and-affiliate-incentives.md` governs coupon ingestion, tracking, and compliance.

## Objective
- Centralize all partner discounts, launch offers, and bundles under `/kody-rabatowe/` while reinforcing trust with transparent disclosures.
- Support cross-vertical filtering so visitors quickly locate relevant deals for Skin, Fuel, or Habits.

## Target Outcomes
- Business: drive affiliate revenue and subscription upgrades through targeted coupon redemption.
- Experience: enable visitors to find an applicable deal within two interactions and understand redemption steps without confusion.

## Primary Users & Segments
- Visitors seeking discounts on recommended products, ebooks, or subscriptions.
- Segmentation: by vertical, offer type (product, ebook, service), audience stage (lead, customer, subscriber).

## Experience Principles
- Surface value first (savings, exclusivity) while keeping CTA actions consistent with brand CTAs.
- Always pair coupon information with trust cues (expiration, limitations, legal disclosures).
- Maintain parity between coupon cards and recommendation pages to reinforce brand coherence.

## Functional Requirements
- FR1 — Provide filterable coupon index with facets for vertical, offer category, partner brand, expiration window, and format (code vs auto-applied).
- FR2 — Support detail pages or modals outlining redemption instructions, eligibility, and tracking parameters.
- FR3 — Integrate affiliate links with analytics tagging to measure click-through and conversions.
- FR4 — Display status badges (new, expiring soon, exclusive) driven by metadata from Strapi.
- FR5 — Allow gated coupons for subscribers with login checks and fallback messaging for anonymous users.
- FR6 — Handle expired offers gracefully via archive view and automated removal from active listings.

## Content & Data Inputs
- Coupon entries managed in Strapi with fields: title, description, partner, vertical tags, code, discount details, start/end time, disclosure copy, asset references.
- Redemption URLs and tracking parameters supplied by partnerships team.
- Flag for subscription-only offers sourced from subscription manager.

## Integrations & Dependencies
- Internal: Recommendations hub for cross-linking, analytics for tracking, login/profile service for gated offers.
- External: Affiliate platforms or partner landing pages; optional integration with Flagsmith to toggle offer visibility.

## Analytics & KPIs
- Coupon CTR, redemption rate (if partner returns data), revenue attributed per coupon, subscriber uplift from gated deals.
- Monitor link integrity; alert when partner URLs respond with errors.

## Non-Functional Requirements
- Page load with coupons must stay within performance budgets (LCP ≤ 2.5 s) even with dynamic filters; use incremental static regeneration or caching.
- Ensure offers respect accessibility guidelines (e.g., discount text not color-only).
- Keep uptime aligned with marketing campaigns; SLO 99.5% monthly for coupon API.

## Compliance & Access Control
- Display FTC-compliant affiliate disclosures and terms; ensure copy is editable but always present.
- Access roles: marketing can edit coupons, legal must approve disclosures before publishing, engineering manages feature toggles.

## Launch Readiness Checklist
- Inventory of initial coupons validated with partners and QA.
- Automated checks for expired coupons scheduled (cron or workflow).
- Analytics tracking plan confirmed; test click tracking in the dev environment.
- Customer support briefed on redemption flow and escalation path.

## Open Questions & Assumptions
- Need decision on SSR vs client-side filtering to balance SEO with interactivity.
- Clarify whether partner-conversion feedback will be integrated via API or manual reporting.
- Assume coupon and recommendation taxonomies are shared; requires final taxonomy alignment meeting.
