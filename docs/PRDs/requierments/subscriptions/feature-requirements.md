# Feature Requirements — Subscriptions & Memberships

> **Canonical decision:** See `docs/adr/ADR-011-payments-and-checkout-orchestration.md` for the platform architecture governing subscriptions.

## Objective
- Operate Clarivum’s subscription offerings, providing recurring value (exclusive content, tools, discounts) while ensuring seamless billing and retention workflows.
- Align subscription experiences with vertical funnels and account capabilities.

## Target Outcomes
- Business: grow predictable recurring revenue with high retention and low churn.
- Experience: allow users to understand plan benefits, start a subscription quickly, and manage their membership without support intervention.

## Primary Users & Segments
- Prospects upgrading from free resources or one-off ebook purchases.
- Existing subscribers managing plans, pausing, or renewing.
- Segmentation: plan tiers (e.g., Essentials, Pro), vertical focus bundles, regional pricing, corporate/team subscriptions (future).

## Experience Principles
- Communicate value clearly (what’s included, how it complements ebooks/tools).
- Reduce friction in checkout; highlight trial or money-back guarantees if available.
- Surface proactive guidance for subscribers (new content drops, recommended next actions).

## Trial Strategy
- Offer a 14-day free trial for monthly plans; charge immediately for annual plans with a 14-day refund grace period.
- Require payment method up front via Stripe Billing with clear disclosure of post-trial pricing.
- Send lifecycle reminders 3 days and 1 day before trial end; include self-serve cancel link in email and profile.

## Functional Requirements
- FR1 — Subscription landing page with plan comparison, benefits table, testimonials, and FAQ.
- FR2 — Checkout flow supporting trials, coupon codes, and upsell to annual plans.
- FR2a — Wallet checkout (Apple Pay, Google Pay) enabled through Stripe Payment Element with Przelewy24 fallback per ADR-011; implementation coordinated via `tasks/backlog/platform/plat-032-google-pay-wallet.md` and `tasks/backlog/platform/plat-033-apple-pay-wallet.md`.
- FR3 — Account management: view plan details, billing history, upcoming invoices, upgrade/downgrade, pause/cancel, reactivate.
- FR4 — Access control to subscriber-only content (ebooks, recommendations, coupons, tools) integrated with auth/profile.
- FR5 — Automated lifecycle messaging (welcome, renewal reminders, churn saves) triggered via newsletter system.
- FR6 — Support for tax/VAT calculation, invoicing, and compliance with regional billing requirements.
- FR7 — Provide analytics endpoints exposing subscription lifecycle events to other features (dashboard, analytics).

## Content & Data Inputs
- Plan definitions (name, price, benefits, included content) stored in Strapi or subscription service configuration.
- Legal copy for billing terms, refund policy, and cancellation rights.
- Access rules mapping subscriber tiers to content modules.

## Integrations & Dependencies
- Internal: authentication, profile, ebooks, recommendations, coupons, analytics, component library.
- External: payment processor (Stripe Billing or equivalent) including wallets (Apple Pay, Google Pay) and local method partners (PayU, Przelewy24); accounting integration for revenue recognition; tax calculation service.

## Analytics & KPIs
- Monitor conversion (trial → paid), churn (voluntary/involuntary), MRR, ARPU, plan mix, subscriber engagement with gated content.
- Track support ticket volume related to billing/account management.

## Non-Functional Requirements
- Checkout performance: page load ≤ 2 s, API response times ≤ 300 ms.
- Ensure high availability for billing endpoints (SLO 99.9%).
- Provide PCI-compliant handling by delegating card data to the payment processor.

## Compliance & Access Control
- Adhere to consumer protection regulations (clear cancellation, refunds, renewal notifications) orchestrated through Novu workflows with audit trails.
- Store payment and personal data securely; rely on processor for sensitive details.
- Implement role-based permissions for internal staff to manage subscriptions (support vs finance vs admin).
- Surface subscription health, webhooks, and manual controls in the Clarivum Operations Hub `/ops` commerce module for consolidated auditing (ADR-031).

## Launch Readiness Checklist
- Pricing strategy and plan benefits finalized with stakeholders.
- Payment processor configured with production keys, webhooks, and test cases validated.
- Subscriber-only content flagged and access rules tested.
- Lifecycle messaging flows authored, QA’d, and scheduled within Novu (trial reminders, renewal notices, churn follow-up).
- Trial reminder cadence (T-3, T-1) validated end-to-end with Stripe webhook simulator.

## Open Questions & Assumptions
- Determine handling of corporate/team subscriptions and seat management (future).
- Assume integration with existing ebook checkout; confirm technical approach.
