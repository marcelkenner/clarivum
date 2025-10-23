# Feature Requirements — Habits Tool: Chronotyp Screener

> Product owner: Habits PM  
> Behavioural science reviewer: Sleep Research Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Identify user chronotype tendencies (morningness-eveningness) using a validated questionnaire baseline.
- Tailor sleep, nutrition, and productivity recommendations across Clarivum experiences based on chronotype.

## Target Outcomes
- Business: Increase completion of personalized sleep plans by 20%; raise engagement with digital sunset planner by 15%.
- Experience: 90% questionnaire completion; user comprehension of chronotype summary ≥4.6/5.

## Primary Users & Segments
- Knowledge workers managing energy and focus.
- Shift workers seeking alignment strategies.
- Health enthusiasts optimizing training and sleep.

## Experience Principles
- Keep tone supportive; avoid labelling users negatively.
- Provide culturally relevant guidance (Polish workday norms).
- Offer quick completion (<3 minutes) with progress indicator.

## Functional Requirements

### FR1 — Questionnaire Flow
- 10–12 questions derived from reduced Morningness-Eveningness Questionnaire (MEQ-R); responses 5-point Likert.
- Provide optional context question about work schedule to refine recommendations.
- Support autosave (local storage) and profile persistence when authenticated.

### FR2 — Scoring Engine
- Sum weighted responses; score bands:
    - 70–86: Definite Morning.
    - 59–69: Moderate Morning.
    - 42–58: Intermediate.
    - 31–41: Moderate Evening.
    - 16–30: Definite Evening.
- Allow adjustments for shift workers (ask rotating schedule, apply offset).
- Store score + timestamp; allow re-test after 90 days.

### FR3 — Output & Guidance
- Present chronotype card with description, best wake/sleep window suggestions.
- Provide recommended actions: digital sunset start time, ideal workout slot, meal timing hints (link to okno żywieniowe planner).
- Offer downloadable summary and share-to-calendar feature for suggested routines.

### FR4 — Integration
- Feed chronotype into sleep consistency index and weekly health report.
- Update notifications (morning/evening prompts) respecting user preference.
- Provide API to other services for tailoring content modules.

## Content & Data Inputs
- Questionnaire copy localized via Strapi; cite MEQ-R reference.
- Guidance copy includes citations (e.g., published chronobiology research); maintain version history.

## Analytics & KPIs
- Events: `chronotype_screener_started`, `question_answered`, `chronotype_result_viewed`, `recommendation_clicked`.
- KPI: Recommendation click-through ≥30%; re-test rate at 6 months ≥20%.

## Non-Functional Requirements
- Completion latency minimal; scoring client-side with validation.
- Accessible components (ARIA for radio groups, keyboard navigation).
- Support offline completion with sync when online.

## Compliance & Access Control
- Display non-diagnostic disclaimer; encourage healthcare consultation for sleep disorders.
- Store results encrypted; allow user to delete at any time.
- Limit admin access to aggregated data; individual records require consent.

## Launch Readiness Checklist
- Validate questionnaire translation with behavioural science team.
- QA scoring accuracy and integrations with downstream tools.
- Update `/habits/start/` CTA and support documentation.

## Open Questions & Assumptions
- Whether to include social jetlag estimation inside screener (currently separate tool).
- Explore integration with wearable chronotype estimates in future release.
