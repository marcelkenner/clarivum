# Feature Requirements — Habits Tool: Kalkulator Stania vs Siedzenia

> Product owner: Habits PM  
> Reviewer: Occupational Health Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide optimal standing vs sitting ratios tailored to user schedule, ergonomics, and health considerations.
- Encourage movement variety and integrate with microbreak timer and ergonomics assessment.

## Target Outcomes
- Business: Increase uptake of movement prompts (microbreaks) by 20%; drive 12% more affiliate clicks for ergonomic mats and stools.
- Experience: 85% of users understand their recommended ratio; satisfaction ≥4.4/5.

## Primary Users & Segments
- Standing desk owners seeking guidance.
- Sedentary workers aiming to reduce discomfort.
- Individuals with musculoskeletal concerns (non-clinical).

## Experience Principles
- Deliver balanced advice; warn against over- standing.
- Provide clear scheduling, not just percentages.
- Encourage listening to body cues.

## Functional Requirements

### FR1 — Input Capture
- Required: work hours, availability of standing desk, footwear comfort, current standing/sitting pattern.
- Optional: back/knee issues, BMI category, movement limitations, chronotype (for energy timing).
- Allow import from wearable step data if available.

### FR2 — Recommendation Logic
- Base guidance: start 15 min standing per hour, increase gradually up to 30–45 min, ensuring sitting breaks.
- Adjust for health flags: if joint issues, limit to 20 min intervals and recommend active sitting.
- Provide schedule (e.g., stand 09:00–09:20, 10:00–10:20) synced to calendar/microbreak timer.
- Suggest complementary movements (calf raises, posture resets).

### FR3 — UI & Output
- Display daily timeline with alternating sitting/standing blocks.
- Provide weekly progression plan (gradual increase).
- CTA to microbreak timer, ergonomics tool, and mood journal (log discomfort).

### FR4 — Tracking & Feedback
- Users log actual adherence; record discomfort ratings.
- Provide adjustments based on feedback (reduce intervals if discomfort).
- Summaries appear in weekly health report.

## Content & Data Inputs
- Occupational health guidelines stored in `standing_guidelines` config.
- Copy localized via Strapi; disclaimers for medical conditions.
- Integration with activity library for supportive stretches.

## Analytics & KPIs
- Events: `standing_ratio_calculated`, `schedule_exported`, `adherence_logged`, `discomfort_flagged`.
- KPI: Adherence to recommended intervals ≥60%; discomfort incidents reduced by 15% after 4 weeks.

## Non-Functional Requirements
- Calculations client-side; ensure timezone support.
- Provide offline view of schedule.
- Accessible timeline with text summary.

## Compliance & Access Control
- Non-medical disclaimer; encourage physician consult for chronic pain.
- Store logs encrypted; allow deletion/export.
- Staff access limited to aggregated trends.

## Launch Readiness Checklist
- Validate recommendations with ergonomics specialist.
- QA calendar exports and microbreak integration.
- Update `/habits/tematy/ergonomia/` content with tool link.

## Open Questions & Assumptions
- Potential integration with height-adjustable desk controllers (future).
- Determine best ramp-up pace for new standing desk users.
