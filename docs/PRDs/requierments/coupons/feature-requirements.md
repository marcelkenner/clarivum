# Feature Requirements — Mission-Gated Coupons

> **Canonical decision:** `docs/adr/ADR-026-coupons-and-affiliate-incentives.md` remains the source of truth for compliance, tracking, and partner contracts. This document narrows the scope to mission-driven unlocking of coupon codes.

## Objective
- Launch a mission system (`Misje`) that requires users to complete social amplification or referral tasks before revealing specific coupon codes.
- Turn coupon discovery into a repeatable engagement loop that scales word-of-mouth and content sharing for Clarivum.

## Target Outcomes
- Business: increase earned media reach, referral-driven ebook sales, and authenticated leads before a coupon is granted.
- Experience: provide a transparent mission checklist where users understand proof requirements, progress, and expected reward unlock timing.

## Primary Users & Segments
- Visitors motivated by discounts who are willing to perform light marketing actions (social sharing, referrals) to gain access.
- Segmentation axes: mission difficulty (single vs multi-day), user state (anonymous, logged-in, subscriber), reward type (coupon, bundle unlock, early access).

## Experience Principles
- Communicate the reward and mission steps upfront; no hidden conditions after commit.
- Evidence submission must be quick: upload or link to screenshots from mobile with responsive affordances.
- Reinforce trust with progress receipts, moderation status, and clear rejection messaging if evidence fails.

## Mission Catalogue
- **Mission A — `Posharuj 3 posty na story przez 3 dni pod rząd`:** Users share Clarivum-selected content on their stories three consecutive days and upload daily screenshots as proof. Unlocks a high-value coupon (e.g., 20% off flagship bundle).
- **Mission B — `Napisz o nas w social media`:** Users create an original post about Clarivum, submit the post URL plus screenshot, and accept guidelines covering brand tone and disclosures. Unlocks a medium-value coupon (e.g., free add-on or limited-time code).
- **Mission C — `Poleć nas 3 znajomym i doprowadź do zakupu e-booka`:** Users refer three friends who complete an ebook purchase without refund inside a tracking window. Proof requires uploading purchase confirmations (screenshots or receipt IDs) tied to referral codes. Unlocks an exclusive stacked coupon or loyalty credit.
- **Mission D — Expansion Pool:** Placeholder for future missions (e.g., UGC video, newsletter shoutout). CMS must support toggling missions with unique proof types and reward mapping.

## Mission Lifecycle
1. **Discover:** User browses `/misje` or the coupon hub and views available missions with reward previews and required proof.
2. **Commit:** User starts a mission (requires login) and receives mission checklist plus deadline (e.g., 3-day streak).
3. **Submit Proof:** User uploads screenshots/URLs through mission-specific forms. Forms enforce metadata (timestamp, platform, referral email).
4. **Moderate & Validate:** Automated heuristics (timestamp diff, duplicate detection) run first; operations team reviews flagged submissions.
5. **Unlock & Deliver:** Upon approval, coupon code and redemption instructions become visible and emailed. Mission status archived for auditing.

## Functional Requirements
- **FR1 — Mission Configuration Engine:** Marketing defines missions in Strapi with fields for eligibility, instructions, deadline rules, proof schema, reward mapping, and status (draft/live/retired).
- **FR2 — Progress Tracking:** Persist per-user mission state, including attempts, submitted evidence, moderation status, and unlock timestamps; expose via MissionViewModel to separate UI logic from mission state manager.
- **FR3 — Evidence Capture:** Support file uploads (screenshots), URL submission, and structured metadata (platform selector, referral emails). Enforce daily submission windows for streak missions like Mission A.
- **FR4 — Moderation Workflow:** Provide MissionModerationManager API for queueing evidence, marking approved/rejected, and notifying users with reason codes. Integrate with existing support tooling where possible.
- **FR5 — Reward Unlock Pipeline:** On approval, MissionRewardCoordinator releases the coupon, logs audit trail, sends notification (email + in-app), and exposes redemption instructions.
- **FR6 — Fraud & Compliance Guards:** Detect duplicate social URLs, reused screenshots, or referral loops. Block suspicious accounts and surface manual review flags.
- **FR7 — Localization & Copy Control:** Missions support Polish and English copy, including CTA verbs, instructions, and rejection messages; marketing can update copy without redeploy.

## Content & Data Inputs
- Missions stored in Strapi with modular components for instructions, proof requirements, and reward descriptors.
- Evidence assets stored in S3-compatible bucket with signed URL access; metadata persisted in database for audit trails.
- Referral validation relies on ecommerce order IDs, payment status (non-refunded), and referral codes mapped via SubscriptionManager.

## Mission Evidence Policies
- Screenshots must show timestamp and username where possible; upload form educates users on capturing valid proof.
- Social links validated by scraping share counts or OpenGraph metadata when available; fall back to manual check queue.
- Referral purchases reconciled nightly against Flagsmith-controlled feature flag that toggles mission open/closed based on partner bandwidth.

## Integrations & Dependencies
- **Internal:** Authentication for mission enrollment, Profile service for identity, Notifications for email/Push, Analytics pipeline for mission tracking, Support tooling for moderation queue.
- **External:** Social platform link previews (read-only), payment provider or ecommerce backend for referral verification, optional automation with Zapier/Make for moderation triage.

## Analytics & KPIs
- Mission start rate vs completion rate per mission.
- Average time to submit valid evidence and approval turnaround SLA.
- Earned reach: story shares count, social mentions, referral purchases attributed.
- Coupon unlock-to-redemption conversion and downstream revenue lift.

## Non-Functional Requirements
- Mission gallery and detail pages must meet performance budget (LCP ≤ 2.5 s) with progressively loaded evidence history.
- File uploads limited to secure formats (PNG, JPG, PDF) with AV scanning and size cap (≤ 10 MB).
- Audit logs retained for 12 months for compliance reviews.

## Compliance, Moderation & Access Control
- Display disclosure guidance for social posts (e.g., #współpraca z Clarivum). Users must confirm compliance before submission.
- Ensure GDPR alignment: users can request deletion of evidence; system redacts personal data after mission closure while retaining aggregate metrics.
- Role-based access: Marketing configures missions, Operations moderates, Engineering manages MissionRewardCoordinator and integrations, Legal approves template copy.

## Launch Readiness Checklist
- Mission definitions QAed with at least one dry-run per mission (mock social posts, purchase referrals).
- Evidence moderation playbook published in support knowledge base with escalation contacts.
- `docs/runbooks/mission-moderation.md`, `docs/runbooks/feature-flags-operations.md`, and `docs/runbooks/background-jobs.md` walk-through completed with Ops and engineering owners.
- Notifications tested end-to-end (start, submission received, approval, rejection).
- Analytics dashboards (Looker or Supabase) prepared to monitor mission funnel and evidence rejection reasons.
- Customer support scripting updated to handle mission FAQs, appeals, and technical issues.

## Open Questions & Assumptions
- Decide between automated social verification (API scraping) versus manual moderation for MVP.
- Determine if Mission C referrals require integration with payment provider webhook or manual upload suffices initially.
- Clarify whether users can work on multiple missions in parallel or must finish sequentially.
- Assume login/account creation is mandatory before mission start; anonymous users see teaser but not unlock flow.
