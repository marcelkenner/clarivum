# Account Claiming & Entitlement Shelf Runbook

> Complements ADR-032 and the ebooks fulfillment runbook. Guides operations, support, and engineering teams when managing pending profiles, claim flows, and entitlement shelf issues.

## Purpose
- Ensure guest purchasers can seamlessly claim full accounts without blocking download access.
- Provide a troubleshooting playbook for entitlement shelf data mismatches, download issues, and cross-email ownership requests.

## Scope
- Auth0 magic-link invitation workflow.
- Supabase `profiles` table (`status`, `pending_claim_token`, `last_claim_email_sent_at`).
- Entitlement aggregation API powering the Account Center shelf.
- Notification automations (Listmonk/Novu) for claim reminders.

## Preconditions
- ADR-032 adopted; Supabase schema migrations deployed (`profiles.status`, `entitlement_status_history`).
- Auth0 tenant configured with passwordless email connection and email templates for `claim-library`.
- Novu/Listmonk templates published for claim reminder (24h, 7d) and confirmation.
- Support tooling exposes "Send claim email" and "Merge entitlements" actions.

## Tooling & References
- `npm run ebooks:claim-smoke` — full guest purchase → claim regression test.
- Supabase SQL snippets (`scripts/sql/entitlement-pending.sql`) for reconciling pending claims.
- Auth0 Management API (`POST /jobs/verification-email`) via CLI or internal admin UI.
- Analytics dashboards tracking `entitlement.claim_initiated` / `entitlement.claim_success`.

## Operational Checklist
### Daily
- Review dashboard of pending claims older than seven days; reissue claim reminders if delivery failed.
- Verify no more than 2% of daily purchases remain unclaimed after 24 hours.
- Monitor magic-link email bounce and spam complaint rates; alert lifecycle marketing if thresholds exceeded.

### Weekly
- Audit random sample of claimed accounts to confirm entitlements sync to the shelf correctly (download actions succeed).
- Inspect entitlement shelf error logs (5xx, signed URL failures) and raise issues for remediation.

### Monthly
- Review analytics for claim conversion funnel (email opened, link clicked, claim completed).
- Confirm support macros remain up-to-date and localized where required.
- Validate diagram inventory (`docs/diagrams/adr-032-guest-entitlements-and-account-claiming/`) still mirrors system architecture.

## Common Procedures
### Resend Claim Email
1. Locate profile by email in Supabase; verify `status = pending_claim`.
2. Trigger claim email via support UI or run:
   ```bash
   auth0 jobs verification-email --email user@example.com --client-id <claim-client>
   ```
3. Record resend timestamp in CRM note; ensure rate limiting (<3 attempts per 24h).

### Merge Entitlements Across Emails
1. Authenticate user requesting merge; gather proof of purchase (order ID, last four digits, billing zip).
2. Run reconciliation script to list entitlements for both emails.
3. Update Supabase to transfer entitlements and set canonical email; send confirmation to both addresses.
4. Invalidate previous pending tokens; issue new claim email if second email lacked an account.

### Shelf Debug — Missing Entitlement
1. Check entitlement service logs for the user’s Auth0 ID.
2. Ensure `entitlement_status_history` has a recent `activated` entry; if absent, rerun background reconciliation job.
3. Verify Supabase RLS policies allow the Auth0 ID; adjust policy if new role introduced.
4. Confirm the frontend cache (SWR/React Query) refreshed; instruct user to reload or clear session if stale.

### Shelf Debug — Download Failure
1. Inspect signed URL generation logs; confirm storage object exists and is not expired.
2. Regenerate URL manually; if failure persists, check storage bucket ACL.
3. Ensure watermarking job completed; incomplete jobs should retry or mark entitlement `processing`.
4. File bug under `type:bug` with linked Sisu note if systemic.

## Incident Response
- If claim emails fail globally, disable automated reminders, post status update, and engage Auth0/SMTP provider.
- For security incidents (unauthorized entitlement access), rotate tokens, invalidate all pending claim links, and coordinate with security lead per ADR-028.

## Metrics & Guardrails
- Claim conversion rate target: ≥90% within seven days of purchase.
- Pending claim backlog cap: <50 users at any time (alert if exceeded).
- Mean time to resolve shelf-related support ticket: <12h; track via support analytics.

## Change Log
- 2025-10-27 — Initial runbook aligned with ADR-032 guest entitlement strategy.
