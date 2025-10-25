---
id: TSK-FE-013
title: Implement Habits Tool Blueprints
status: backlog
area: frontend
subarea: habits-tools
owner: Frontend Engineer (Habits Pod)
collaborators:
  - Habits Product Manager
  - Behavioral Science Lead
  - Content Strategist
effort: medium
created_at: 2025-02-16
updated_at: 2025-02-16
links:
  - docs/PRDs/requierments/tools/habits/narzedzia/alkohol_a_sen_symulator.md
  - docs/PRDs/requierments/tools/habits/narzedzia/checklista_sypialni.md
  - docs/PRDs/requierments/tools/habits/narzedzia/chronotyp_screener.md
  - docs/PRDs/requierments/tools/habits/narzedzia/digital_sunset_planer.md
  - docs/PRDs/requierments/tools/habits/narzedzia/dziennik_kofeiny.md
  - docs/PRDs/requierments/tools/habits/narzedzia/dziennik_nastroju_niedyagnostyczny.md
  - docs/PRDs/requierments/tools/habits/narzedzia/indeks_regularnosci_snu.md
  - docs/PRDs/requierments/tools/habits/narzedzia/jet_lag_planer.md
  - docs/PRDs/requierments/tools/habits/narzedzia/kalkulator_bialka_i_blonika.md
  - docs/PRDs/requierments/tools/habits/narzedzia/kalkulator_hydratacji.md
  - docs/PRDs/requierments/tools/habits/narzedzia/kalkulator_stania_vs_siedzenia.md
  - docs/PRDs/requierments/tools/habits/narzedzia/monitor_cisnienia_niedyagnostyczny.md
  - docs/PRDs/requierments/tools/habits/narzedzia/ocena_ergonomii_stanowiska.md
  - docs/PRDs/requierments/tools/habits/narzedzia/okno_zywieniowe_planer.md
  - docs/PRDs/requierments/tools/habits/narzedzia/planer_drzemek.md
  - docs/PRDs/requierments/tools/habits/narzedzia/przygotowanie_do_badan_laboratoryjnych.md
  - docs/PRDs/requierments/tools/habits/narzedzia/raport_tygodniowy_zdrowia.md
  - docs/PRDs/requierments/tools/habits/narzedzia/skala_sennosci_subiektywna.md
  - docs/PRDs/requierments/tools/habits/narzedzia/social_jetlag_kalkulator.md
  - docs/PRDs/requierments/tools/habits/narzedzia/timer_mikroprzerw.md
  - docs/PRDs/requierments/tools/habits/narzedzia/trener_oddechu.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-019-frontend-platform.md
  - docs/adr/ADR-029-plausible-analytics-platform.md
  - docs/adr/ADR-008-product-analytics-platform.md
context7:
  - /vercel/next.js
  - /supabase/supabase
  - /plausible/docs
  - /flagsmith/docs
tags:
  - habits
  - tools
  - calculators
---

## Summary
Build the Habits vertical tool suite using the shared tool shell, computation managers, and analytics instrumentation so every experience delivers reusable, localized guidance with minimal engineering overhead.

## Definition of Ready
- [ ] Confirm behavioral science success metrics, guardrails, and copy tone for each scoped tool.
- [ ] Align interaction design with component library and accessibility baseline (ADR-018, ADR-027).
- [ ] Define analytics events for diagnostics and follow-up flows, capturing event schemas per ADR-029 while documenting ADR-008 deprecations.
- [ ] Map integrations (e.g., Supabase profile traits, external APIs) and fallback strategies.
- [ ] Ensure localization, consent copy, and medical disclaimers are prepared for release.

## Definition of Done
- [ ] ToolShell view models, managers, and localization scaffolding implemented per ADR-022 with dependency injection.
- [ ] Tools satisfy WCAG AA, performance budgets, and resilience requirements defined in the PRDs.
- [ ] Analytics events validated in Plausible; legacy PostHog hooks removed and documented.
- [ ] User education content, disclaimers, and follow-up CTAs wired via CMS where specified.
- [ ] Future enhancements and research follow-ups logged for subsequent iterations.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

