# Feature Requirements — Habits Tool: Okno Żywieniowe Planer

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Science reviewer: Metabolic Health Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Help users define daily eating windows that align with sleep, energy, and intermittent fasting goals.
- Coordinate with chronotype, caffeine journal, and sleep index to encourage consistent routines.

## Target Outcomes
- Business: Increase engagement with intermittent fasting planner by 20%; drive 15% more usage of evening meal prep guides.
- Experience: 85% of users finalize window in <60 seconds; satisfaction ≥4.5/5.

## Primary Users & Segments
- Users experimenting with time-restricted feeding (12:12, 14:10, 16:8).
- Individuals seeking better evening digestion for sleep.
- Night shift workers needing custom schedules.

## Experience Principles
- Keep recommendations flexible; highlight health considerations.
- Provide warnings for underfueling or late-night eating.
- Encourage mindful reflection (how window felt).

## Functional Requirements

### FR1 — Input Capture
- Required: chronotype (prefill), work schedule, preferred meal count (2–5), sleep schedule (from sleep index).
- Optional: intermittent fasting experience level, stress level, exercise timing, medical flags (diabetes, pregnancy).
- Provide quick presets (Early Window, Classic 12:12, Evening Balanced).

### FR2 — Window Recommendation Logic
- Align start/end times with chronotype:
    - Morning types: earlier start (07:00) and finish (19:00).
    - Evening types: moderate shift, but warn if eating past 22:00.
- Ensure final meal at least 2–3 hours before bedtime unless shift worker.
- Provide nutrient timing suggestions (protein early, complex carbs midday).
- Validate caloric adequacy (if window <8h, prompt caution).

### FR3 — UI & Guidance
- Visual timeline showing fasting/eating blocks.
- Provide meal reminders (start window, last meal) with integration to digital sunset planner.
- Offer CTA to macro planner and hydration calculator to adjust schedules.
- Include journaling prompt (“How did this window feel?”) to build awareness.

### FR4 — Tracking & Adjustments
- Save schedules; allow weekly adjustments with suggestions based on adherence.
- Log adherence (met start time, met end time) to track streaks.
- Provide insights in weekly health report (consistency, mood correlation).

## Content & Data Inputs
- Guidance content stored in Strapi; include disclaimers for medical conditions.
- Chronotype and sleep data from respective tools.
- Integration with hydration targets to avoid late-night intake.

## Analytics & KPIs
- Events: `eating_window_set`, `reminder_sent`, `adherence_logged`, `adjustment_recommended`.
- KPI: Late-night eating episodes reduced by 25%; adherence streak ≥5 days for 40% of active users.

## Non-Functional Requirements
- Calculations client-side; ensure timezone support.
- Provide offline view of schedule and last adherence.
- Accessible timeline (text summary, keyboard control).

## Compliance & Access Control
- Non-medical disclaimer; block for minors, pregnancy (unless medically supervised).
- Store logs encrypted; allow deletion/export.
- Staff access limited to aggregated metrics.

## Launch Readiness Checklist
- Validate logic with nutrition + sleep experts.
- QA integration with reminders and other tools.
- Update `/habits/tematy/sen/` & `/fuel/tematy/post/` cross-links.

## Open Questions & Assumptions
- Should we auto-suggest weekend adjustments? (future).
- Explore integration with CGM data to personalize windows later.
