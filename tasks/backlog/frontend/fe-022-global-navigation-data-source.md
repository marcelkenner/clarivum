---
id: TSK-FE-022
title: Build Global Navigation & Footer Data Source
status: backlog
area: frontend
subarea: navigation
owner: Frontend Engineer
collaborators:
  - Design Lead
  - Content Strategist
effort: small
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/PRDs/clarivum_brand.md
  - docs/PRDs/requierments/ascii_designs.md
  - docs/adr/ADR-019-frontend-platform.md
context7:
  - /vercel/next.js
tags:
  - navigation
  - design-system
---

## Summary
Extract the marketing + vertical navigation (header, footer, skip links) from the hard-coded layout into a data-driven module so brand, ops, and seasonal CTAs can update copy/links without touching React files.

## Definition of Ready
- [ ] Final nav/footer copy documented in Figma/exported ASCII designs.
- [ ] Ownership defined for nav data (marketing vs. ops) and storage format (JSON, Strapi, Flagsmith).
- [ ] Accessibility review scheduled (skip links, focus outline, keyboard order).

## Definition of Done
- [ ] Create `NavigationDataSource` that feeds `src/app/(marketing)/layout.tsx` and the vertical layouts through dependency injection.
- [ ] Footer uses structured data (legal links, social, CTA) read from config with locale-ready fields.
- [ ] Add regression tests (unit + visual snapshot or Storybook story) covering nav links + skip link focus.
- [ ] Update docs (`docs/architecture.md` + `src/app/AGENTS.md`) to explain how to extend nav slots per season/Metsa cadence.
- [ ] Acceptance: README/AGENTS/ADR citations updated, guardrail logged in Kaizen Minute.

## Notes
- Keep nav payload under 4KB so it can be streamed inline without blocking `next/script`.
