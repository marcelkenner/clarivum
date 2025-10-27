# Feature Requirements — Fuel Tool: Kalkulator Nawodnienia & Elektrolitów

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Hydration Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide personalized hydration and electrolyte guidance based on activity, environment, and dietary factors.
- Drive engagement with batch cooking, meal planning, and supplement recommendations.

## Target Outcomes
- Business: Increase hydration-focused content downloads by 12%; convert 15% of tool users to electrolyte guide newsletter.
- Experience: Accuracy validated against sports nutrition standards; satisfaction ≥4.4/5.

## Primary Users & Segments
- Recreational athletes and gym-goers.
- Busy professionals tracking hydration to improve energy.
- Individuals reducing sodium or managing high blood pressure.

## Experience Principles
- Keep recommendations actionable with per-day and per-activity breakdown.
- Offer nuance: climate, sweat rate, caffeine/alcohol impact.
- Provide hydration reminders and safe upper limits to prevent overconsumption.

## Functional Requirements

### FR1 — Input Collection
- Required: body weight (kg), biological sex, typical daily activity (sedentary, light, moderate, intense), goal (`hydration_baseline`, `training_day`, `hot_weather`).
- Optional: workout duration (min), intensity, sweat rate (ml/hr known?), environment temperature & humidity, caffeine and alcohol intake, sodium restriction status.
- Allow manual entry for previous day's fluid consumption for context.

### FR2 — Hydration Calculation
- Baseline fluid: `35 ml * bodyWeight` (general guideline) with adjustments:
    - Sedentary: multiply by 30 ml/kg, moderate 35 ml/kg, intense 40 ml/kg.
    - Add 500 ml for each 30 min of vigorous exercise.
    - Increase by 10% if temperature >26°C or humidity >60%.
- Cap recommendation to 70 ml/kg to avoid hyponatremia; show caution note.
- Provide schedule suggestions (morning, pre-meal, pre/post workout).

### FR3 — Electrolyte Calculation
- Sodium recommendation:
    - Baseline: 1500–2300 mg/day (dependent on health flags).
    - During exercise: add `sweat_rate_ml * sodium_loss_mg_per_l / 1000`. Default sodium loss 900 mg/L; allow override.
- Potassium: 3500–4700 mg/day; highlight high-potassium food suggestions.
- Magnesium: 310–420 mg/day based on sex.
- Provide hydration beverage guidance (water vs electrolyte drink) with portion sizes.

### FR4 — UI & Coaching
- Dashboard summarizing daily water target, electrolyte targets, schedule.
- Provide tips block: e.g., “Dodaj szczyptę soli do posiłku po treningu”.
- Link to smart substitutions for high-electrolyte foods and to caffeine calculator for adjustments.
- Provide export (PDF) and add to daily reminders (notifications).

### FR5 — Reminders & Logging
- Users can log actual fluid intake; display compliance gauge.
- Offer push/email reminders triggered at configurable intervals.
- Sync with Monitor Cukier & Sód to avoid conflicting sodium guidance.

## Content & Data Inputs
- Guidelines stored in `hydration_rules` config, reviewed quarterly.
- Ingredient suggestions from substitution dataset & meal plans.
- Localization via Strapi; disclaimers for renal/cardiac conditions.

## Integrations & Dependencies
- Profile service stores hydration targets/logs.
- Notifications Manager handles reminders.
- Caffeine and alcohol calculators share consumption data to adjust hydration.

## Analytics & KPIs
- Events: `hydration_tool_open`, `target_calculated`, `intake_logged`, `reminder_set`, `food_swap_clicked`.
- KPI: Reminder opt-in ≥35%; logged hydration compliance improvement 10% after 2 weeks.

## Non-Functional Requirements
- Calculations executed client-side; ensure rounding to 50 ml increments.
- Provide offline-ready log with sync once online.
- Accessible UI with large touch targets and textual descriptions.

## Compliance & Access Control
- Display medical disclaimer (kidney, heart conditions).
- Sensitive hydration logs stored encrypted; allow deletion.
- Admin changes to rules require dual approval.

## Launch Readiness Checklist
- Validate calculations against sports nutrition references.
- QA integration with reminders and other calculators.
- Update `/fuel/tematy/nawodnienie/` content with tool CTA.

## Open Questions & Assumptions
- Integration with wearable sweat rate sensors? (future).
- Need to define approach for multiple workouts per day (v2).
