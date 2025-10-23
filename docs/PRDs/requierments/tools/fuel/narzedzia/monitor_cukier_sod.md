# Feature Requirements — Fuel Tool: Monitor Cukier & Sód

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide daily and weekly tracking of added sugar and sodium intake with personalized limits.
- Encourage mindful grocery choices by highlighting high-impact swaps and linking to label analysis.

## Target Outcomes
- Business: Increase retention of logged-in Fuel users by 10%; convert 15% of high-risk alerts into swaps or grocery planner usage.
- Experience: 80% of users log multiple days; satisfaction ≥4.3/5; alert accuracy validated by science team.

## Primary Users & Segments
- Adults monitoring metabolic risk factors.
- Parents planning family meals with reduced sodium/sugar.
- Athletes balancing carb intake with electrolyte needs.

## Experience Principles
- Provide gentle coaching; celebrate improvements rather than shaming overages.
- Ensure logs are quick: allow barcode scan, recipe import, manual entry.
- Display trends and actionable tips (swaps, hydration reminders).

## Functional Requirements

### FR1 — Intake Logging
- Logging modes:
    - Manual entry (food name, portion, sugar total/added, sodium).
    - Barcode/label import from Analysis tool.
    - Meal plan integration (auto-log chosen recipes’ sugar/sodium).
- Allow editing and deletion; maintain audit trail.
- Provide quick-add favorites and recent items.

### FR2 — Target Calculation
- Default daily limits:
    - Added sugar: 25 g women, 36 g men (AHA).
    - Sodium: 1500 mg optimum, 2000 mg caution.
- Personalize based on profile: overweight/obese or hypertension status reduces sodium target by 10%.
- Weekly summary: average and total vs target.

### FR3 — Feedback & Alerts
- Dashboard cards showing daily totals, remaining allowance, color-coded status.
- Provide historical chart (7/30 days).
- Alerts:
    - “High sodium day” if >120% target.
    - “Consistent high sugar” if 3-day rolling average >105%.
- Recommend actions: review label analysis, try smart substitution, consult hydration/electrolyte tool.

### FR4 — Reminders & Coaching
- Users can opt into push/email reminders to log meals.
- Provide weekly digest summarizing progress, top offending foods, suggested swaps.
- Allow toggling between grams and teaspoons (sugar), mg and %DV (sodium).

### FR5 — Data Persistence & Privacy
- Store logs in Profile `nutrient_intake` schema (timestamps, source, amounts).
- Allow export to CSV; enable delete on demand (GDPR).

## Content & Data Inputs
- Reference thresholds stored in `nutrient_guidelines` service; accessible for other tools.
- Copy localized via Strapi; include disclaimers for medical supervision.
- Swap suggestions from Smart Substitutions dataset; highlight low-sodium alternatives.

## Integrations & Dependencies
- Consumes data from Label Analysis, Meal Plan, Grocery Planner.
- Sends alerts via Notifications Manager (respecting preferences).
- Shares metrics with Analytics Warehouse for retention analysis.

## Analytics & KPIs
- Events: `sugar_sodium_log_created`, `log_edited`, `alert_triggered`, `swap_clicked`, `reminder_opt_in`.
- KPI: Weekly active rate ≥50% of loggers; alert conversion to action ≥30%.

## Non-Functional Requirements
- Logging operations ≤100 ms; offline support via PWA caching with sync.
- Ensure charts accessible (text equivalents, color contrast).
- Data retention default 12 months unless user requests deletion.

## Compliance & Access Control
- Medical disclaimer; advise users with chronic conditions to consult healthcare provider.
- Limit staff access to aggregated data; individual logs accessible only to user and authorized support.
- Provide explicit consent check before storing health-related flags.

## Launch Readiness Checklist
- QA log import accuracy from recipes and label analysis.
- Verify alert logic with test fixtures.
- Prepare support macros for data deletion requests.

## Open Questions & Assumptions
- Should we integrate with wearables tracking sodium via sweat? Future research.
- Determine best method for verifying user hypertension status (self-report vs clinician).
