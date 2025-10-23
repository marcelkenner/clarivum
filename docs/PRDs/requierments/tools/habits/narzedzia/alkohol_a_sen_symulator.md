# Feature Requirements — Habits Tool: Alkohol a Sen Symulator

> Product owner: Habits PM  
> Science reviewer: Sleep Pharmacology Consultant  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Simulate the impact of alcohol consumption on sleep architecture, timing, and recovery quality.
- Encourage behaviour change by linking to hydration, caffeine, and digital sunset routines.

## Target Outcomes
- Business: Increase engagement with alcohol moderation guide by 18%; drive 20% more usage of hydration and sleep readiness tools post-simulation.
- Experience: 85% of users complete a simulation; comprehension of sleep trade-offs ≥4.5/5.

## Primary Users & Segments
- Social drinkers balancing sleep goals.
- Busy professionals using alcohol as wind-down aid.
- Athletes managing recovery windows.

## Experience Principles
- Present science-based, empathetic messaging; avoid shaming.
- Visualise sleep stage disruption clearly (charts/timelines).
- Provide actionable recovery steps.

## Functional Requirements

### FR1 — Input Capture
- Beverage log similar to alcohol calorie calculator: type, volume, ABV, consumption time, with optional food pairing.
- Sleep plan: intended bedtime/wake time, baseline sleep quality (from sleep index), chronotype.
- Optional: body weight, sex, tolerance, medication use.

### FR2 — Simulation Engine
- Estimate Blood Alcohol Concentration (reuse logic from Fuel tool) to determine elimination timeline.
- Model sleep impact:
    - Delay to REM onset proportional to BAC at bedtime.
    - Reduction in REM/SWS percentages based on research (e.g., REM reduced 10–40% depending on BAC).
    - Increased wake after sleep onset and disturbances.
- Calculate expected sleep performance score (baseline minus penalties) referencing metrics like WHOOP sleep performance from Context7 docs.
- Provide warnings for high BAC near bedtime (advise postponing sleep).

### FR3 — UI & Output
- Display timeline showing expected sleep stages vs baseline.
- Provide summary: estimated total sleep, REM/SWS change, recovery impact, next-day grogginess rating.
- Offer recovery plan: hydration volume, electrolytes, caffeine timing adjustments, light exposure suggestions.
- CTA to hydration calculator, caffeine journal, digital sunset planner.

### FR4 — Tracking & Education
- Allow saving scenarios to compare actual outcomes (if user logs sleep next day).
- Provide educational library (articles, expert Q&A).
- Send reminder to log actual sleep quality and compare to simulation.

## Content & Data Inputs
- Alcohol metabolism data shared with Fuel tool; cross-reference to maintain consistency.
- Sleep impact coefficients stored in `alcohol_sleep_model` config, reviewed quarterly.
- Copy localized via Strapi; include legal disclaimers about drinking and health.

## Analytics & KPIs
- Events: `alcohol_sleep_sim_started`, `simulation_completed`, `recovery_tip_clicked`, `actual_sleep_logged`.
- KPI: Recovery tip engagement ≥35%; reduction in late-night drinking events logged over 4 weeks ≥10%.

## Non-Functional Requirements
- Simulation calculations server-side (Node service) to reuse shared logic; response <400 ms.
- Provide offline view for previously saved simulations.
- Accessible charts with textual explanations.

## Compliance & Access Control
- Age gate (18+); disclaimers about medical advice.
- Store consumption data encrypted; allow anonymized usage.
- Limit staff access to aggregated analytics only.

## Launch Readiness Checklist
- Validate model with behavioural science team and available research.
- QA integration with alcohol logging, hydration, and sleep index.
- Update `/habits/tematy/sen/` and support docs.

## Open Questions & Assumptions
- Should we integrate wearable feedback to refine model for each user?
- Determine approach for medication interactions messaging.
