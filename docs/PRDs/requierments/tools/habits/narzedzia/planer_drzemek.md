# Feature Requirements — Habits Tool: Planer Drzemek

> Product owner: Habits PM  
> Behavioural science reviewer: Sleep Research Lead  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Help users schedule naps optimally based on chronotype, sleep debt, and daily obligations.
- Reduce afternoon slump while protecting nighttime sleep quality.

## Target Outcomes
- Business: Increase engagement with sleep regularity index by 15%; drive 10% more newsletter opt-ins for energy management.
- Experience: 85% of users finalize a nap plan within 60 seconds; satisfaction ≥4.5/5.

## Primary Users & Segments
- Knowledge workers experiencing afternoon fatigue.
- Athletes using strategic naps for recovery.
- New parents managing fragmented sleep.

## Experience Principles
- Keep recommendations concise with optional advanced settings.
- Adapt to cultural norms (Polish work schedules, commuting times).
- Provide gentle language for self-care.

## Functional Requirements

### FR1 — Input Capture
- Required: desired nap outcome (`energy_boost`, `recovery`, `catch_up`), available time window, next major obligation (meeting, workout).
- Optional: previous night's sleep duration, caffeine intake timing, chronotype, sleep debt from regularity index.
- Allow quick-select presets (e.g., “15 min power nap”).

### FR2 — Scheduling Logic
- Determine optimal nap start and duration:
    - Power nap: 10–20 minutes.
    - Recovery: 60–90 minutes (if schedule allows, warn about sleep inertia).
- Avoid scheduling within 6 hours of habitual bedtime; suggest adjusting digital sunset.
- If sleep debt high, recommend splitting naps or earlier bedtime instead.
- Provide alarm buffer and wake-up ritual suggestions.

### FR3 — UI & Output
- Present recommended start time, duration, wake-up time, benefits.
- Offer optional breathing exercise or soundscapes (integrate with breath trainer).
- Provide CTA to add event to calendar and set notifications.

### FR4 — Tracking & Feedback
- Allow users to log nap outcome (felt refreshed? groggy?); feed into coaching prompts.
- Track nap frequency; warn if exceeding 120 minutes daily (risk for insomnia).
- Integrate with weekly health report to summarize nap habits.

## Content & Data Inputs
- Nap guidance stored in Strapi; cite sleep science references for durations.
- Sleep debt data from Indeks Regularności Snu; chronotype from screener.
- Audio/ritual suggestions via content service.

## Analytics & KPIs
- Events: `nap_plan_created`, `calendar_exported`, `outcome_logged`, `coaching_tip_clicked`.
- KPI: Outcome logging rate ≥35%; afternoon energy improvement self-report ≥4.2/5.

## Non-Functional Requirements
- Scheduling logic client-side with timezone awareness.
- Provide offline fallback for saved plans; sync later.
- Accessible interface with keyboard support.

## Compliance & Access Control
- Non-diagnostic disclaimer; caution for individuals with sleep disorders.
- Store logs encrypted; allow deletion.
- Limit staff access to aggregated usage metrics.

## Launch Readiness Checklist
- QA scheduling rules across chronotypes and time windows.
- Validate notification flows and calendar exports.
- Update `/habits/tematy/sen/` with explanatory article.

## Open Questions & Assumptions
- Should we integrate wearables to detect when user actually napped? (future).
- Determine best approach for dual naps (segmented sleep) support.
