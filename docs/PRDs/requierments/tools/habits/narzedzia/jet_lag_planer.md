# Feature Requirements — Habits Tool: Jet Lag Planer

> Product owner: Habits PM  
> Behavioural science reviewer: Chronobiology Specialist  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Provide personalized pre-, during-, and post-travel routines to minimise jet lag based on chronotype, travel direction, and schedule.
- Connect sleep, nutrition, hydration, and light exposure guidance into a cohesive plan.

## Target Outcomes
- Business: Increase premium coaching upsells for frequent travelers by 10%; drive 20% more engagement with hydration and digital sunset tools.
- Experience: Users generate plan in <90 seconds; plan adherence helpfulness ≥4.5/5.

## Primary Users & Segments
- Business travelers crossing 3+ time zones.
- Athletes preparing for competitions abroad.
- Vacationers seeking a smoother transition.

## Experience Principles
- Provide concise instructions with optional detailed rationale.
- Adapt to local culture (meal times, daylight patterns) when data available.
- Emphasize gradual adjustments, not abrupt changes.

## Functional Requirements

### FR1 — Input Capture
- Required: departure city/timezone, arrival city/timezone, travel dates & times, number of days at destination.
- Optional: chronotype, flight class (affects sleep comfort), ability to nap on plane, caffeine/alcohol preferences, daylight sensitivity.
- Allow import from calendar/itinerary (ICS upload).

### FR2 — Phase Plan Generation
- Pre-travel adjustment: shift sleep schedule 15–60 minutes per day depending on direction/time zones crossed.
- In-flight plan: recommend sleep windows, hydration targets, caffeine cutoffs, meal timing.
- Post-arrival plan: schedule morning/evening light exposure, meal timing, activity suggestions.
- Consider chronotype to tailor shift direction.
- Provide fallback for short trips (<3 days) recommending partial adjustment.

### FR3 — UI & Output
- Timeline view by day with tasks (sleep, meals, light, supplements).
- Summary cards for key actions (light exposure, hydration, caffeine).
- Provide download/export to PDF and calendar events for reminders.
- CTA to digital sunset planner and hydration calculator for supporting routines.

### FR4 — Notifications & Tracking
- Push/email reminders for key actions (e.g., start adjusting bedtime).
- Allow user to mark tasks complete; adjust future reminders based on adherence.
- Provide quick feedback log to evaluate effectiveness (sleep quality, energy).

## Content & Data Inputs
- Time zone and sunrise/sunset data via geolocation service.
- Guidance copy stored in Strapi with references to chronobiology research.
- Hydration targets reference habits hydration calculator.

## Analytics & KPIs
- Events: `jetlag_plan_created`, `task_completed`, `reminder_opt_in`, `support_tool_clicked`.
- KPI: Reminder opt-in ≥40%; adherence (tasks completed) ≥60% for active users.

## Non-Functional Requirements
- Plan generation server-side; ensure <500 ms response.
- Cache timezone data; support offline access to downloaded plan.
- Accessible timeline with textual alternatives.

## Compliance & Access Control
- Display medical disclaimer (sleep disorders, medication interactions).
- Store travel itineraries encrypted; allow deletion post-trip.
- Limit staff access to aggregated metrics only.

## Launch Readiness Checklist
- Validate algorithm with sample itineraries (east/west travel).
- QA integration with supporting tools and notification timing.
- Update `/habits/tematy/podroze/` content for launch.

## Open Questions & Assumptions
- Potential integration with airline APIs for auto-import? (future).
- Evaluate support for multi-leg journeys (current scope single trip).
