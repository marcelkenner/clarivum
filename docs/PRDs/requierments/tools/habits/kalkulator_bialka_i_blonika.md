# Feature Requirements — Habits Tool: Kalkulator Białka i Błonnika (Habits)

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Science reviewer: Nutrition Science Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide daily protein and fiber targets optimized for sleep quality, stress resilience, and circadian rhythm support.
- Complement the Fuel pillar calculator while focusing on timing and evening digestion.

## Target Outcomes
- Business: Increase cross-pillar engagement (Fuel ↔ Habits) by 15%; drive 20% more signups for evening meal prep guides.
- Experience: 90% of users understand timing recommendations; satisfaction ≥4.5/5.

## Primary Users & Segments
- Individuals managing evening hunger and sleep disruptions.
- People experiencing stress-related digestive issues.
- Users integrating intermittent fasting or early time-restricted feeding.

## Experience Principles
- Keep guidance empathetic and science-based.
- Highlight meal timing (early vs late) for sleep benefits.
- Encourage whole-food sources before supplements.

## Functional Requirements

### FR1 — Input Collection
- Required: weight, biological sex, sleep goal (`fall_asleep_faster`, `stay_asleep`, `morning_energy`), evening digestive sensitivity.
- Optional: activity level, fasting window (from Okno Żywieniowe Planer), stress level (from mood journal), chronotype.
- Allow import of macro profile from Fuel tool to avoid duplication.

### FR2 — Target Logic
- Base protein target: 1.4–1.8 g/kg with emphasis on earlier intake (≥60% before 18:00).
- Fiber target: 25–35 g with evening guidance to avoid bloating (split across meals; last high-fiber meal ≥3h before bed unless user indicates tolerance).
- Provide tryptophan-rich suggestion for evening snack if needed (e.g., 15g protein).
- Suggest magnesium-rich foods for stress support.

### FR3 — Timing & Guidance
- Present daily schedule dividing intake across meals/snacks, highlighting best time for protein (breakfast/lunch) vs fiber (spread throughout day).
- Offer recipe suggestions aligning with digital sunset planner.
- CTA to meal plan generator filters for sleep-supportive menus.

### FR4 — Integration & Tracking
- Sync with hydration calculator to ensure adequate fluid for fiber.
- Share targets with weekly health report and intermittent fasting planner.
- Provide option to log adherence (quick yes/no per meal) to refine coaching.

## Content & Data Inputs
- Nutrient guidance stored in `sleep_nutrition_config` with citations.
- Copy localized via Strapi; include disclaimers for GI conditions.
- Chronotype adjustments (evening types may tolerate later intake).

## Analytics & KPIs
- Events: `sleep_protein_fiber_calc`, `timing_tip_clicked`, `meal_plan_cta_clicked`, `adherence_logged`.
- KPI: Evening snacking episodes reduced by 20% after 4 weeks; cross-tool usage with Okno Żywieniowe +10%.

## Non-Functional Requirements
- Calculations client-side with double precision; rounding to 0.5 g.
- Provide offline view of saved schedule.
- Accessible layout with clear time blocks.

## Compliance & Access Control
- Non-medical disclaimer; encourage IBS/GERD sufferers to consult professionals.
- Store preferences encrypted; allow deletion/export.
- Limit staff access to aggregate trends.

## Launch Readiness Checklist
- Validate timing guidance with nutrition + sleep experts.
- QA integration with Fuel calculator to prevent conflicting targets.
- Update `/habits/tematy/sen/` and `/fuel/tematy/bialko/` with cross-links.

## Open Questions & Assumptions
- Should we integrate gut microbiome recommendations later?
- Determine approach for shift workers with inverted schedules.
