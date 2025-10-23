# Feature Requirements — Habits Tool: Social Jetlag Kalkulator

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Behavioural science reviewer: Chronobiology Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Quantify social jetlag (difference between biological and social sleep timing) and provide mitigation strategies.
- Drive adoption of routines (digital sunset, caffeine journal) that reduce misalignment.

## Target Outcomes
- Business: Increase conversions to sleep coaching resources by 12%; boost engagement with weekend planning tips by 15%.
- Experience: Users understand their social jetlag score (survey ≥4.5/5); 70% of users receive tailored recommendations.

## Primary Users & Segments
- Workers with distinct weekday/weekend schedules.
- Students balancing study and social life.
- Parents with shifting family routines.

## Experience Principles
- Keep data entry simple; show difference visually.
- Emphasize manageable adjustments (30-minute shifts).
- Avoid judgment; focus on empowerment.

## Functional Requirements

### FR1 — Data Capture
- Inputs: typical weekday bedtime/wake time, weekend bedtime/wake time, alarm reliance, chronotype (if available), caffeine intake pattern.
- Optional: shift schedule, commute time, family obligations.
- Support import from sleep index data to prefill times.

### FR2 — Calculation Logic
- Compute mid-sleep point for weekday and weekend; social jetlag = difference in hours.
- Provide categories:
    - <1h: Low.
    - 1–2h: Moderate.
    - >2h: High.
- Adjust classification if user works nights (flip weekend vs weekday if reversed).
- Track weekly over time; overlay with sleep regularity index.

### FR3 — UI & Recommendations
- Show gauge with total difference and timeline visualization.
- Provide personalized recommendations: bedtime shifts, digital sunset adjustments, caffeine cut-off changes, morning light exposure.
- CTA to weekend planning tips and nap planner for recovery.

### FR4 — Tracking & Alerts
- Save history for authenticated users; show trends over 8 weeks.
- Alert when social jetlag exceeds 2h for consecutive weeks with suggestions to intervene.
- Encourage setting weekend alarms or waking rituals to reduce drift.

## Content & Data Inputs
- Guidance copy stored in Strapi; cite chronobiology research for category thresholds.
- Data stored in profile `social_jetlag_history`.
- Chronotype data adjusts target mid-sleep.

## Analytics & KPIs
- Events: `social_jetlag_calculated`, `recommendation_clicked`, `history_viewed`, `alert_acknowledged`.
- KPI: Reduction of social jetlag by ≥30 minutes over 4 weeks for active users; recommendation click-through ≥35%.

## Non-Functional Requirements
- Calculations client-side with validation; ensure timezone awareness.
- Provide offline ability to view last result.
- Accessible charts and textual descriptions.

## Compliance & Access Control
- Display non-diagnostic disclaimer; encourage medical consultation if excessive daytime sleepiness persists.
- Sensitive data encrypted and deletable on request.
- Limit staff access to aggregated analytics.

## Launch Readiness Checklist
- Validate calculations with sample schedules (day vs night shift).
- QA integration with chronotype and sleep index tools.
- Update `/habits/tematy/sen/` to reference calculator.

## Open Questions & Assumptions
- Should we tie recommendations directly to digital sunset start times automatically?
- Explore wearable data ingestion for weekend/weekday averages (future).
