# Feature Requirements — Fuel Tool: Planer Batch Cooking

> Product owner: Fuel PM  
> UX owner: Experience Design Lead  
> Culinary lead: Meal Prep Chef Consultant  
> Last updated: 2025-02-14

## Objective
- Enable users to plan efficient batch cooking sessions aligned with their macros, budgets, and schedules.
- Reduce weekday decision fatigue while minimizing food waste.

## Target Outcomes
- Business: Increase engagement with meal plan generator by 20%; grow grocery planner usage by 18%.
- Experience: 85% of users complete a batch plan within 5 minutes; satisfaction ≥4.5/5.

## Primary Users & Segments
- Busy professionals meal prepping on weekends.
- Families looking to streamline cooking.
- Athletes preparing consistent meals for training.

## Experience Principles
- Emphasize efficiency (time, oven usage) and storage safety.
- Provide customization (dietary preferences, equipment) without overwhelming.
- Offer storage and reheating guidance to ensure quality.

## Functional Requirements

### FR1 — Session Setup
- Users select prep window (hours available), number of meals/snacks to cover, household size, dietary preference, equipment list (oven, slow cooker, Instant Pot, blender).
- Option to import macros/meal targets from other tools.
- Provide slider for prep intensity (minimal, moderate, chef mode).

### FR2 — Recipe Selection & Scheduling
- Algorithm selects recipes optimized for overlapping ingredients, cooking methods, and storage duration.
- Steps:
    1. Filter recipes by dietary preference, equipment, shelf life.
    2. Group recipes sharing prep tasks (e.g., chopping, roasting) to minimize duplication.
    3. Sequence tasks with timeline (parallel steps allowed if equipment available).
    4. Ensure macros per day align with user targets within ±5%.
- Provide fallback suggestions if user modifies recipe selection.

### FR3 — Planner Output
- Display timeline view (Gantt-style) with tasks, durations, equipment usage.
- Provide consolidated shopping list (integration with list planner).
- Offer storage guidance: container types, fridge/freezer duration, reheating instructions.
- Include checklist mode for cooking day (mark tasks complete).

### FR4 — Save & Reuse
- Allow saving batch templates; duplicate for future weeks.
- Provide reminder system (schedule next prep session, thaw alerts).
- Track feedback on recipes (ratings to improve suggestions).

### FR5 — Integrations & Flow
- Pull macros from macro planner; push ingredient list to grocery tool.
- Sync with hydration/electrolyte calculators to remind about fluid intake during prep (optional).
- Provide CTA to meal plan generator for non-batch weeks.

## Content & Data Inputs
- Recipe metadata includes prep time, hands-on time, equipment, storage life.
- Storage safety guidelines stored in `food_storage_guides`.
- Copy localized via Strapi; include disclaimers (food safety, handling).

## Analytics & KPIs
- Events: `batch_plan_created`, `task_checklist_completed`, `shopping_list_synced`, `plan_saved`, `reminder_opt_in`.
- KPI: Checklist completion ≥60%; repeat usage (within 4 weeks) ≥40%.

## Non-Functional Requirements
- Scheduling algorithm runs server-side; response ≤500 ms for standard session.
- Offline capability for checklist (PWA caching).
- Accessible timeline (text summary, keyboard navigation).

## Compliance & Access Control
- Food safety notes reviewed by culinary lead; updates logged.
- User data stored securely; allow deletion of plans.
- Admin recipe metadata edits require QA verification.

## Launch Readiness Checklist
- QA timeline accuracy for sample sessions (2h prep, 6 meals).
- Validate storage guidelines for top recipes.
- Update marketing/email drip with batch cooking highlights.

## Open Questions & Assumptions
- Integration with smart kitchen devices? (future).
- Determine approach for dynamic yield adjustments (scaling beyond current max).
