# Ebooks Fulfillment Runbook

> Supports delivery workflows from `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/pdf-converter/requirements.md`, and ADR-024.

## Purpose
- Guarantee reliable purchase-to-download experiences for free and paid ebooks.
- Provide support and operations teams with procedures for resend requests, refunds, and incident response.

## Scope
- Checkout-to-fulfillment pipeline (Stripe payment intent, coupon redemption, mission unlock rewards).
- Supabase Storage buckets holding PDF/EPUB assets.
- Notification stack (Listmonk + Novu) for delivery emails.
- Customer profile library displaying owned ebooks.

## Preconditions
- Ebook metadata in Strapi published with asset references and pricing.
- `EbookFulfillmentManager` service configured with notification templates.
- Pending profile state (`pending_claim`) enabled in Supabase with claim tokens ready for Auth0 verification.
- Supabase Storage paths versioned (`ebooks/<slug>/<version>/file.pdf`).
- Support CRM macros prepared for ebook issues.

## Tooling & References
- Stripe Dashboard (payments, refunds).
- Supabase Dashboard (storage explorer, SQL editor).
- Listmonk / Novu campaign dashboards.
- `npm run ebooks:smoke` — verifies sample purchase flow in staging.
- `npm run ebooks:claim-smoke` — verifies guest checkout, fulfillment email, magic-link claim, and entitlement shelf hydration in staging.
- Slack `#clarivum-support` for escalations.

## Operational Checklist
### Daily
- Review Stripe payment failures related to ebooks; retry or contact customer.
- Monitor download email delivery stats (bounce <1%).
- Spot-check Supabase signed URLs expiry and access logs.
- Check fulfillment orchestrator dashboard for jobs stuck in `pending_email` or `pending_storage` longer than five minutes; escalate if any exist.
- Review pending profiles older than seven days; trigger claim reminder workflow if not already sent.

### Weekly
- Run `npm run ebooks:smoke` to confirm purchase, email, and profile access.
- Run `npm run ebooks:claim-smoke` to validate guest purchase, claim CTA, and entitlement shelf hydration.
- Validate new ebook releases have matching assets and metadata.
- Audit mission-based coupon unlocks to ensure reward maps to valid ebook SKU.
- Reconcile Stripe payments vs entitlements + receipts using `scripts/ops/reconcile-payments.ts`; resolve discrepancies within 24h.

### Monthly
- Reconcile revenue vs Supabase entitlement table counts.
- Review refund/chargeback rates; coordinate with finance for trends.
- Refresh support macros with new FAQs or issue patterns.
- Perform failover drill: simulate email provider outage and validate fallback sends manual receipts within SLA.

## Fulfillment Flow
1. User completes checkout (Stripe) or mission reward (coupon).
2. `EbookFulfillmentManager` records purchase in Supabase (`ebook_entitlements` table).
3. Fulfillment orchestrator generates signed download links and transaction receipt; sends via Novu/Listmonk template.
4. Orchestrator marks job `completed` only after storage, entitlement, analytics, and email succeed; otherwise it retries with exponential backoff and alerts.
5. Profile library displays entitlements via Supabase view.
6. Scheduled reminder email (24h) prompts user to download if unopened.

## Support Procedures
### Resend Download Link
- Locate entitlement in Supabase (query by email/order ID).
- Trigger resend via Novu (`ebooks.resend` workflow) or use support UI shortcut.
- Confirm email deliverability; if blocked, provide temporary signed URL (expires 24h).

### Account Claim Assistance
- Confirm entitlement ownership (email, order ID) and check status in Supabase (`entitlement_status`).
- If status equals `pending_claim`, trigger a fresh Auth0 magic link from support tooling (`auth0 jobs verification-email --email <address>`) or the internal UI action.
- Remind customer that emailed download links stay active for 48 hours and encourage claim to unlock persistent library access.
- When a user needs to merge entitlements from another email, verify at least two data points before linking records and documenting the change.
- Log the interaction in the support CRM and schedule a follow-up if the account remains unclaimed after 24 hours.

### Fulfillment Resend / Missing Receipt
- Search orchestrator logs by payment intent ID; confirm job status.
- If stuck in `pending_email`, retry send via admin UI; investigate email provider logs for bounces.
- If job missing entirely, run reconciliation script to requeue event; Stripe webhook replay may be required (`stripe events resend <event_id>`).
- Escalate to platform on-call if a fulfilled payment lacks entitlements for >5 minutes or if more than three jobs fail per hour.

### Failed Download
- Validate Supabase object exists and ACL allows authenticated user.
- Regenerate signed URL with shorter expiry; test on behalf of user.
- Check CDN or network status if repeated timeouts.

### Refund / Order Cancellation
- Process refund in Stripe; note reason code.
- Update Supabase entitlement status to `revoked`.
- Notify user with cancellation email referencing refund timeline.
- If mission reward, record revocation in mission audit log.

### Mission-Based Unlock Issues
- Verify mission approved and reward map points to correct ebook SKU.
- Reissue coupon if necessary; ensure Missions Reward Coordinator log updated.
- For invalid evidence, direct user to `mission-moderation` support path.

## Incident Response
### Fulfillment Outage (emails not sending)
- Check Novu/Listmonk status dashboards.
- Switch to backup template provider if outage >30 min (manual email via SendGrid fallback).
- Post update in `#clarivum-alerts` and support channel.

### Storage Outage
- Confirm Supabase status; if regional outage, post maintenance message on site.
- Provide alternate hosting (temporary S3 bucket) for critical products if downtime expected >2h.
- After restoration, invalidate cached links and regenerate signed URLs.

### Data Integrity Issue
- Example: duplicate entitlements or missing records.
- Run reconciliation script comparing Stripe payments vs Supabase entitlements.
- Restore from backup if corruption; document incident and preventive fixes.

## Compliance & Customer Care
- Honor DSAR requests by deleting user entitlements and assets; confirm with legal.
- Ensure refund policies communicated in confirmation emails.
- Track support SLAs: respond within 12h, resolve within 24h for standard tickets.

## Escalation Matrix
- Level 1: Support agent (triage, resend).
- Level 2: Lifecycle marketing manager (email automation, coupon mapping).
- Level 3: Platform engineer (storage, entitlement bugs).
- Level 4: Finance lead (billing disputes) and CTO (major outages).

## Maintenance
- Update runbook when new ebook formats, distribution channels, or automation tools are introduced.
- Log revisions in changelog below.

## Changelog
- 2025-10-26 — Initial ebook fulfillment runbook supporting mission-gated rewards.
- 2025-10-27 — Added guest checkout pending-profile guidance, claim smoke test, and support procedures for account claiming.
