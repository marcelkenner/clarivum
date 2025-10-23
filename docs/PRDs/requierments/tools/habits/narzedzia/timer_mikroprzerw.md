# Feature Requirements — Habits Tool: Timer Mikroprzerw

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Behavioural science reviewer: Occupational Health Specialist  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Encourage short movement and recovery breaks throughout the day to combat sedentary fatigue and support focus.
- Integrate with ergonomics assessment, breathing trainer, and mood journal.

## Target Outcomes
- Business: Increase adoption of ergonomics coaching by 15%; improve engagement with breath trainer by 20%.
- Experience: 80% of users complete at least three microbreaks per workday; satisfaction ≥4.4/5.

## Primary Users & Segments
- Desk workers with long screen time.
- Remote employees needing structure.
- Students preparing for exams.

## Experience Principles
- Keep prompts supportive, not disruptive.
- Offer variety in break suggestions (movement, hydration, breath work).
- Respect calendar events to avoid interruption during meetings.

## Functional Requirements

### FR1 — Setup Flow
- Inputs: work hours, break frequency preference (every 30/45/60 min), preferred break length (1–5 min), activity limitations (mobility, space).
- Integrate with calendar (optional) to skip meetings automatically.
- Allow silent mode (badge notifications) or full reminders.

### FR2 — Break Library & Sequencing
- Curated activities: stretches, eye exercises, breathing, hydration prompts, posture resets.
- Tag activities (standing, seated, equipment needed); match to user preferences.
- Ensure variety; avoid repeating same activity more than twice per day.
- Offer quick logging interface (“Done”, “Snooze 10 min”, “Skip”).

### FR3 — Notifications & Tracking
- Push/browser notifications with quick actions.
- In-app view showing next break countdown, completed streaks.
- Provide daily summary with time-on-task vs break time.

### FR4 — Integrations
- Trigger breath trainer or hydration calculator when relevant.
- Sync with standing vs sitting calculator to refine recommendations.
- Feed completion stats to weekly health report and mood journal.

## Content & Data Inputs
- Activity scripts stored in Strapi with occupational health references.
- Calendar integration via ICS/Google/Microsoft connectors.
- Localization for Polish/English copy.

## Analytics & KPIs
- Events: `microbreak_timer_started`, `break_completed`, `break_snoozed`, `activity_detail_opened`.
- KPI: Average breaks/day ≥3 for active users; reduction in reported musculoskeletal discomfort (survey) ≥15%.

## Non-Functional Requirements
- Timer runs client-side with background support; ensure low battery impact.
- Offline support (desktop app) storing completions locally.
- Accessible notifications (support screen readers, adjustable volume).

## Compliance & Access Control
- No medical claims; provide disclaimer for injuries.
- Store only aggregate completion data unless user opts in for detailed tracking.
- Staff access limited to aggregated analytics.

## Launch Readiness Checklist
- QA notification timing, calendar skips, and activity rotation.
- Validate ergonomics content and legal disclaimers.
- Update `/habits/tematy/ruch/` with tool promotion.

## Open Questions & Assumptions
- Potential integration with wearable step prompts? (future).
- Determine how to handle shift workers with irregular schedules.
