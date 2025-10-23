# Feature Requirements — Fuel Tool: Kalkulator Bezpieczna Kofeina

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Help users estimate safe daily caffeine intake considering body weight, timing, and sensitivity.
- Provide actionable scheduling tips to enhance performance and sleep hygiene.

## Target Outcomes
- Business: Increase downloads of caffeine management guides by 12%; drive 15% more cross-usage with hydration and sleep tools.
- Experience: Users complete calculation in <45 seconds; satisfaction ≥4.4/5.

## Primary Users & Segments
- Office professionals managing energy and sleep.
- Athletes balancing caffeine for training and competition.
- Individuals sensitive to stimulants seeking safe ranges.

## Experience Principles
- Use empathetic, non-judgmental tone; emphasize awareness and timing.
- Provide evidence-based limits and highlight risks (pregnancy, medications).
- Offer timeline view of caffeine doses to manage sleep impact.

## Functional Requirements

### FR1 — Input Capture
- Required: body weight (kg), goal (`focus`, `performance`, `low_stress`), caffeine sensitivity (`low`, `medium`, `high`).
- Optional: pregnancy status, medications, sleep schedule (target bedtime), number of planned caffeine servings with type/time (espresso, cold brew, energy drink, tablets).
- Provide quick-add presets for popular beverages with default caffeine content.

### FR2 — Safe Limit Calculation
- Base safe limit: 3 mg/kg body weight for general population (EFSA), max 400 mg/day (adults).
- Adjustments:
    - High sensitivity: reduce by 30%.
    - Low sensitivity/performance goal: allow up to 5 mg/kg but cap at 400 mg/day.
    - Pregnancy: cap at 200 mg/day.
    - Med interactions (user selects): apply guidelines (e.g., SSRIs reduce limit by 20%).
- Single dose recommendation: 1–3 mg/kg pre-training; ensure at least 6 hours before bedtime.

### FR3 — Timing & Schedule
- Build timeline showing when each submitted serving occurs; calculate caffeine decline (half-life ~5h adjustable).
- Flag servings <6 hours before bedtime; suggest decaf alternatives.
- Provide hydration reminder for each caffeinated beverage (additional 250 ml water).

### FR4 — UI & Guidance
- Summary card: safe daily limit, recommended max per serving, timeline warnings.
- Provide alternative options (matcha, chicory coffee) via smart substitutions.
- CTA to hydration calculator and sleep guide.

### FR5 — Save & Alerts
- Allow saving caffeine profiles (weekday vs weekend).
- Optional reminders: schedule caffeine cut-off notifications.
- Provide weekly digest summarizing average intake (if user logs daily).

## Content & Data Inputs
- Caffeine content library maintained in `caffeine_db` (drinks, supplements).
- Half-life modifiers (smoking status, pregnancy) stored in config.
- Copy localized via Strapi; disclaimers for heart conditions, anxiety disorders.

## Integrations & Dependencies
- Hydration calculator receives caffeine data to adjust fluid targets.
- Sleep planner uses caffeine timeline to offer wind-down reminders.
- Notifications Manager for alerts.

## Analytics & KPIs
- Events: `caffeine_tool_open`, `limit_calculated`, `timeline_warning_shown`, `profile_saved`, `reminder_opt_in`.
- KPI: Reminder opt-in ≥30%; hydration tool follow-through ≥20%.

## Non-Functional Requirements
- Calculations client-side; ensure accuracy (two decimal mg, round display to whole numbers).
- Support offline mode for saved profiles.
- Accessible UI with high contrast timeline and textual warnings.

## Compliance & Access Control
- Provide disclaimers referencing EFSA, WHO guidelines.
- Sensitive data (medications, pregnancy) stored securely with explicit consent.
- Admin edits to caffeine database require legal review.

## Launch Readiness Checklist
- Validate content values for beverage list.
- QA timeline warnings across browsers and mobile.
- Update `/fuel/tematy/energia/` with tool CTA.

## Open Questions & Assumptions
- Should we add chronotype-based recommendations (future release)?
- Evaluate integration with wearable sleep data to adjust warnings dynamically.
