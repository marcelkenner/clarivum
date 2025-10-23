# Mission Moderation Runbook

> Derived from `docs/PRDs/requierments/coupons/feature-requirements.md`. Use this guide to process user submissions that unlock mission-gated coupons.

## Purpose
- Provide a precise, repeatable flow for validating evidence, preventing fraud, and issuing mission rewards.
- Document tooling, SLAs, and escalation paths for the Operations & Support teams.

## Preconditions
- Mission definitions published in Strapi with moderation toggled to `active`.
- MissionModerationManager console accessible via internal SSO.
- Notifications service status green (`/status/notifications` dashboard).
- Shift schedule confirmed; at least one primary and one backup moderator online.

## Tooling & Data Sources
- MissionModerationManager: centralized queue for all mission submissions with filters by mission, status, and risk score.
- Evidence Storage Viewer: signed link browser for uploaded screenshots and receipts.
- Analytics Dashboard (`Looker → Missions / Funnel`): monitors submission inflow, approval rate, SLA breaches.
- Support CRM (Intercom): handles user communication and tracks reopened cases.
- Slack `#clarivum-missions` channel: broadcast approvals/rejections, coordinate escalations.

## Shift Checklist
1. Confirm uptime of MissionModerationManager and Evidence Storage Viewer; notify Engineering if degraded.
2. Review `Analytics Dashboard` SLA widget for pending submissions older than 12 hours.
3. Announce availability in `#clarivum-missions` with shift window and coverage partner.
4. Load moderation queue filtered by mission priority (Mission C > Mission A > Mission B by default).

## Moderation Workflow
### 1. Intake & Prioritization
- Sort queue by SLA breach risk; items with `Risk Score ≥ 70` require senior moderator.
- Verify mission deadline; auto-expired submissions move to `Expired` bucket—no manual action required.

### 2. Evidence Review
- For each submission, open evidence carousel and metadata side panel.
- Cross-check submission timestamp against mission rules (e.g., Mission A requires 24-hour spacing).
- Validate identity: username in screenshot must match user profile alias; discrepancies trigger rejection.
- Mission-specific checks:
  - Mission A: Ensure three sequential days documented; look for identical screenshots (flag duplicates).
  - Mission B: Confirm post URL loads, contains Clarivum mention, and disclosure (e.g., `#współpraca`).
  - Mission C: Match purchase receipts to referral codes; confirm order status `completed` and `refund=false`.

### 3. Decision & Documentation
- Approve when all mission criteria met; add short note (`Approved — Mission A — streak verified 2025-02-18`).
- Reject with reason code:
  - `EVIDENCE_INCOMPLETE`
  - `DISCLOSURE_MISSING`
  - `REFERRAL_UNVERIFIED`
  - `DUPLICATE_SUBMISSION`
- Attach remediation tips for user; templates in “User Messaging” section.
- For ambiguous cases, use `Needs Escalation` status and ping on-call lead.

### 4. Reward Release
- Upon approval, MissionRewardCoordinator auto-triggers coupon reveal and email.
- Confirm notification status shows `sent`; if `pending > 15 min`, rerun dispatch via console.
- Update ticket in Support CRM with final status, coupon code, and timestamp.

### 5. Post-Review Logging
- Tag submissions requiring product follow-up (e.g., repeated disclosure issues) with `needs-guidance`.
- Log fraudulent patterns in `Fraud Ledger` shared spreadsheet for weekly review.

## User Messaging Templates
- **Approval:**
  ```
  Cześć {name}! 🎉 Twoja misja {mission_name} została zatwierdzona. Kod rabatowy: {coupon_code}. Znajdziesz instrukcje realizacji w swoim profilu Clarivum. Dzięki za szerzenie informacji!
  ```
- **Evidence Incomplete:**
  ```
  Cześć {name}, dzięki za zgłoszenie misji {mission_name}. Niestety dowód nie spełnia wymogów (brakuje {missing_detail}). Prosimy o uzupełnienie i ponowną wysyłkę przed {deadline}.
  ```
- **Disclosure Missing (Mission B):**
  ```
  Hej {name}, widzimy post o Clarivum, ale nie ma wymaganej informacji o współpracy (#współpraca z Clarivum). Dodaj oznaczenie i prześlij zaktualizowany zrzut ekranu – wtedy szybko zatwierdzimy misję.
  ```
- **Referral Unverified (Mission C):**
  ```
  Cześć {name}, nie możemy dopasować przesłanego potwierdzenia zakupu do kodu polecenia {referral_code}. Podeślij proszę zrzut ekranu z numerem zamówienia lub poproś znajomego o przesłanie potwierdzenia PDF.
  ```

## Escalation Matrix
- Level 1: On-duty moderator (resolve within 12h).
- Level 2: Senior moderator (`@missions-lead` in Slack) for disputes, poisoned content, or high-risk duplicates.
- Level 3: Engineering on-call (`@mission-stack-oncall`) for tooling failures, stuck notifications, or data mismatch.
- Legal escalation (`legal@clarivum.com`) required if social content lacks required disclosures after second warning.

## SLA & Reporting
- SLA: 12h for standard submissions, 4h for Mission C high-value referrals.
- Daily report posted to `#clarivum-missions` at 18:00 CET covering:
  - Total submissions / approvals / rejections
  - Average handling time by mission
  - Top rejection reasons
  - Outstanding escalations

## Audit & Data Retention
- Evidence retained 12 months; moderators must not download locally.
- Use `Export Audit` button weekly to archive decision logs to compliance storage.
- When users request GDPR deletion, flag submission `pending-erasure`; Engineering processes purge and returns confirmation.

## Runbook Maintenance
- Review monthly after sprint retro; update templates and risk scoring rules as missions evolve.
- Link any tooling changes back to `docs/adr/ADR-026-coupons-and-affiliate-incentives.md`.
