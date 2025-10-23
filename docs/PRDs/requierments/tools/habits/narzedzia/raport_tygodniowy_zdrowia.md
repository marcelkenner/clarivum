# Feature Requirements — Habits Tool: Raport Tygodniowy Zdrowia

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Data reviewer: Analytics Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Deliver a cohesive weekly summary across Habits tools (sleep index, mood journal, hydration, microbreaks, caffeine, blood pressure) that highlights wins, insights, and next actions.
- Reinforce retention through personalised coaching and cross-pillar content recommendations.

## Target Outcomes
- Business: Increase weekly active retention by 15%; drive 20% more multi-tool engagement (≥3 tools/week).
- Experience: Users rate report helpfulness ≥4.6/5; 60% click at least one recommended action.

## Primary Users & Segments
- Habit builders consolidating data across tools.
- Coaching clients needing structured recap.
- Users sharing progress with healthcare providers or partners.

## Experience Principles
- Keep narrative concise; focus on actionable insights.
- Highlight positive reinforcement before areas to improve.
- Ensure privacy controls (choose data to include).

## Functional Requirements

### FR1 — Data Aggregation
- Pull metrics from sleep index, social jetlag, mood journal, hydration, caffeine journal, microbreak timer, ergonomics assessments, blood pressure monitor, lab prep status.
- Calculate streaks, averages, deviations vs goals.
- Allow user to opt out of specific data streams.

### FR2 — Report Structure
- Sections: Highlights (wins), Focus Areas, Trends & Correlations, Upcoming Actions, Recommended Tools/Content.
- Visuals: mini charts, badges, heatmaps (sleep consistency vs mood), timeline for microbreaks.
- Provide plain-language summary and optional detailed view.

### FR3 — Delivery & Personalization
- Generate every Sunday (local timezone) with ability to adjust day/time.
- Delivery via in-app view + optional email/PDF export.
- Personalize recommendations (e.g., “Try breath session Monday morning”) based on top opportunities.
- Link to tasks (digital sunset adjustments, hydration reminder updates).

### FR4 — Feedback Loop
- Include quick survey (emoji scale) for report usefulness; capture free-text notes.
- Feed feedback to analytics for continuous improvement.
- Track follow-through on recommended actions.

## Content & Data Inputs
- Narrative templates stored in Strapi; support localization and personalization tokens.
- Data pipelines orchestrated via analytics service; ensure data freshness (max 6h lag).
- Coach prompts curated by behavioural science team.

## Analytics & KPIs
- Events: `weekly_report_generated`, `section_opened`, `recommendation_clicked`, `feedback_submitted`.
- KPI: Recommendation click-through ≥60%; weekly report open rate ≥75%.

## Non-Functional Requirements
- Report generation server-side; target <800 ms per user.
- Cache for offline reading once generated; indicate timestamp.
- Accessible layout (screen reader-friendly, high contrast).

## Compliance & Access Control
- Sensitive health data aggregated; ensure encryption and user consent for each data source.
- Provide ability to exclude specific metrics from report and to delete history.
- Staff access limited to anonymized aggregates; no individual report viewing without explicit user consent.

## Launch Readiness Checklist
- Validate data mappings and calculations across all source tools.
- QA email/PDF rendering, localization, and opt-out controls.
- Update support docs describing report contents and privacy.

## Open Questions & Assumptions
- Potential future tier for coach annotation or telehealth integration.
- Determine long-term storage policy (default 12 months, user configurable?).
