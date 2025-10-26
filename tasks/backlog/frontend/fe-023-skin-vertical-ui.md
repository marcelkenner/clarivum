---
id: TSK-FE-023
title: Deliver Skin Vertical UI Modules
status: backlog
area: frontend
subarea: skin
owner: Frontend Engineer (Skin Pod)
collaborators:
  - Design Lead
  - Content Strategist
  - QA Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/requierments/ascii_designs.md
  - docs/adr/ADR-018-brand-design-system.md
context7:
  - /vercel/next.js
  - /tailwindlabs/tailwindcss
tags:
  - skin
  - ui
---

## Summary
Polish the Skin vertical experience (hub, category hubs, article shell) using the ASCII blueprint: add hero media, CTA shelves, diagnostics embeds, and analytics hooks so Skin can launch externally without relying on placeholder copy.

## Definition of Ready
- [ ] Final Skin copy + CTA text approved (content/taxonomy JSON updated).
- [ ] Asset specs (hero, cards, diagnostics) delivered by design.
- [ ] Analytics + feature-flag requirements documented (events, props, Flagsmith keys).

## Definition of Done
- [ ] Implement Skin hero + CTA blocks per ASCII spec (hero, routines shelf, diagnostics rail).
- [ ] Category hub templates render Strapi content + tool embeds with responsive + accessible layouts.
- [ ] Article page exposes structured data + shareable metadata (Open Graph, JSON-LD).
- [ ] Tests: unit coverage for Skin ViewModels + Playwright smoke covering one hub + one article.
- [ ] Docs updated (docs/architecture.md + relevant AGENTS.md) with Skin-specific extension points.
- [ ] Acceptance: README/AGENTS/ADR citations refreshed; guardrail logged in Kaizen board.

## Notes
Coordinate with TSK-FE-021 for live content and with QA for assistive-tech scenarios (macOS VoiceOver + NVDA).
