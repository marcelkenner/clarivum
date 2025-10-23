# Feature Requirements — Fuel Tool: Plan Utrata/Przyrost Masy

> Product owner: Fuel PM  
> Science reviewer: Body Composition Specialist  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Create personalized timelines for weight loss or gain based on caloric targets, body composition, and lifestyle constraints.
- Guide users to sustainable pacing, reinforcing Clarivum’s science-based coaching stance.

## Target Outcomes
- Business: Increase coaching inquiry submissions by 15%; drive 20% of plan users to set follow-up reminders.
- Experience: Users understand weekly targets (survey comprehension ≥4.5/5); drop-off before schedule creation <10%.

## Primary Users & Segments
- Individuals transitioning from calorie calculation to long-term planning.
- Strength athletes planning bulking/cutting cycles.
- Individuals seeking safe pacing for health reasons.

## Experience Principles
- Emphasize realistic, healthy rates; warn against extremes.
- Provide choice between structured schedule and flexible checkpoints.
- Offer supportive language and highlight non-scale victories.

## Functional Requirements

### FR1 — Input Gathering
- Required: current weight, target weight, time horizon or preferred pace (`slow`, `moderate`, `fast`), caloric target (prefill from TDEE).
- Optional: body fat % (prefill from US Navy tool), activity level changes over time, planned deload weeks, travel periods.
- Collect constraints: minimum calories/day, training schedule days/week.

### FR2 — Plan Calculation
- Calculate total weight delta; default pace:
    - Weight loss: slow 0.25% body weight/week, moderate 0.5%, fast 0.75%.
    - Weight gain: slow 0.25%, moderate 0.5%, fast 0.75%.
- Determine timeline weeks = `delta / (pace% * current weight)`.
- Adjust caloric target per week using energy gap: approx 7700 kcal per kg; adjust daily deficit/surplus.
- Provide refeed/deload suggestions every 6–8 weeks; prompt to re-evaluate macros.
- If timeline entered instead of pace, compute necessary rate and flag if unsafe (>1%/week).

### FR3 — Output & Guidance
- Timeline view (weeks) with milestones: weight checkpoints, body fat estimate, macro adjustments.
- Provide “Next steps” tasks (update macros, plan meal prep, schedule check-in).
- Include adaptation notes (plateau management, progressive overload, NEAT reminders).
- CTA to join newsletter or coaching if plateau persists.

### FR4 — Save & Reminder
- Authenticated users can save plan, sync to calendar (ICS export), set reminders.
- Provide weekly summary email/push with next goal, macro adjustments, motivational tips.
- Allow manual updates to current weight to track progress; update variance vs plan.

### FR5 — Coordinator & Integrations
- Pull data from BMR/TDEE, macro planner, body fat calculator.
- Send plan summary to hydration/caffeine tools for guidance adjustments.
- Provide “switch goal” toggle (loss ↔ gain) with new plan generation.

## Content & Data Inputs
- Guidance copy managed in Strapi; disclaimers for medical supervision.
- Motivation tips bank stored in `coaching_prompts` with tags (loss/gain/slump).
- Plateau strategies curated by science team.

## Integrations & Dependencies
- Profile service for storing plan timeline.
- Notifications Manager for weekly reminders.
- Analytics warehouse for tracking variance and retention.

## Analytics & KPIs
- Events: `weight_plan_created`, `plan_saved`, `reminder_set`, `progress_update_logged`, `cta_coaching_clicked`.
- KPI: Reminder opt-in ≥40%; average plan adherence (updates) ≥60% after 4 weeks.

## Non-Functional Requirements
- Calculations performed server-side for consistency; respond ≤200 ms.
- Support offline view of plan summary via PWA caching.
- Ensure accessibility of timeline (text alternative, keyboard navigation).

## Compliance & Access Control
- Display disclaimers (pregnancy, eating disorders, chronic illness).
- Provide easy access to support resources (helplines).
- Restrict internal access to aggregated analytics; personal data only by user consent.

## Launch Readiness Checklist
- Validate pace formulas with SMEs; test edge cases (large weight changes).
- QA calendar exports, reminders, data sync.
- Update `/fuel/start/` and relevant CTA sections.

## Open Questions & Assumptions
- Should we integrate readiness questionnaires (sleep, stress) before plan creation?
- Evaluate ability to incorporate adaptive algorithms based on logged progress (future release).
