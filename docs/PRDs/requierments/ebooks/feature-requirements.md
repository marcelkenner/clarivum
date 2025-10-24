# Feature Requirements — Ebooks Catalog & Distribution

> **Canonical decision:** See `docs/adr/ADR-024-ebooks-and-digital-products.md` for the delivery and entitlement architecture.

## Objective
- Operate the global ebooks hub (`/ebooks/`) and vertical-specific catalogs that convert visitors into leads and customers through high-utility digital products.
- Provide a purchase and delivery experience that is trustworthy, fast, and repeatable for future ebook launches.

## Target Outcomes
- Business: grow ebook-driven revenue and lead capture, supporting upsell into bundles and subscriptions.
- Experience: allow visitors to discover relevant ebooks within three clicks and receive purchased files instantly with clear usage guidance.

## Primary Users & Segments
- Prospects seeking deep-dive content (first-time visitors, newsletter subscribers).
- Returning customers looking for complementary ebooks or bundles.
- Segmentation: vertical interest (Skin, Fuel, Habits), purchase history, diagnostic outcomes.

## Experience Principles
- Mirror the sitemap strategy in `clarivum_brand.md`: global hub, vertical listings, and detailed product pages.
- Lean into trust signals: author credentials, methodology, testimonials, sample pages.
- Encourage cross-sell but avoid overwhelming the reader; prioritize clarity over volume.

## Functional Requirements
- FR1 — Deliver `/ebooks/` hub with filters by vertical, topic, skill level, and format (single vs bundle).
- FR2 — Provide ebook detail pages with preview module, CTA, bonus items, FAQ, testimonials, and related products.
- FR3 — Support free lead magnets and paid products with shared checkout flow; handle discount codes and coupons, including wallet payments (Apple Pay, Google Pay) via Stripe Payment Element and Przelewy24 redundancy tracked in `tasks/backlog/platform/plat-032-google-pay-wallet.md` and `tasks/backlog/platform/plat-033-apple-pay-wallet.md`.
- FR4 — Trigger fulfillment emails with download links, include instructions for different devices, and offer resend/self-service access via profile.
- FR5 — Surface bundle recommendations based on Strapi metadata and user profile.
- FR6 — Expose inventory endpoints for marketing automations and on-site widgets (e.g., homepage CTA).

## Content & Data Inputs
- Ebook metadata: title, slug, summary, outcomes, format, file assets, pricing, CTA copy, testimonials, sample pages in Strapi.
- Pricing and promotions from subscriptions/coupons services.
- Author bios and methodology content from brand/PRD sources.

## Integrations & Dependencies
- Internal: checkout/payment service, profile service for access management, analytics, coupon engine, subscription manager.
- External: payment processor (Stripe or equivalent) with wallets and local methods (PayU, Przelewy24), digital delivery (e.g., secure CDN or Document fulfillment provider).

## Analytics & KPIs
- Track views → downloads → purchases, average order value, bundle attach rate, refund rate, file download completion.
- Monitor content freshness (last update timestamps) and performance per vertical.

## Non-Functional Requirements
- Ensure SEO-friendly static generation with incremental revalidation on content changes.
- Deliver download links via secure, expiring URLs; enforce rate limiting to prevent abuse.
- Maintain accessibility (structured headings, alt text for previews) and localization readiness.

## Compliance & Access Control
- Provide clear terms of use and refund policy; link to legal disclaimers (non-medical guidance).
- Ensure VAT/tax calculation compliance per region (liaise with finance/legal).
- Limit access to purchased ebooks to the authenticated buyer; support data deletion requests.

## DRM & Watermarking
- Skip heavy DRM to preserve user experience; instead apply personalized watermarking (buyer name + order ID) on PDF exports via PDF generation pipeline.
- Ensure watermarking template managed in Strapi so marketing/legal can adjust copy without code changes.
- Provide guidance in fulfillment emails about permissible sharing; log watermark application for audit traces.

## Launch Readiness Checklist
- Content QA (copy, assets, links) complete per ebook.
- Checkout tested across devices; fulfilment emails deliver correctly.
- Analytics events validated; dashboards for sales and conversion set up.
- `docs/runbooks/ebooks-fulfillment.md` reviewed with support, lifecycle marketing, and finance.
- Customer support macros created for ebook access issues.

## Open Questions & Assumptions
- Need clarity on localization roadmap (multi-language distribution).
- Assume same checkout flow will serve future product types; verify extensibility requirements.
