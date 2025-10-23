# Feature Requirements — Fuel Tool: Profil Sportowy Makro

> Product owner: Fuel PM  
> Science reviewer: Sports Nutrition Lead  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Provide sport-specific macro and nutrient profiles tailored to training volume, competition schedules, and recovery needs.
- Integrate with meal plans, hydration, and supplement guidance to support athletic performance.

## Target Outcomes
- Business: Increase premium coaching upsell by 15%; drive 25% more engagement with Karvonen calculator and hydration tools.
- Experience: 90% of athletes create profile in <5 minutes; satisfaction ≥4.6/5.

## Primary Users & Segments
- Endurance athletes (running, cycling, triathlon).
- Strength/power athletes (lifting, CrossFit).
- Team sport athletes needing mixed energy systems.
- Recreational athletes balancing work/training.

## Experience Principles
- Provide credible, periodized guidance aligned with training cycles.
- Offer flexibility (adjustments for competition days, taper weeks).
- Present macros alongside micronutrient and hydration priorities.

## Functional Requirements

### FR1 — Intake Form
- Collect sport type, training frequency (sessions/week), duration/intensity, competition schedule, training phase (`base`, `build`, `peak`, `taper`, `off-season`).
- Capture body weight, body fat %, altitude training, dietary preference.
- Allow manual override for specific events (race day).

### FR2 — Macro & Nutrient Calculation
- Base on carbohydrate, protein, fat guidelines per sport & phase:
    - Endurance: Carbs 5–12 g/kg (phase-dependent), Protein 1.6–1.8 g/kg, Fat remainder.
    - Strength: Protein 1.8–2.2 g/kg, Carbs 4–6 g/kg.
    - Team sports: Carbs 5–8 g/kg, Protein 1.6–1.9 g/kg.
- Adjust macros for training load (duration * intensity factor).
- Highlight key micronutrients (iron, calcium, vitamin D, omega-3) by sport.
- Provide intra-workout fueling guidance (carb timing, electrolytes).

### FR3 — Output & Periodization
- Weekly schedule view with macro targets per day (training vs rest vs competition).
- Provide meal timing suggestions (pre/during/post).
- Link to meal plan generator with sport-specific templates.
- Offer “competition mode” toggle with higher carb loading guidance.

### FR4 — Save & Monitor
- Save profiles; allow multiple (e.g., marathon vs strength block).
- Sync with training zones (Karvonen) to adjust fueling by intensity.
- Log readiness (sleep, RPE) to recommend macro adjustments.

### FR5 — Integrations & Flow
- Works with hydration/electrolyte calculators to adjust targets.
- Connect to caffeine calculator for race day strategies.
- Share data with weight plan to avoid conflicting goals.

## Content & Data Inputs
- Sport guidelines derived from ACSM, IOC consensus statements; stored in `sports_nutrition_reference`.
- Copy localized via Strapi with disclaimers.
- Meal plan templates tagged by sport & phase.

## Analytics & KPIs
- Events: `sport_profile_created`, `phase_switched`, `macro_adjustment_logged`, `meal_plan_cta_clicked`.
- KPI: Phase switching rate (indicating periodization) ≥40%; follow-up usage of hydration/caffeine tools ≥30%.

## Non-Functional Requirements
- Calculations server-side; response ≤300 ms given dataset complexity.
- Provide accessible schedule view with textual alternates.
- Ensure offline access to saved profile via PWA storage.

## Compliance & Access Control
- Display disclaimer: consult coach/physician; not a substitute for medical advice.
- Sensitive training data stored securely; user controls deletion.
- Admin edits to sport guidelines require sports nutrition approval.

## Launch Readiness Checklist
- Validate macro outputs with sports nutrition experts for sample sports.
- QA integration with meal plans and calculators.
- Update `/fuel/profil-sportowy-makro/` landing copy and analytics.

## Open Questions & Assumptions
- Future wearable integration to auto-adjust macros based on training load.
- Determine support for youth athletes (requires separate guidelines).
