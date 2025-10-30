---
id: TSK-PLAT-007
title: Build Customer Account Center Service
status: backlog
area: platform
subarea: account-center
owner: Platform Engineer
collaborators:
  - Backend Engineer
  - Frontend Engineer
  - Privacy Officer
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/profile/feature-requirements.md
  - docs/adr/ADR-023-account-center.md
  - docs/policies/security-baseline.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /auth0/docs
  - /stripe/stripe
tags:
  - profile
  - privacy
  - account
---

## Summary
Deliver the authenticated account center with entitlements, diagnostics history, and preference management so customers can self-serve while Clarivum maintains GDPR compliance.

## Definition of Ready
- [x] Data contracts confirmed: read models aggregating subscriptions (Stripe→Aurora), diagnostics (Ops Hub), recommendations engine, and mailing prefs (Listmonk) with versioned `v1` DTOs.
- [x] Security review set: enforce re-auth via Auth0 `max_age`/`prompt=login`, require MFA for sensitive actions, review scheduled with Security owned by Platform Lead.
- [x] UX flows aligned: follow component library for profile edit, password reset, billing portal, downloads, data export/delete.
- [x] API backlog drafted: endpoints `GET /me`, `GET /me/subscriptions`, `POST /me/export`, `POST /me/delete`, `GET /me/downloads` plus Aurora migrations for `mailing_preferences` and `entitlement_views`.

## Definition of Done
- [ ] Profile APIs and Aurora tables implemented with RLS and auditing.
- [ ] Account center UI (overview, entitlements, preferences) delivered with responsive states.
- [ ] Data export/deletion requests automated and documented.
- [ ] Analytics + observability wired for key events and error paths.
- [ ] Runbooks and PRDs updated with rollout notes and support instructions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
