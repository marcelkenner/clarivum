# Feature Requirements — Habits Tool: Kalkulator Hydratacji

> Product owner: Habits PM  
> Science reviewer: Hydration Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide daily hydration targets and timing recommendations tailored to sleep quality, activity, environment, and stimulant use.
- Sync hydration guidance across Habits tools (digital sunset, caffeine journal, weekly report).

## Target Outcomes
- Business: Increase adherence to hydration reminders by 20%; drive 15% more engagement with jet lag and alcohol sleep simulator.
- Experience: 90% of users understand targets; reminder opt-in ≥35%.

## Primary Users & Segments
- Knowledge workers managing energy dips.
- Individuals with sleep disruption from nocturia or dehydration.
- Travelers adjusting to new climates.

## Experience Principles
- Keep UI simple with optional advanced settings.
- Highlight link between hydration and sleep/stress outcomes.
- Encourage sustainable habits (spacing intake).

## Functional Requirements

### FR1 — Input Collection
- Required: body weight, typical activity level, goal (`focus`, `recovery`, `sleep_quality`).
- Optional: exercise sessions, ambient temperature/humidity, caffeine/alcohol intake (pull from journal), chronotype, nocturia concerns.
- Allow manual entry of current fluid intake pattern.

### FR2 — Calculation Logic
- Baseline fluid requirement similar to Fuel hydration tool but tuned to sleep impact:
    - Start with 35 ml/kg, adjust for activity (±5 ml/kg) and climate (±10%).
    - For sleep-friendly plan, limit evening intake: allocate 60% before 18:00 unless user selects night shift.
- Provide schedule for morning, midday, afternoon, evening, with reminders to taper.
- Recommend electrolyte and herbal tea options depending on stress goals.

### FR3 — UI & Coaching
- Summary card: total litres, distribution by time block, evening cut-off suggestion.
- Provide hydration log to record actual intake with quick-add presets.
- CTA to set reminders, link to caffeine journal for synergy, highlight jet lag and digital sunset suggestions.

### FR4 — Tracking & Insights
- Track compliance; show trends in weekly report alongside sleep quality.
- Alert when user consistently drinks too late (impacting sleep).
- Provide seasonal adjustments (auto-update monthly).

## Content & Data Inputs
- Hydration formulas stored in `habits_hydration_config`; align with fuel counterpart but with sleep modifiers.
- Copy localized via Strapi; include disclaimers for renal/cardiac conditions.
- Integration with caffeine/alcohol logs for dynamic adjustments.

## Analytics & KPIs
- Events: `hydration_calc_completed`, `intake_logged`, `reminder_set`, `sleep_conflict_alert`.
- KPI: Intake logging rate ≥40%; reduction in late-night intake events ≥15%.

## Non-Functional Requirements
- Calculations client-side; ensure rounding to 50 ml increments.
- Provide offline logging with sync.
- Accessible forms (large tap targets, ARIA labels).

## Compliance & Access Control
- Sensitive health data encrypted; allow deletion/export.
- Require explicit consent to use caffeine/alcohol data in calculations.
- Staff access limited to aggregated analytics.

## Launch Readiness Checklist
- Validate formula adjustments with hydration specialist.
- QA linkage with caffeine/alcohol tools and reminders.
- Update `/habits/tematy/nawodnienie/` resources.

## Open Questions & Assumptions
- Should we offer integration with smart bottles (future).
- Determine best approach for night-shift hydration scheduling.
