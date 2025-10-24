---
id: TSK-FE-017
title: Ship Account Center Entitlement Shelf
status: backlog
area: frontend
subarea: account-center
owner: Frontend Engineer
collaborators:
  - Platform Engineer
  - Product Designer
  - Support Ops Lead
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/adr/ADR-032-guest-entitlements-and-account-claiming.md
  - docs/PRDs/requierments/profile/feature-requirements.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/diagrams/adr-032-guest-entitlements-and-account-claiming/uml-components.mmd
context7:
  - /vercel/next.js
  - /supabase/supabase
  - /auth0/docs
tags:
  - account-center
  - entitlements
  - react
---

## Summary
Design and implement the Account Center entitlement shelf with downloadable cards, status indicators, and claim prompts so users can self-serve ebook access across devices.

## Scope
- Server components/server actions powering entitlement fetch + signed URL requests.
- Reusable card, filter bar, empty state, and banner components within Account Center layout.
- Integration with telemetry, analytics, and accessibility patterns defined in ADR-019.
- Copywriting and localization hooks for status, prompts, and date formatting.

## Dependencies
- Platform claim workflow (`TSK-PLAT-041`) must expose finalized API contract.
- Account Center navigation shell available (from `TSK-PLAT-007`/`TSK-FE-002`).
- Design tokens & card patterns ready from component library work.
- Supabase policies verified for shelf endpoints.

## Definition of Ready
- [ ] UX mockups approved (desktop + mobile) including empty state, pending-claim prompt, and filter interactions.
- [ ] API contract for `GET /api/account/entitlements` documented with sample payloads.
- [ ] Copy reviewed for status badges, empty state guidance, and claim CTA.
- [ ] Accessibility acceptance criteria defined (keyboard navigation, focus management, screen reader labels).
- [ ] Performance budget defined (initial load ≤1.5 s on broadband).
- [ ] QA test plan drafted (Playwright flows, visual regression scenes).

## Definition of Done
- [ ] Entitlement shelf route renders cards with format badges, last download timestamp, and download/resend actions.
- [ ] Filters (`All`, `In progress`, `Archived`) and search work with optimistic updates and skeleton loading.
- [ ] Pending-claim entitlements show banner + CTA linking to claim flow; empty state directs users to purchase catalog.
- [ ] Telemetry events emitted (`entitlement.download_click`, `entitlement.resend_click`, `entitlement.claim_prompt_view`).
- [ ] Storybook coverage and integration tests (Playwright) verify accessible navigation and signed URL handling.
- [ ] Documentation updated in `docs/runbooks/account-claiming.md` (screenshots, helper text) and release notes prepared.
- [ ] Lighthouse accessibility and performance scores ≥90 for shelf route in staging.
- [ ] Translations or pseudo-localization tested for dynamic strings (if localization toggled on).

## Work Plan
- [ ] **Data Layer** — Implement server action to fetch entitlements, normalize status, and hydrate view model.
- [ ] **UI Components** — Build card, filter bar, empty states, claim banner, skeleton loaders using design tokens.
- [ ] **Interactions** — Wire download/resend buttons with optimistic feedback, error handling, and telemetry.
- [ ] **Accessibility** — Validate focus order, aria-live for feedback, keyboard shortcuts; add unit tests where needed.
- [ ] **Testing** — Add Storybook stories (light/dark), unit tests for view model, Playwright scenarios (has entitlements, pending claim, empty).
- [ ] **Docs & Handoff** — Capture screenshots, update runbook and release notes, schedule support walkthrough.

## Out of Scope
- Mobile native app views (web responsive only).
- Guest checkout success page messaging (handled by platform task).
- Payment history or subscription UI; focus on digital product entitlements.
