# Payments Operations Runbook

## Scope & objectives
- Operationalize the dual-provider checkout strategy from ADR-011 (Stripe + PayU + Przelewy24 redundancy).
- Ensure `PaymentsCoordinator`, `StripePaymentManager`, `PayuPaymentManager`, and `P24PaymentManager` stay production-ready across environments.
- Provide onboarding, reconciliation, refund, and incident procedures for finance and engineering teams.

## Roles & responsibilities
- **Primary owner:** Payments Operations Manager.
- **Engineering rotation:** Checkout squad engineer (biweekly).
- **Finance partner:** Finance lead (reconciliation + reporting).
- **Escalation matrix:** Platform lead → CTO → Finance director.

## Tooling
- Clarivum Operations Hub (Commerce module) for consolidated webhook health, wallet availability, refund triggers, and one-click deep links into Stripe, PayU, and Przelewy24 dashboards.
- Stripe, PayU, Przelewy24 dashboards for provider-specific configuration and settlement exports.
- Grafana dashboards (`Payments SLO`, `Wallet Health`) embedded in `/ops`.

## Environments & credentials
- **Secrets:** Stored in AWS Secrets Manager per ADR-007; rotated quarterly.
- **Stripe:** Dashboard access for operations; API keys mapped to `STRIPE_SECRET_KEY` env vars. Payment Element usage per `/stripe/stripe-js` docs (ensure advanced fraud signals meet PSD2).
- **PayU:** Sandbox and production OAuth credentials, BLIK configuration per `/websites/developers_payu_com-europe-docs-get-started`. Maintain `BLIK_AUTHORIZATION_CODE` test codes for QA.
- **Przelewy24:** Merchant IDs & POS IDs stored in Secrets Manager; redirect URLs point to Vercel Edge functions for webhook verification (reference `/websites/developers_przelewy24_pl` transaction registration).

## Provider onboarding checklist
### Stripe
1. **Create connected user:** Add operator in Stripe Dashboard with `Read & Write` access for payments and refunds.
2. **Verify webhooks:** Ensure Vercel Edge endpoint subscribed to `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`.
3. **Payment Element smoke test:** Use a card (4242…) to confirm SCA flows. Example client integration:
   ```typescript
   const {paymentIntent, error} = await stripe.confirmPayment({
     elements,
     confirmParams: {return_url: `${APP_URL}/checkout/result`},
   });
   ```
4. **Activate Stripe Tax + Radar rules** (fraud signals default on).

### PayU (local methods + BLIK)
1. **Sandbox validation:**
   - Create sample order using authorization code (`777654`) per Context7 snippet:
     ```json
     "payMethods": {
       "payMethod": {
         "type": "BLIK_AUTHORIZATION_CODE",
         "value": "777654"
       }
     }
     ```
   - Confirm webhook delivery to `/api/payments/payu/notify`.
2. **Production credentials:** Coordinate with finance for merchant POS IDs and OAuth token generation.
3. **BLIK tokenization:** Enable `register: true` flag for recurring payments; ensure consent UI includes BLIK terms.
4. **Fallback flows:** Document PBL (redirect) path for banks lacking BLIK.

### Przelewy24 (redundant pay-by-link + Google Pay)
1. **Register transaction flow:** Configure `/api/transactions` per Context7 docs with `urlReturn` and `urlStatus` hitting Vercel functions.
2. **Google Pay setup:** Provide `xPayPayload` for QA; confirm 3DS redirect endpoint `/api/v1/card/chargeWith3ds`.
3. **Signature health:** Automate SHA384 checksum validation inside `P24PaymentManager`.
4. **Dashboard access:** Finance partner monitors settlement batches.

### Wallets (Apple Pay & Google Pay via Stripe Payment Element)
1. **Enable payment methods:** Toggle Apple Pay and Google Pay in Stripe Dashboard → Payment Methods; ensure wallet capability matches country/currency strategy (`TSK-PLAT-032`, `TSK-PLAT-033`).
2. **Domain verification:** Upload the `apple-developer-merchantid-domain-association` file to Vercel for each storefront domain; verify in Stripe and Apple Developer account. For Google Pay, confirm domain is registered in Stripe and Przelewy24 per redundancy plan.
3. **Certificates & merchant IDs:** Generate Apple Pay Merchant ID and Payment Processing certificate (valid 2 years). Store private keys securely in Secrets Manager; document rotation reminders.
4. **Client integration:** Expose wallet buttons through Stripe Payment Element configuration:
   ```typescript
   const stripe = await getStripeClient();
   const options = {appearance, paymentMethodOrder: ["apple_pay", "google_pay", "card"]};
   const elements = stripe.elements(options);
   ```
   Confirm fallback to standard card entry when wallets unavailable.
5. **Testing:** Execute sandbox flows—Apple Pay via Safari developer tools (iOS simulator) and Google Pay via Chrome test environment. Capture payment intent IDs for audit trail.
6. **Observability:** Tag wallet transactions (`payment_method_details[wallet]`) and surface metrics in payments dashboards; update reconciliation scripts to include wallet metadata.

## Operational run cadence
- **Daily:** Review the Commerce module in `/ops` to confirm webhook health, wallet availability, and SES/Listmonk cross-status before checking provider dashboards. Retry failures via `PaymentsCoordinator.retryFailedWebhooks(provider)` or the Operations Hub action buttons (feature-flagged), and use the provided quick links to jump into Stripe/PayU/P24 consoles when deeper investigation is needed.
- **Weekly:** Reconcile payouts vs Supabase ledger (see next section).
- **Monthly:** Refresh provider credentials list, review fraud trends, audit feature flag toggles (`payments_provider_override`).

## Reconciliation workflow
1. **Data pulls:**
   - Stripe: Export payouts + balance transactions (UTC window).
   - PayU & Przelewy24: Download settlement reports (CSV) from dashboards.
2. **Normalize:** Load into Supabase dev tables via `npm run payments:import -- --provider stripe`.
3. **Compare:** Run `PaymentsReconciliationManager.compare(provider, dateRange)`; resolves discrepancies by session ID.
4. **Mismatch handling:** For differences > 5 PLN, open Linear ops ticket, attach provider CSV, and escalate to finance.

## Refunds & adjustments
1. **Stripe refunds:** Trigger via admin panel or CLI (`stripe refunds create --charge ch_xxx`). Update Supabase `payment_status` to `refunded`; notify customer via transactional email (Listmonk template).
2. **PayU/Przelewy24 refunds:** Initiate through provider dashboard API (requires token). Document refund reference in Supabase `provider_metadata`.
3. **Partial refunds:** Ensure `CheckoutCoordinator` sends webhook to Flagsmith to adjust entitlement flags.
4. **Chargebacks:** Stripe Radar alerts route to #payments-alerts. Finance lead owns evidence submission; update incident log.

## Incident response
1. **Detection:** Alert sources include provider webhooks errors, latency SLA breaches, or failed payouts.
2. **Containment:** Use feature flag to pivot all traffic to Stripe (`payments_force_stripe=true`) if local providers degraded; Commerce module highlights toggles and current status.
3. **Diagnosis checklist:**
   - Stripe: Check Dashboard status, inspect `confirmPayment` errors for SCA issues.
   - PayU: Review BLIK error codes (e.g., `AUTH_CODE_EXPIRED`) per Context7 table; retry with fresh code.
   - Przelewy24: Validate signature & session IDs; inspect `urlStatus` payloads for status `0/1`.
4. **Communication:** Within 30 minutes notify `#clarivum-leadership` with blast radius, mitigation, ETA.
5. **Post-incident:** Within 24 hours complete RCA document, log in this runbook changelog.

## Security & compliance
- Enforce TLS 1.2+, verify webhook signatures (Stripe, PayU HMAC, P24 SHA384).
- Limit dashboard access to named operators; remove access on role change.
- Keep PCI scope minimized by using provider-hosted UIs (Stripe Payment Element, P24 redirect).
- Store only provider IDs and status in Supabase; never persist raw PAN/BLIK codes.

## Change log
- **2025-10-24:** Documented Operations Hub tooling and daily cadence updates.
- **2025-10-27:** Added Apple Pay / Google Pay wallet onboarding steps and cross-references to TSK-PLAT-032/033.
- **2025-10-23:** Initial runbook covering provider onboarding, reconciliation, refunds, and incident handling.
