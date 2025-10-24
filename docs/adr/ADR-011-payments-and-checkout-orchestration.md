# ADR-011: Payments & Checkout Orchestration
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum must monetize ebooks and subscriptions for a Poland-first audience while preparing for broader EU expansion.
- Checkout flows need to support cards, wallets, and dominant Polish methods (BLIK, pay-by-link bank transfers) with PSD2-compliant SCA and minimal PCI scope for the small engineering team.
- Marketing requires rapid experimentation (coupons, trials) and unified reporting across one-off purchases and recurring billing.
- Existing architecture (Vercel + Supabase) depends on serverless-friendly SDKs; we must avoid hosting custom payment infrastructure.
- Platform requirements and funnel expectations live in `docs/PRDs/requierments/subscriptions/feature-requirements.md` and `docs/PRDs/requierments/ebooks/feature-requirements.md`.

## Decision
- Establish a dual-provider strategy:
- **Stripe** remains the primary processor for cards, wallets, and subscriptions using the Payment Element flow (`stripe-samples/accept-a-payment` guidance via Context7) to consolidate PCI-sensitive UI inside Stripe Elements, including wallet support for Apple Pay and Google Pay once domain and merchant verification is completed (tracked in `tasks/backlog/platform/plat-032-google-pay-wallet.md` and `tasks/backlog/platform/plat-033-apple-pay-wallet.md`).
  - **PayU** serves as the aggregator for Polish local methods (BLIK, pay-by-link, deferred payments) leveraging documented BLIK integrations (`developers_payu_com-europe-docs` references to `payMethods` types `PBL` and `BLIK_AUTHORIZATION_CODE`).
  - **Przelewy24** provides redundant pay-by-link coverage and Google Pay fallback per the REST integration docs (Context7 `/developers_przelewy24_pl` transaction registration and hosted form snippets).
- Build a `PaymentsCoordinator` service that abstracts provider routing:
  - ViewModels call `CheckoutCoordinator` which selects Stripe or local provider based on locale, cart type, and customer preference.
  - Managers encapsulate provider SDK interactions (`StripePaymentManager`, `PayuPaymentManager`, `P24PaymentManager`) to keep business logic isolated per OOP guidelines.
  - Store normalized payment intents in Supabase with canonical status transitions; webhook handlers (deployed on Vercel Edge) update state and trigger feature flags or fulfillment jobs.
- Implement shared UX patterns:
  - Client renders Stripe Payment Element for global flows; local-method flows redirect to provider-hosted pages or embed forms (Przelewy24 `ajax.js` iframe) while preserving session via signed tokens.
  - Support BLIK code entry and token reuse via PayU’s `BLIK_TOKEN` extension when buyers opt-in (`blikData` fields per Context7 docs).
  - Offer currency handling (PLN primary, EUR secondary) with tax/VAT rules managed through Stripe Tax where available.
- Centralize secrets in AWS Secrets Manager (ADR-007) and rotate quarterly; adopt idempotency keys across all outgoing payment requests.

## Diagrams
- [Architecture Overview](../diagrams/adr-011-payments-and-checkout-orchestration/architecture-overview.mmd) — Checkout coordinator routing traffic to Stripe, PayU, and Przelewy24 with normalized ledger updates.
- [Data Lineage](../diagrams/adr-011-payments-and-checkout-orchestration/data-lineage.mmd) — Payment intents, provider charges, refunds, and ledger entries.
- [UML Service Collaborators](../diagrams/adr-011-payments-and-checkout-orchestration/uml-services.mmd) — Coordinator and provider-specific managers plus webhook processors.
- [BPMN Fulfillment Flow](../diagrams/adr-011-payments-and-checkout-orchestration/bpmn-fulfillment.mmd) — Checkout, confirmation, fulfillment, and reconciliation process.

## Consequences
- **Benefits:** Stripe covers recurring billing and global expansion while PayU/Przelewy24 deliver localized trust signals (BLIK, bank redirects) essential for Polish conversion rates.
- **Trade-offs:** Multiple providers increase integration complexity; mitigated by the coordinator pattern and shared telemetry pipeline.
- **Operational notes:** Finance dashboards aggregate transactions via provider webhooks; discrepancies trigger reconciliation jobs.
- **Follow-ups:**
  - Document provider onboarding in `docs/runbooks/payments-operations.md`, including test credentials and refund procedures.
  - Implement automated reconciliation scripts comparing provider exports to Supabase ledger.
  - Evaluate consolidating to a single aggregator once EU coverage matures (e.g., PayU full-stack or Stripe local methods parity).
