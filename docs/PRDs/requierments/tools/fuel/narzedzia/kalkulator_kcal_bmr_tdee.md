# Feature Requirements — Fuel Tool: Kalkulator kcal/BMR/TDEE

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Data reviewer: Analytics Lead  
> Last updated: 2025-02-14

## Objective
- Provide an evidence-based calculator that estimates Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and recommended caloric targets for Clarivum Fuel audiences.
- Guide users toward Clarivum lead magnets (meal plans, coaching) by contextualizing energy needs within the Fuel pillar.

## Target Outcomes
- Business: Increase `/fuel/narzedzia/` lead conversions by 12% within 60 days; lift ebook downloads tied to personalized calorie targets by 8%.
- Experience: Deliver results in ≤150 ms post-input; 90% of users understand their recommended caloric window (survey CSAT ≥4.5/5).

## Primary Users & Segments
- **Starter**: Adults (18–55) beginning nutrition tracking; typically mobile users seeking weight management baselines.
- **Performance**: Recreational athletes needing accurate TDEE for training cycles.
- **Health-conscious**: Users managing metabolic markers (glucose, lipid profile) with dietitian oversight.

## Experience Principles
- Speak in plain Polish with science-backed context; surface cautions for medical conditions without prescribing.
- Offer toggle between metric and imperial units; default to metric for Poland, auto-detect locale from profile.
- Highlight follow-up CTA (meal plan, macro split, protein/fiber goals) without overwhelming results.

## Functional Requirements

### FR1 — Profile & Input Capture
- Required fields: sex at birth (`female`, `male`, `non-binary` → allows manual BMR formula selection), age (years, 18–80), weight (kg, 35–250), height (cm, 140–210).
- Optional: body fat percentage (for Katch-McArdle), activity level (enum), goal (`maintain`, `lose`, `gain`) with intensity slider (light, moderate, aggressive).
- Prefill from authenticated profile if available; allow anonymous session with local storage persistence (7 days).

### FR2 — Calculation Engine
- Default BMR: Mifflin-St Jeor  
    - Male & non-binary default: `BMR = 10*kg + 6.25*cm - 5*age + 5`  
    - Female & non-binary option: `BMR = 10*kg + 6.25*cm - 5*age - 161`
- Alternative BMR (toggle): Katch-McArdle when body fat supplied: `BMR = 370 + 21.6 * LBM`, where `LBM = weight * (1 - bodyFat%)`.
- Activity factor mapping:
    - Sedentary: 1.2
    - Light (1–2 workouts/week): 1.375
    - Moderate (3–4 workouts/week): 1.55
    - High (5–6 workouts/week): 1.725
    - Athlete (2-a-days/manual labor): 1.9
- TDEE = `BMR * activityFactor`.
- Goal adjustments:
    - Lose light/moderate/aggressive: subtract 10%/15%/20% TDEE.
    - Gain light/moderate/aggressive: add 10%/15%/20%.
    - Maintain: ±0%; ensure floor not below 1200 kcal female, 1500 kcal male by default; warn if user sets lower.
- Output structured ranges: `Target kcal = TDEE ± delta`; show macros call-to-action linking to macro split PRD.

### FR3 — UI Presentation & Guidance
- Results card: BMR, TDEE, target kcal range, recommended protein baseline (1.4–2.0 g/kg weight) with link to `cel-bialko-i-blonnik`.
- Provide “What affects your number” accordion (age, lean mass, activity) with risk disclaimers (pregnancy, endocrine disorders).
- Offer export: email summary (requires opt-in) + downloadable PDF using existing PDF converter pipeline.

### FR4 — State & Navigation
- Coordinator ensures deep link support: `/fuel/narzedzia/kalkulator-kcal-bmr-tdee?goal=lose&activity=moderate`.
- On completion, prompt optional save to profile (requires sign-in) and pushes event for macros planner cross-sell.

## Content & Data Inputs
- Static copy managed in Strapi `fuel_tools` collection (fields: heading, subheading, disclaimers, FAQ).
- Formula configuration stored in `tools_formula_config` service (JSON) for adjustability without redeploy.
- Scientific references curated by science lead; embed citations to Mifflin-St Jeor and Katch-McArdle in FAQ.

## Integrations & Dependencies
- Uses Tools Calculation Manager service for shared unit conversions.
- Relies on Profile service for saved anthropometrics; fallback to anonymous store.
- Email export leverages Notifications Manager; requires template updates.

## Analytics & KPIs
- Events (`clarivum_tools` schema):
    - `tool_view` (tool_id, source).
    - `calculation_submitted` (goal, activity_level, formula_type, auth_state).
    - `result_shared` (channel: pdf/email).
- Primary KPIs: completion rate ≥70%; opt-in to email summary ≥25%.

## Non-Functional Requirements
- Calculation response ≤150 ms server-side; ensure caching of static config.
- Accessible: WCAG 2.2 AA, keyboard accessible sliders, dynamic updates announced via ARIA live regions.
- Accuracy tolerance: ±1 kcal rounding error; double precision until final display.

## Compliance & Access Control
- Display non-medical disclaimer; require explicit consent before storing health metrics.
- Restrict admin editing of formulas to Nutrition Science role; audit log changes.

## Launch Readiness Checklist
- QA inputs across min/max ranges; verify rounding and warnings.
- Validate translations; confirm email template contains unsubscribe + data usage statement.
- Update `/fuel/start/` CTA tiles to link new tool.

## Open Questions & Assumptions
- Should we include Harris-Benedict as legacy option? Pending science review.
- Pregnancy/postpartum guidance needed? awaiting legal + medical advisory.
