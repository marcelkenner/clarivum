---
id: TSK-FE-012
title: Implement Fuel Tool Blueprints
status: backlog
area: frontend
subarea: fuel-tools
owner: Frontend Engineer (Fuel Pod)
collaborators:
  - Fuel Product Manager
  - Nutrition Science Lead
  - Content Strategist
effort: medium
created_at: 2025-02-16
updated_at: 2025-02-16
links:
  - docs/PRDs/requierments/tools/fuel/narzedzia/analiza_etykiety.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/analiza_mikroskladnikow.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/baza_indeks_gi_i_zamienniki.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/cel_bialko_i_blonnik.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/cel_waga_na_bf.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/generator_jadlospisu.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalendarz_sezonowosci.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_alkohol_kalorie_bac.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_bezpieczna_kofeina.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_bmi_whr_whtr.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_kcal_bmr_tdee.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_nawodnienia_elektrolitow.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_stref_tetna_karvonen.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_tkanki_tluszczowej_us_navy.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/kalkulator_wydatkow_zywnosci.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/konwerter_jednostek_kuchnia.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/ladunek_glikemiczny.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/monitor_cukier_sod.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/plan_utrata_przyrost_masy.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/planer_batch_cooking.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/planer_lista_zakupow_z_budzete.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/planer_post_przerywany.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/podzial_makroskladnikow.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/profil_sportowy_makro.md
  - docs/PRDs/requierments/tools/fuel/narzedzia/smart_zamienniki_produktow.md
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
  - fuel
  - tools
  - calculators
---

## Summary
Deliver reusable blueprints for all Clarivum Fuel calculators and planners so every tool ships with shared shell, computation managers, copy hooks, analytics, and localization from day one.

## Definition of Ready
- [ ] Computation formulas, inputs, and guardrails confirmed with Nutrition Science for each scoped tool.
- [ ] Design system alignment complete (component library selections, mobile layouts) per ADR-018/ADR-027.
- [ ] Analytics plan finalized (Plausible events mapped, PostHog retirements cataloged) with tracking plan updates.
- [ ] Localization and legal review scheduled (translations, FTC-compliant disclaimers, copy approvals).
- [ ] Data sources and fallbacks validated (internal datasets vs external APIs, caching/timeout strategy documented).

## Definition of Done
- [ ] ToolShell view models and computation managers implemented per ADR-022 with dependency injection for data providers.
- [ ] Each tool meets WCAG AA, includes localization hooks, and persists user context where allowed.
- [ ] Plausible analytics events instrumented and QA’d; PostHog code paths removed.
- [ ] Documentation updated in PRDs with any implementation nuances or deviations.
- [ ] Follow-up tickets created for future enhancements, experiments, or API integrations.
- [ ] Blueprint exposes slots for affiliate CTA cards (per ADR-033) and ebook funnel CTAs so `analiza-etykiety`, `smart-zamienniki`, and macro/protein/Fuel planners can wire commerce + ebook offers without bespoke code.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
