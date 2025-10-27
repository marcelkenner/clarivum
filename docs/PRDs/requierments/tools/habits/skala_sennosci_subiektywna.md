# Feature Requirements — Habits Tool: Skala Senności Subiektywna

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Behavioural science reviewer: Sleep Research Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide quick subjective sleepiness assessments inspired by the Stanford Sleepiness Scale and Karolinska Sleepiness Scale without delivering clinical diagnoses.
- Use results to adjust nap planning, caffeine cut-offs, and digital sunset routines.

## Target Outcomes
- Business: Increase usage of nap planner by 20%; drive 15% more caffeine journal interactions following high sleepiness scores.
- Experience: Users complete assessment in <15 seconds; comprehension of recommendations ≥4.4/5.

## Primary Users & Segments
- Knowledge workers tracking daytime drowsiness.
- Students and drivers needing alertness checks.
- Individuals adjusting recovery routines.

## Experience Principles
- Keep language clear; avoid medical claims.
- Encourage self-awareness; highlight safe behaviours (no driving when very sleepy).
- Provide immediate, actionable steps.

## Functional Requirements

### FR1 — Assessment Flow
- Single-question 7-point scale (adapted from Stanford) with descriptions for each point.
- Optional: log context (time of day, activity, previous night’s sleep hours).
- Allow quick re-assessment multiple times per day; show timestamp.

### FR2 — Results & Guidance
- Map score ranges to recommended actions:
    - 1–2: Alert — maintain routine.
    - 3–4: Moderate sleepiness — suggest microbreak, light exposure.
    - 5–7: High sleepiness — advise nap planner, avoid driving, review caffeine usage.
- Provide caution if user selects high sleepiness while planning to drive (remind to rest).
- Track trends vs sleep index and social jetlag.

### FR3 — Integrations
- Send high sleepiness events to weekly health report, nap planner, caffeine journal, and hydration calculator.
- Optionally share with mood journal for correlation.
- Trigger notifications to check standing vs sitting schedule when midday sleepiness high.

## Content & Data Inputs
- Scale descriptions stored in Strapi; cite Stanford Sleepiness Scale as reference.
- Coaching copy includes safety disclaimers.
- Sleep data from index tool for correlations.

## Analytics & KPIs
- Events: `sleepiness_assessment_logged`, `recommendation_clicked`, `high_sleepiness_alert_triggered`.
- KPI: Reduction in repeated high sleepiness episodes by 20% after 4 weeks; recommendation click-through ≥35%.

## Non-Functional Requirements
- Assessment available offline; sync later.
- UI accessible (large buttons, screen reader support).
- Provide historical log with filters.

## Compliance & Access Control
- Non-diagnostic disclaimer displayed prominently.
- Sensitive data encrypted; user can delete logs anytime.
- Staff access limited to aggregated anonymized data.

## Launch Readiness Checklist
- Validate language and thresholds with sleep experts.
- QA integration with downstream tools and alerts.
- Update `/habits/tematy/sen/` to explain scale usage.

## Open Questions & Assumptions
- Should we offer optional Karolinska alternate scale (9-point) in future?
- Evaluate integration with wearable alertness scores.
