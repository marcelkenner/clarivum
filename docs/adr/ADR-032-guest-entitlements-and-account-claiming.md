# ADR-032: Guest Purchases, Entitlement Shelf, and Account Claiming
Date: 2025-10-27
Status: Proposed

## Context
- Clarivum is launching monetized ebooks and downloadable assets (`docs/PRDs/requierments/ebooks/feature-requirements.md`) backed by the PDF/EPUB generation pipeline (`docs/PRDs/requierments/pdf-converter/requirements.md`) and fulfillment runbook (`docs/runbooks/ebooks-fulfillment.md`).
- The Account Center (ADR-023) must display owned digital products so customers can re-download purchases on demand.
- Current guidance does not address how to handle purchasers without an existing Clarivum account, nor how the entitlement shelf UX should behave across devices.
- We need a consistent pattern that balances low-friction checkout (no forced registration up front), secure fulfillment, and long-term customer lifecycle (upsell, compliance, self-service support).

## Decision
- Allow **guest checkout** for ebooks and digital products to minimize purchase friction.
  - When a purchase is completed without an authenticated session, create a **pending profile record** in Supabase tied to the billing email and mark the entitlement as `pending_claim`.
  - Issue fulfillment emails immediately with expiring download links so the user can access the asset even before claiming the account.
- Provide a **claim-your-account** experience:
  - Present inline success-state messaging with a one-click "Claim your Clarivum account" CTA that launches an Auth0 passwordless magic link (primary) or password setup (fallback).
  - Reminder emails (24h and 7d) include claim prompts if the account remains pending.
  - Once verification succeeds, upgrade the profile to `active`, link the Auth0 user ID, and surface the entitlement shelf inside the Account Center.
- Ship an **Entitlement Shelf** module inside the Account Center:
  - Shows cards for each owned digital product with format badges, latest download timestamp, and `Download PDF` / `Download EPUB` actions that generate fresh Supabase signed URLs.
  - Supports filters (`All`, `In progress`, `Archived`) and a "Resend delivery email" option that triggers Novu/Listmonk workflows.
  - Displays contextual prompts (e.g., "Claim another purchase using a different email") and links to support when entitlement reconciliation fails.
- Align telemetry and support tools:
  - Emit events (`entitlement.claim_initiated`, `entitlement.claim_success`, `entitlement.download`) through the analytics pipeline (ADR-029).
  - Update runbooks so support teams can manually trigger claim emails, resend downloads, and reconcile guest purchases.

## Robustness & Guardrails
- All purchase events flow through an idempotent **Fulfillment Orchestrator** that writes a durable event record before attempting email or entitlement updates. Failures leave the event in `pending_retry` with exponential backoff and alerting.
- Stripe webhook handlers acknowledge immediately after enqueueing a fulfillment job; retries use the event IDempotency key to prevent duplicate entitlements.
- Receipt and fulfillment emails are sent from the same orchestrator transaction: if email send fails, the job remains `pending_email` and alerts lifecycle + support after two retries.
- Entitlements remain invisible in the shelf until both storage upload and entitlement persistence succeed; otherwise they surface as `processing` with proactive communication.
- Daily reconciliation compares Stripe payments against entitlements and receipts; discrepancies raise PagerDuty+Slack alerts and open Kaizen tickets automatically.
- Users can always regenerate receipts/downloads via account center; support UI exposes forced resend tools tied into the orchestrator rather than bypassing it.

## Consequences
- **Benefits:** Reduces checkout abandonment, keeps fulfillment reliable, and gives customers a durable, self-service library once they authenticate. Adds explicit guardrails preventing silent failures between payment and delivery.
- **Trade-offs:** Requires additional automation to manage pending profiles, verify ownership during claim, secure download links, and operate the fulfillment orchestrator with monitoring.
- **Follow-ups:**
  - Implement Supabase schema changes for pending profiles and entitlement status history.
  - Extend Auth0 workflows for magic-link invitations scoped to the `ebooks` audience.
  - Build the entitlement shelf UI and supporting API routes/server actions.
  - Launch fulfillment orchestrator with durable queue, analytics, and alerting.
  - Document support flows and automation guardrails.

## References
- `docs/PRDs/requierments/ebooks/feature-requirements.md`
- `docs/PRDs/requierments/profile/feature-requirements.md`
- `docs/runbooks/ebooks-fulfillment.md`
- `tasks/backlog/platform/plat-008-ebooks-delivery.md`
- `tasks/backlog/platform/plat-007-account-center.md`

## Diagrams
- [Architecture Overview](../diagrams/adr-032-guest-entitlements-and-account-claiming/architecture-overview.mmd)
- [Data Lineage](../diagrams/adr-032-guest-entitlements-and-account-claiming/data-lineage.mmd)
- [UML — Entitlement Shelf Components](../diagrams/adr-032-guest-entitlements-and-account-claiming/uml-components.mmd)
- [Sequence — Guest Purchase to Claim](../diagrams/adr-032-guest-entitlements-and-account-claiming/sequence-guest-claim.mmd)
- [BPMN — Claim Resolution Flow](../diagrams/adr-032-guest-entitlements-and-account-claiming/bpmn-claim-flow.mmd)
