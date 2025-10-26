---
id: TSK-FE-025
title: Deliver Habits Vertical UI Modules
status: backlog
area: frontend
subarea: habits
owner: Frontend Engineer (Habits Pod)
collaborators:
  - Design Lead
  - Product Manager
  - QA Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-25
links:
  - docs/PRDs/first_configuration.md
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-018-brand-design-system.md
context7:
  - /vercel/next.js
  - /tailwindlabs/tailwindcss
tags:
  - habits
  - ui
---

## Summary
Complete the Habits UI (hub, category, article) with cadence trackers, Forest Day prompts, and Kaizen guardrail callouts so the seasonal focus (Metsa cadence) is visible across the experience.

## Definition of Ready
- [ ] Forest Day + Kaizen content blocks approved and linked to PRDs/runbooks.
- [ ] Accessibility plan drafted for focus/focus-visible patterns and keyboard shortcuts.
- [ ] Telemetry + task logging requirements documented (flow + sustainability metrics).

## Definition of Done
- [ ] Habits hub shows cadence timeline component, guardrail CTA, and seasonal callouts.
- [ ] Category hub wires Strapi content with checklists + habit tracker component placeholders.
- [ ] Article layout supports embedding Ops Hub tasks + Kaizen logs with metadata + structured data.
- [ ] Tests: unit tests for new components + Playwright smoke verifying CTA flow + accessibility expectations (skip links, headings).
- [ ] Docs updated (docs/architecture.md, docs/runbooks/continuous-improvement) to describe Habits modules.
- [ ] Acceptance: README/AGENTS/ADR notes updated, guardrail logged.

## Notes
Ensure copy references the daily "6+1" rhythm and deep-work guardrails defined in AGENTS.md.
