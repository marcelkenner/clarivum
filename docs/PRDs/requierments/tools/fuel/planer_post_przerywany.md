# Feature Requirements — Fuel Tool: Planer Post Przerywany

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Metabolic Health Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Help users plan and adhere to intermittent fasting (IF) protocols safely, aligning nutrition and hydration guidance with fasting windows.
- Educate about benefits, contraindications, and recovery strategies.

## Target Outcomes
- Business: Increase newsletter signups for fasting series by 15%; drive 20% more engagement with hydration and macro tools.
- Experience: 85% of users complete schedule setup; satisfaction ≥4.4/5; adherence reminders acknowledged ≥60%.

## Primary Users & Segments
- Adults experimenting with 16:8 or 14:10 windows.
- Individuals aiming for metabolic flexibility and weight management.
- Advanced users exploring 18:6, 20:4, or 5:2 protocols.

## Experience Principles
- Prioritize health and safety; screen for contraindications.
- Provide flexible scheduling, reminders, and meal timing suggestions.
- Encourage mindful transitions (fasting → feeding) with supportive content.

## Functional Requirements

### FR1 — Intake & Eligibility
- Collect user data: goal (`fat_loss`, `metabolic_health`, `focus`), experience level (`beginner`, `intermediate`, `advanced`), schedule constraints (work shifts), health flags (pregnancy, diabetes, eating disorder history).
- Run eligibility check; if contraindications detected, recommend professional consultation and block plan creation.

### FR2 — Protocol Selection
- Offer presets: 12:12 reset, 14:10 gentle, 16:8 standard, 18:6 advanced, 20:4 warrior, 5:2 (two low-cal days).
- Allow custom window with min/max guardrails (min 12h fast, max 20h fast for daily protocols).
- For 5:2, capture preferred low-cal days and caloric targets (~500 kcal women, ~600 men).

### FR3 — Schedule Builder
- Select start/end times for fasting window (per day). Provide suggestions for workdays vs weekends.
- Integrate with calendar (ICS exports) and push notifications for start/end reminders.
- Display overlapping meal times, linking to meal plan generator for feeding window meals.

### FR4 — Coaching & Monitoring
- Provide pre-fast checklist (hydration, electrolytes), breaking-fast tips (protein/fiber focus).
- Track adherence: user logs completion or adjustments; display streak and insights.
- Offer adjustments if user reports low energy/sleep issues (recommend longer eating window).

### FR5 — Integration & Data Flow
- Sync with hydration and electrolyte calculator to ensure sufficient intake.
- Macro planner adjusts meal distribution to feeding window.
- Weight plan uses fasting schedule to adjust caloric deficits.

## Content & Data Inputs
- Scientific references curated by nutrition science team.
- Copy localized via Strapi; include disclaimers.
- Reminder scripts stored in Notifications Manager templates.

## Analytics & KPIs
- Events: `fasting_plan_created`, `reminder_acknowledged`, `adherence_logged`, `adjustment_suggested`, `contraindication_flagged`.
- KPI: Adherence logging rate ≥50%; cross-tool engagement (hydration, macro) ≥30%.

## Non-Functional Requirements
- Scheduling stored server-side; notifications reliable (SLA 99%).
- Provide offline view of schedule with last sync timestamp.
- Accessible interface with clear timeline and textual explanations.

## Compliance & Access Control
- Strict disclaimers; require explicit consent acknowledging non-medical nature.
- Sensitive health flags stored encrypted; allow permanent deletion.
- Block plan creation for minors.

## Launch Readiness Checklist
- Validate scheduling logic across time zones.
- QA contraindication flow and messaging.
- Update `/fuel/tematy/post/` with tool CTA and support documentation.

## Open Questions & Assumptions
- Should we integrate continuous glucose monitoring insights (future).
- Determine approach for religious fasting variations (Ramadan-specific workflow).
