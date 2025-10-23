# Communication Channel Selection

Clarivum operates two distinct messaging platforms. This runbook explains when to choose **Novu** (real-time product notifications) or **Listmonk** (scheduled lifecycle campaigns), provides decision criteria, and illustrates example scenarios so teams keep customer touchpoints consistent and compliant.

## Platform Overview
- **Novu (self-hosted):** Event-driven notification hub integrated with the application (`docs/adr/ADR-012-notification-experience-and-toasts.md`). Delivers in-app inbox messages, transactional emails/SMS, and Sonner toasts with per-event telemetry.
- **Listmonk (self-hosted):** Campaign automation engine for newsletters and lifecycle journeys (`docs/adr/ADR-013-mailing-platform-and-campaign-automation.md`). Optimized for audience segmentation, drip sequences, and marketing content distributed via Amazon SES.

Both platforms are deployed on AWS ECS but serve different communication needs. Avoid mixing responsibilities to maintain clear unsubscribe pathways, consent handling, and operational ownership.

## Decision Checklist
1. **Trigger type**
   - *Immediate product event?* → Novu (supports real-time API triggers and inbox/toast surfaces).
   - *Scheduled nurture or batch marketing?* → Listmonk (cron-based campaigns and drip automation).
2. **Audience scope**
   - *Individual or small cohort tied to app interaction?* → Novu subscriber keyed by user ID/email.
   - *Segmented marketing list or large batch?* → Listmonk campaign segment.
3. **Consent source**
   - *Transactional/operational message covered by terms of service?* → Novu.
   - *Marketing opt-in required (GDPR/PECR)?* → Listmonk (tracks marketing consent & unsubscribe).
4. **Channel availability**
   - *Requires in-app inbox or toast fallback?* → Novu.
   - *Email-only with rich templates + A/B experiments?* → Listmonk.
5. **Analytics requirement**
   - *Needs per-event delivery telemetry in product dashboards?* → Novu OTel events + webhooks.
   - *Needs campaign metrics (opens, clicks, list growth)?* → Listmonk analytics.

## Canonical Examples
| Scenario | Platform | Reasoning |
| --- | --- | --- |
| User requests password reset | **Novu** | Transactional, immediate, per-user email with audit trail and in-app alert. |
| Subscription renews automatically | **Novu** | Operational notice tied to billing event; deliver email + inbox entry with telemetry. |
| New diagnostic result ready | **Novu** | Real-time product event requiring toast + inbox message directing to the result view. |
| Weekly Clarivum newsletter | **Listmonk** | Marketing content to opted-in subscribers with segmentation and scheduling. |
| Onboarding drip sequence (Day 0/3/7) | **Listmonk** | Timed lifecycle workflow managed via campaign automation. |
| Re-engage lapsed ebook purchasers (monthly) | **Listmonk** | Marketing outreach using suppression lists and performance reporting. |
| Legal policy update notice | **Novu** for transactional notice; **Listmonk** if sending supplemental marketing copy | Compliance-driven operational alert must reach every account (Novu). Optional marketing recap can piggyback via Listmonk. |
| Product launch announcement | **Listmonk** | Broad campaign with rich storytelling, metrics, and A/B testing. |

## Implementation Guidance
- **Novu workflows**
  - Trigger via `NotificationManager` or backend jobs.
  - Store subscriber identifiers derived from Supabase user IDs.
  - Log success/failure using `notification.delivered` telemetry for incident triage.
- **Listmonk campaigns**
  - Sync audiences nightly via `AudienceSyncManager`.
  - Use dedicated templates referencing localized legal copy.
  - Respect unsubscribe events pushed back to Supabase and Flagsmith.

## Escalation
- Routing ambiguity? Open a task tagged `notifications` and loop in UI Platform Manager + Platform Notifications Owner.
- Compliance question? Coordinate with Legal to confirm consent basis before sending.

## Related Runbooks
- `docs/runbooks/notifications.md` — Novu + Sonner operations.
- `docs/runbooks/mailing-operations.md` — Listmonk campaign management.
