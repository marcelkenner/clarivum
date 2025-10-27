# Feature Requirements — Habits Tool: Trener Oddechu

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Breathwork reviewer: Respiratory Therapist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Deliver guided breathing exercises tailored to stress relief, focus, and sleep preparation.
- Integrate with digital sunset planner, microbreak timer, and mood journal for holistic habit loops.

## Target Outcomes
- Business: Increase daily active sessions in Habits app by 15%; drive 20% more completion of digital sunset routines.
- Experience: 80% of users find sessions calming (post-session rating ≥4.5/5); session drop-off <10%.

## Primary Users & Segments
- Knowledge workers experiencing stress spikes.
- Individuals with pre-sleep anxiety.
- People seeking midday energy resets.

## Experience Principles
- Provide audio, visual, and haptic cues while remaining simple.
- Offer culturally neutral language with Polish localization.
- Encourage self-awareness without medical claims.

## Functional Requirements

### FR1 — Session Library
- Protocol categories: `calm` (4-6 breathing, box breathing), `focus` (stimulating breath), `sleep` (extended exhales), `energy` (breath of joy).
- Session length options: 1, 3, 5, 10 minutes.
- Each session includes guidance script, pace pattern, optional background sound.
- Tag sessions for contraindications (pregnancy, dizziness).

### FR2 — Personalization
- Inputs: goal, stress level (self-report or from mood journal), time of day, environment (quiet/noisy).
- Adjust breathing cadence and recommendations based on user comfort feedback.
- Suggest repeat frequency (e.g., 3 times/day) with reminder option.

### FR3 — UI & Delivery
- Visual breathing circle animation, optional textual cues.
- Audio narration with voice options; captions for accessibility.
- Provide progress indicator and gentle start/stop transitions.

### FR4 — Tracking & Insights
- Log sessions completed, rating, heart rate variability (if wearable connected).
- Offer streaks and milestones; display improvements in weekly health report.
- Suggest next best action (hydratation, microbreak, digital sunset step).

## Content & Data Inputs
- Scripts stored in Strapi; reviewed by respiratory therapist.
- Audio assets hosted on CDN; ensure offline caching for favourites.
- Integration with mood journal and stress data for personalization.

## Analytics & KPIs
- Events: `breath_session_started`, `session_completed`, `session_rated`, `reminder_set`.
- KPI: Completion rate ≥85%; average rating ≥4.5/5; repeat usage 3x/week for 40% of active users.

## Non-Functional Requirements
- Sessions stream or download; ensure <100 ms latency to start.
- Accessible design (high contrast, screen reader cues, adjustable text).
- Offline support for downloaded sessions.

## Compliance & Access Control
- Display disclaimer: not treatment for respiratory or anxiety disorders.
- Store logs encrypted; allow deletion/export.
- Staff access limited to aggregate analytics.

## Launch Readiness Checklist
- Validate scripts, pacing, and contraindication messaging.
- QA audio/video synchronization and offline caching.
- Update `/habits/tematy/stres/` with launch announcement.

## Open Questions & Assumptions
- Future integration with biofeedback devices?
- Determine best method for customizing pace for respiratory conditions.
