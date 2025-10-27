---
id: TSK-FE-024
title: Deliver Fuel Vertical UI Modules
status: backlog
area: frontend
subarea: fuel
owner: Frontend Engineer (Fuel Pod)
collaborators:
  - Design Lead
  - Analytics Lead
  - QA Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/requierments/tools/skin/feature-requirements.md
  - docs/adr/ADR-018-brand-design-system.md
context7:
  - /vercel/next.js
  - /tailwindlabs/tailwindcss
tags:
  - fuel
  - ui
---

## Summary
Implement the Fuel hub/category/article UI with calculator slots, macro tips, and budget callouts so visitors can jump directly into tools and ebooks tailored for nutrition workflows.

## Definition of Ready
- [ ] Performance budgets + Core Web Vitals targets reviewed with Platform.
- [ ] Tool/card specs finalized (states, data contract, fallback behavior).
- [ ] Analytics events + monetization flags documented (Plausible + Flagsmith IDs).

## Definition of Done
- [ ] Fuel hub hero renders ASCII layout (hero, macro strip, calculator CTA) with data from Strapi loaders.
- [ ] Category page surfaces tool embeds + CTA rails for ebooks (primary + secondary) with responsive grid.
- [ ] Article page includes monetization slot placeholders and instrumentation hooks (per ADR-033 when ready).
- [ ] Tests: unit coverage for Fuel ViewModels + e2e smoke for at least one tool CTA to ensure conversions.
- [ ] Docs updated (docs/architecture.md + AGENTS.md) to explain how to extend Fuel components.
- [ ] Acceptance: README/AGENTS/ADR references updated, Kaizen guardrail recorded.

## Notes
Re-use calculators from the tools platform; avoid duplicating logic inside components.
