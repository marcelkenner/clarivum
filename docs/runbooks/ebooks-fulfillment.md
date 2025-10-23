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
- Supabase Storage paths versioned (`ebooks/<slug>/<version>/file.pdf`).
- Support CRM macros prepared for ebook issues.

## Tooling & References
- Stripe Dashboard (payments, refunds).
- Supabase Dashboard (storage explorer, SQL editor).
- Listmonk / Novu campaign dashboards.
- `npm run ebooks:smoke` — verifies sample purchase flow in staging.
- Slack `#clarivum-support` for escalations.

## Operational Checklist
### Daily
- Review Stripe payment failures related to ebooks; retry or contact customer.
- Monitor download email delivery stats (bounce <1%).
- Spot-check Supabase signed URLs expiry and access logs.

### Weekly
- Run `npm run ebooks:smoke` to confirm purchase, email, and profile access.
- Validate new ebook releases have matching assets and metadata.
- Audit mission-based coupon unlocks to ensure reward maps to valid ebook SKU.

### Monthly
- Reconcile revenue vs Supabase entitlement table counts.
- Review refund/chargeback rates; coordinate with finance for trends.
- Refresh support macros with new FAQs or issue patterns.

## Fulfillment Flow
1. User completes checkout (Stripe) or mission reward (coupon).
2. `EbookFulfillmentManager` records purchase in Supabase (`ebook_entitlements` table).
3. Signed download links generated and sent via Novu/Listmonk template.
4. Profile library displays entitlements via Supabase view.
5. Scheduled reminder email (24h) prompts user to download if unopened.

## Support Procedures
### Resend Download Link
- Locate entitlement in Supabase (query by email/order ID).
- Trigger resend via Novu (`ebooks.resend` workflow) or use support UI shortcut.
- Confirm email deliverability; if blocked, provide temporary signed URL (expires 24h).

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
