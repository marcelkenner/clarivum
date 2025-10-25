---
id: TSK-FE-018
title: Integrate Monetization SDK Across Content Surfaces
status: backlog
area: frontend
subarea: monetization
owner: Frontend Engineer
collaborators:
  - Platform Engineer
  - Content Platform Lead
  - Partnerships Manager
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/PRDs/requierments/recommendations/feature-requirements.md
  - docs/PRDs/clarivum_brand.md
  - docs/runbooks/affiliate-ad-ops.md
context7:
  - /vercel/next.js
  - /plausible/docs
  - /flagsmith/docs
tags:
  - monetization
  - react
  - analytics
---

## Summary
Embed the monetization telemetry SDK across blogs, recommendation modules, coupon cards, and ad placements so impressions and clicks are logged before users leave Clarivum’s site.

## Scope
- Build reusable React server/client components for monetization placements (affiliate cards, inline ads, sidebar promos).
- Wire IntersectionObserver-based impression tracking and signed redirect URLs.
- Ensure consent gating, accessibility, and performance budgets stay within guardrails.
- Provide Storybook stories and design-system tokens for monetization units.

## Dependencies
- Platform monetization endpoints (`TSK-PLAT-043`) available in staging.
- Updated analytics event registry (ADR-029) with monetization events.
- Content components (cards, banners) ready for instrumentation (component library tasks).
- Flagsmith traits defined for throttling/throttled placements.

## Definition of Ready
- [ ] Placement inventory documented (blog inline, sidebar, recommendation CTA, hero banner).
- [ ] Design mocks approved (desktop, mobile) including disclosure text and fallback states.
- [ ] Copy & legal review complete for affiliate/ad labels.
- [ ] Performance targets confirmed (<1% CLS delta, <20 ms script execution).
- [ ] QA plan defined (Playwright scenarios, synthetic monitors).

## Definition of Done
- [ ] Monetization components emit impressions and clicks via SDK; consent gating verified.
- [ ] Redirect URLs generated client-side using signed payload from server; fallback banner handles errors gracefully.
- [ ] Storybook entries + MDX docs explain usage, props, and analytics expectations.
- [ ] Playwright tests cover article with multiple placements, ensuring unique event IDs and no duplicate logs.
- [ ] Accessibility audit passes (keyboard focus, ARIA labels, disclosure text).
- [ ] Documentation updates: `docs/runbooks/affiliate-ad-ops.md` (screenshots) and release notes for marketing/support.
- [ ] Monitoring dashboards show real traffic from staging smoke tests.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Work Plan
- [ ] **SDK Wiring** — Integrate `@clarivum/analytics` monetization helpers, add hooks for impression/click dispatch.
- [ ] **Components** — Build card/badge components with dynamic partner metadata from CMS.
- [ ] **Consent & Flags** — Ensure placements respect consent + Flagsmith toggles, including safe defaults.
- [ ] **Error Handling** — Implement fallback render for blocked partners / missing URLs.
- [ ] **Testing** — Storybook visual review, unit tests for event payload, Playwright for instrumented pages.
- [ ] **Docs & Handoff** — Update CMS authoring instructions and support macros.

## Out of Scope
- CMS authoring UI changes (handled by content platform).
- Partner creative production.
- Paid media landing page optimization (future sprint).
