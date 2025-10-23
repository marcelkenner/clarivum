# Feature Requirements — Fuel Tool: Kalkulator Alkohol — Kalorie & BAC

> Product owner: Fuel PM  
> Science reviewer: Registered Dietitian  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Help users understand caloric impact and estimated blood alcohol concentration (BAC) from alcoholic beverages, emphasizing safe consumption.
- Provide guidance on hydration, recovery, and nutritional adjustments post-consumption.

## Target Outcomes
- Business: Increase downloads of alcohol moderation guide by 15%; drive 20% more hydration tool usage after alcohol logging.
- Experience: Users calculate BAC in <30 seconds; warnings comprehended (survey ≥4.5/5).

## Primary Users & Segments
- Social drinkers aiming to moderate intake.
- Fitness enthusiasts adjusting macros to accommodate occasional alcohol.
- Individuals tracking sobriety and safety.

## Experience Principles
- Lead with safety and responsible messaging; avoid glamorizing alcohol.
- Provide actionable recovery tips (hydration, electrolytes, nutrition).
- Handle sensitive data securely and anonymously when possible.

## Functional Requirements

### FR1 — Input Capture
- Beverage entries: type (beer, wine, spirits, cocktails), volume, ABV, time consumed.
- Personal data: weight, biological sex, time since first drink, stomach content (`empty`, `light meal`, `full meal`).
- Option to save favorite drinks with default ABV and volume.

### FR2 — Caloric Calculation
- Calories = `volume (ml) * ABV * 0.789 * 7` (ethanol density 0.789 g/ml, 7 kcal/g).
- For cocktails, allow additional mixers calories (manual entry or preset).
- Provide daily macro adjustment recommendation (reduce carbs/fats to balance).

### FR3 — BAC Estimation (Widmark Formula)
- BAC %= `( (Alcohol grams * 100) / (bodyWeight * r) ) - (beta * hoursSinceFirstDrink)`  
    - `r` = 0.68 men, 0.55 women (allow custom for non-binary; choose best fit).
    - `beta` (elimination rate) default 0.015 per hour; editable range 0.010–0.020.
- Ensure BAC not below 0; display time to sobriety estimate `time = currentBAC / beta`.
- Provide safety thresholds (0.02 caution, 0.05 legal limit PL, 0.08 impairment).
- Highlight disclaimers about estimator limitations and zero tolerance for driving.

### FR4 — UI & Guidance
- Dashboard: drink log, total calories, estimated BAC curve over time.
- Provide color-coded safety states and hydration/electrolyte prompts.
- Offer “recovery plan” tips: water, electrolytes, nutrient-dense meals.
- Link to hydration, electrolyte, and sleep tools for post-drinking recovery.

### FR5 — Save & Privacy
- Anonymous mode by default; if user logs in, allow saving history with lock toggle.
- Provide export for health professional review.
- Offer reminder system (pre-event planning) with safe drinking tips.

## Content & Data Inputs
- Beverage presets stored in `alcohol_catalog` (ABV, calories).
- Legal limit references per Polish regulations stored in config.
- Copy localized via Strapi; disclaimers emphasize zero driving after drinking.

## Integrations & Dependencies
- Hydration and electrolyte calculators triggered via CTAs.
- Macro planner adjusts daily macros when alcohol logged.
- Notifications Manager for reminders and follow-up tips.

## Analytics & KPIs
- Events: `alcohol_tool_open`, `drink_added`, `bac_calculated`, `recovery_tip_clicked`, `history_saved`.
- KPI: Post-use hydration tool engagement ≥30%; safe consumption alerts acknowledged ≥70%.

## Non-Functional Requirements
- Calculations client-side; ensure rounding to two decimals for BAC.
- Provide offline logging with sync.
- Ensure charts accessible; textual description for BAC curve.

## Compliance & Access Control
- Age gate: confirm 18+ (Poland legal drinking age) before tool access.
- Provide disclaimers about legal BAC limits and zero tolerance for driving.
- Store historical data encrypted; allow permanent deletion.

## Launch Readiness Checklist
- Validate formulas with sample scenarios.
- QA age gate, disclaimers, and localization.
- Update `/fuel/tematy/alkohol/` content with tool embed link.

## Open Questions & Assumptions
- Evaluate integration with wearable or breathalyzer devices (future).
- Determine policy for handling binge drinking alerts (offer support resources).
