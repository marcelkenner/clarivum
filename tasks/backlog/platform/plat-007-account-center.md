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
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/profile/feature-requirements.md
  - docs/adr/ADR-023-account-center.md
  - docs/policies/security-baseline.md
context7:
  - /supabase/supabase
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
- [ ] Confirm data contracts for subscriptions, diagnostics, recommendations, and mailing preferences.
- [ ] Security review scheduled for MFA + re-auth flows on sensitive actions.
- [ ] UX flows aligned with brand system and component library.
- [ ] Backlog of API endpoints and Supabase schema changes drafted.

## Definition of Done
- [ ] Profile APIs and Supabase tables implemented with RLS and auditing.
- [ ] Account center UI (overview, entitlements, preferences) delivered with responsive states.
- [ ] Data export/deletion requests automated and documented.
- [ ] Analytics + observability wired for key events and error paths.
- [ ] Runbooks and PRDs updated with rollout notes and support instructions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

