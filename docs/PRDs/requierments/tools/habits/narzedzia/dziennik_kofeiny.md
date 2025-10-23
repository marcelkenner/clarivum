# Feature Requirements — Habits Tool: Dziennik Kofeiny

> Product owner: Habits PM  
> Science reviewer: Nutrition Science Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Track daily caffeine intake timing and dosage to surface its impact on sleep, mood, and hydration.
- Provide actionable guidance for reducing evening caffeine and aligning with chronotype.

## Target Outcomes
- Business: Increase engagement with digital sunset planner by 20%; drive 15% more usage of hydration calculator and breath trainer.
- Experience: 80% of users log caffeine on ≥4 days/week; satisfaction ≥4.4/5.

## Primary Users & Segments
- Knowledge workers relying on coffee for productivity.
- Athletes using caffeine for performance enhancement.
- Individuals experiencing sleep disruption from late caffeine.

## Experience Principles
- Logging must be quick (<10 seconds per entry).
- Provide empathetic coaching, focusing on gradual shifts.
- Visualise patterns clearly (timeline, heatmaps).

## Functional Requirements

### FR1 — Logging Interface
- Quick-add buttons for common beverages (espresso, drip coffee, tea, energy drink, supplements).
- Capture: beverage type, size, caffeine content (prefilled from database), time consumed, context (pre-workout, meeting).
- Allow manual entry and editing; maintain audit log.
- Support voice input on mobile (future).

### FR2 — Data Model & Integrations
- Store entries in `caffeine_log` with reference to source (manual, imported).
- Sync with Fuel caffeine calculator for safe limit feedback.
- Provide API to digital sunset planner (highlight cut-off times) and sleep index (flag caffeine near bedtime).

### FR3 — Insights & Coaching
- Dashboard showing daily total vs recommended limit (from safe caffeine calculator), timeline of intake, impact flags (within 6h of bedtime).
- Weekly summary with streaks, highlight best adherence days.
- Provide personalized suggestions: swap to decaf, adjust timing, pair with hydration.

### FR4 — Alerts & Reminders
- Allow optional notifications for logging prompts and “caffeine curfew” alerts.
- Integrate with watch notifications (if available) for midday check-ins.
- Provide achievements for meeting goals (e.g., 5 days with cutoff before 15:00).

## Content & Data Inputs
- Caffeine database shared with Fuel tool; maintain single source of truth.
- Coaching scripts stored in Strapi; include tips for withdrawal and alternatives.
- Chronotype adjusts recommended cutoff (earlier for morning types).

## Analytics & KPIs
- Events: `caffeine_entry_logged`, `cutoff_alert_triggered`, `tip_clicked`, `streak_completed`.
- KPI: Late caffeine events (>6h before bedtime) reduced by 25% over 4 weeks for engaged users.

## Non-Functional Requirements
- Logging available offline; sync when online.
- Ensure performance quick (form render <100 ms).
- Accessible UI with clear color contrast for alerts.

## Compliance & Access Control
- Non-diagnostic; advise medical consultation for health conditions.
- Store logs encrypted; allow deletion/export.
- Limit staff access to aggregated metrics.

## Launch Readiness Checklist
- QA logging flows, editing, and cross-tool integrations.
- Validate cutoff logic with sleep experts.
- Update `/habits/tematy/energia/` to promote journal.

## Open Questions & Assumptions
- Evaluate integration with wearable data (HR, HRV) to correlate caffeine impact.
- Determine best messaging for users relying on caffeine for ADHD management.
