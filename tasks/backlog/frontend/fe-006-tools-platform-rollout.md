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
  - docs/PRDs/requierments/tools/skin/feature-requirements.md
  - docs/PRDs/requierments/tools/skin/planer_eksfolacji.md
  - docs/PRDs/requierments/tools/skin/ph_kompatybilnosc.md
  - docs/PRDs/requierments/tools/skin/budzet_rutyny.md
  - docs/PRDs/requierments/tools/skin/test_fitzpatrick.md
  - docs/PRDs/requierments/tools/skin/pilling_check.md
  - docs/PRDs/requierments/tools/skin/kalkulator_dawki_spf.md
  - docs/PRDs/requierments/tools/skin/komedogennosc_pomocnik.md
  - docs/PRDs/requierments/tools/skin/alergeny_zapachowe.md
  - docs/PRDs/requierments/tools/skin/interakcje_skladnikow.md
  - docs/PRDs/requierments/tools/skin/timer_reaplikacji.md
  - docs/PRDs/requierments/tools/skin/bpo_ubrania.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/planer_eksfolacji.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/ph_kompatybilnosc.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/budzet_rutyny.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/test_fitzpatrick.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/pilling_check.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/kalkulator_dawki_spf.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/komedogennosc_pomocnik.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/alergeny_zapachowe.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/interakcje_skladnikow.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/timer_reaplikacji.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/bpo_ubrania.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/feature-requirements.md
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
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
