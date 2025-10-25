---
id: TSK-FE-010
title: Implement Hero UV Widget Experience
status: backlog
area: frontend
subarea: homepage
owner: Frontend Engineer
collaborators:
  - Platform Engineer
  - QA Lead
effort: medium
created_at: 2025-10-23
updated_at: 2025-10-23
links:
  - docs/PRDs/requierments/homepage/feature-requirements.md
  - docs/PRDs/requierments/tools/widget_indeks_uv.md
  - docs/adr/ADR-019-frontend-platform.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
context7:
  - /vercel/next.js
  - /tailwindcss/tailwindcss
  - /tanstack/react-query
tags:
  - homepage
  - tools
  - personalization
---

## Summary
Deliver the hero UV widget UI and ViewModel so visitors immediately see their UV status, understand the Warsaw fallback, and can launch related SPF tools without leaving the homepage.

## Definition of Ready
- [ ] Copy blocks and risk messaging published in Strapi for PL/EN.
- [ ] Feature flag `tools.uv_widget.enabled` configured with rollout plan.
- [ ] Confirm accessible focus order and keyboard interactions with design.
- [ ] Validate API contract with platform (`/api/tools/uv-widget`).

## Definition of Done
- [ ] Hero module renders UV badge, risk copy, fallback banner, and SPF CTAs per spec.
- [ ] Geolocation consent modal and manual city selector implemented with analytics instrumentation.
- [ ] Local storage caching (30 min) and optimistic refresh UX completed with tests.
- [ ] UI meets WCAG 2.2 AA (focus states, announcements, color contrast).
- [ ] Storybook scenario and screenshot tests added for high/low UV states.
- [ ] Playbook entry created for content editors on updating Strapi copy.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

