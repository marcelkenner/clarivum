# Feature Requirements — Habits Tool: Digital Sunset Planer

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Behavioural science reviewer: Sleep Research Lead  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Guide users through an evening wind-down routine that reduces blue light exposure and cognitive load before bedtime.
- Integrate with chronotype, caffeine intake, and hydration tools to create cohesive pre-sleep habits.

## Target Outcomes
- Business: Improve sleep index scores by 10 points for engaged users; increase cross-usage with mood journal by 15%.
- Experience: 80% of users create a routine; adherence reminders acknowledged ≥60%.

## Primary Users & Segments
- Evening chronotypes needing structured wind-down.
- Knowledge workers using screens late.
- Parents balancing family routines with sleep hygiene.

## Experience Principles
- Provide customizable routines with evidence-based recommendations.
- Keep UI calming; avoid overstimulation (dark mode, gentle animations).
- Encourage small, consistent steps.

## Functional Requirements

### FR1 — Routine Builder
- Inputs: target bedtime (prefilled from sleep index), desired wind-down length (30–120 minutes), household constraints (kids, roommates), device availability.
- Offer suggested activities: dim lights, blue light filter, gentle stretching, journaling, reading, hydration.
- Allow user to reorder, add custom steps, set durations.

### FR2 — Integrations & Adjustments
- Pull caffeine cut-off from caffeine journal; flag conflicts.
- Suggest hydration reminder from hydration calculator (e.g., last glass of water).
- Align with chronotype (morning types may need earlier start).
- Provide link to breathing trainer for relaxation step.

### FR3 — Reminders & Execution
- Notifications for each step (push/email) with gentle tone; allow grouping to avoid spam.
- Provide in-app guided mode showing current step, timer, tips.
- Offer “skip” and “snooze” actions; log adherence.

### FR4 — Progress & Feedback
- Track routine completion rate, step adherence, adjustments.
- Weekly summary with insights: steps most often skipped, recommended tweaks.
- Feed data into sleep regularity index and weekly health report.

## Content & Data Inputs
- Activity library stored in Strapi with research citations.
- Reminder copy localized; include mental health resources.
- Default schedules synchronized with Polish daylight patterns.

## Analytics & KPIs
- Events: `digital_sunset_created`, `step_completed`, `reminder_acknowledged`, `routine_adjusted`.
- KPI: Routine completion ≥50% nights per week for active users; sleep index improvement (control vs engaged) ≥8 points.

## Non-Functional Requirements
- Routine builder client-side; ensure saved state sync to profile.
- Provide offline mode for guided routine with last-synced steps.
- Accessible design (clear focus states, voice-over support).

## Compliance & Access Control
- Non-diagnostic disclaimers; highlight not a treatment for insomnia.
- Store routine steps encrypted; allow deletion/export.
- Restrict staff access to aggregated analytics.

## Launch Readiness Checklist
- Validate default activity recommendations with behavioural science.
- QA notifications, snooze logic, and integrations.
- Update `/habits/tematy/sen/` with new routine resources.

## Open Questions & Assumptions
- Should we integrate smart home devices (lighting) later?
- Determine best frequency for routine review prompts (monthly?).
