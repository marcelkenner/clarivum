---
id: TSK-FE-006
title: Roll Out Tools & Calculators Platform
status: backlog
area: frontend
subarea: tools
owner: Frontend Engineer
collaborators:
  - Platform Engineer
  - Content Strategist
  - QA Lead
effort: large
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/tools/feature-requirements.md
  - docs/PRDs/requierments/tools/planer_eksfolacji.md
  - docs/PRDs/requierments/tools/ph_kompatybilnosc.md
  - docs/PRDs/requierments/tools/budzet_rutyny.md
  - docs/PRDs/requierments/tools/test_fitzpatrick.md
  - docs/PRDs/requierments/tools/pilling_check.md
  - docs/PRDs/requierments/tools/kalkulator_dawki_spf.md
  - docs/PRDs/requierments/tools/komedogennosc_pomocnik.md
  - docs/PRDs/requierments/tools/alergeny_zapachowe.md
  - docs/PRDs/requierments/tools/interakcje_skladnikow.md
  - docs/PRDs/requierments/tools/timer_reaplikacji.md
  - docs/PRDs/requierments/tools/bpo_ubrania.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-020-form-engine.md
  - docs/adr/ADR-019-frontend-platform.md
context7:
  - /react-hook-form/react-hook-form
  - /supabase/supabase
  - /plausible/docs
tags:
  - tools
  - calculators
  - forms
---

## Summary
Implement the shared tools platform along with the initial calculator portfolio so Clarivum can deliver interactive value across Skin, Fuel, and Habits verticals with consistent UX, analytics, and compliance.

## Definition of Ready
- [ ] Prioritize launch order and success metrics for initial tool set with product.
- [ ] Align data requirements (inputs, scoring, result copy) with content and backend teams.
- [ ] Finalize form patterns, validation, and telemetry hooks based on ADR-020.
- [ ] Establish QA plan (unit tests, Playwright scenarios) for each tool variant.

## Definition of Done
- [ ] ToolShell + shared components shipped with theming and accessibility coverage.
- [ ] All scoped tools implemented with Plausible analytics (ADR-029), localization, and consent handling.
- [ ] Server integrations (Supabase, external APIs) operational where required.
- [ ] Documentation updated (PRDs annotated, runbooks, Storybook stories).
- [ ] Backlog captured for iterative improvements and future tool ideas.
