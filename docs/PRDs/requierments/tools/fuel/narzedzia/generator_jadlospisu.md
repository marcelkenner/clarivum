# Feature Requirements — Fuel Tool: Generator Jadłospisu

> Product owner: Fuel PM  
> UX owner: Experience Design Lead  
> Science reviewer: Nutrition Science Lead  
> Last updated: 2025-02-14

## Objective
- Generate flexible meal plans aligned with user macro, protein/fiber, and dietary preferences while showcasing Clarivum Fuel content.
- Serve as bridge between calculators and actionable grocery + prep workflows.

## Target Outcomes
- Business: Increase meal plan exports by 20%; convert 12% of users into newsletter or ebook leads.
- Experience: 85% of users complete plan creation in <3 minutes; satisfaction ≥4.4/5.

## Primary Users & Segments
- Busy professionals wanting done-for-you plans (omnivore/vegetarian/vegan).
- Fitness-focused individuals syncing macros from previous tools.
- Families needing batch-cook friendly meal schedules.

## Experience Principles
- Allow guided (“quick start”) and advanced (full customization) flows.
- Surface substitutions to respect taste, seasonality, and budget.
- Provide prepping tips and shopping list integration seamlessly.

## Functional Requirements

### FR1 — Input Flow
- Presets: “30 minut dziennie”, “High Protein”, “Budżet tygodniowy”, “Rodzinny (4 osoby)”.
- Required: calorie target (prefill), meals per day (3–6), dietary preference (`omnivore`, `vegetarian`, `vegan`, `pescatarian`), cooking effort (`minimal`, `balanced`, `chef`).
- Optional: allergens to avoid, disliked ingredients, batch cooking days, kitchen equipment available.

### FR2 — Meal Assembly Engine
- Uses recipe graph: each recipe tagged with macros, prep time, cost, allergens, seasonality.
- Algorithm steps:
    1. Filter recipes by dietary preference, allergens, seasonality (current month), equipment.
    2. Score candidates on macro fit: minimize variance between sum of recipe macros and target.
    3. Ensure variety (no recipe repeats within 2 days unless batch cooking selected).
    4. For batch cooking, assign large-portion recipes and reuse leftovers per plan (flag day+1).
- Macro compliance tolerance: daily totals within ±5% of target calories, protein ±10 g, fiber ±5 g.
- Provide snack library to fill gaps if macros slightly under target.

### FR3 — UI Presentation
- Day view (cards) with meal images, macros, prep time, instructions, substitution button.
- Weekly summary table (calories, macros, prep minutes).
- Buttons: “Zamień” (swap recipe), “Dodaj do listy zakupów”, “Eksport do PDF”.
- Inline disclaimers for medical conditions.

### FR4 — Save, Export & Iteration
- Auth users can save plan as template; versioning to keep history.
- Exports: PDF (with instructions), CSV (shopping list), Notion sync (via integration manager).
- Provide shareable link (read-only) for accountability partners.

### FR5 — Coordinator & State
- Keep wizard states via `MealPlanViewModel`; allow returning users to resume.
- Deep links support query string for preset scenario (e.g., `?preset=high_protein&source=macro_tool`).

## Content & Data Inputs
- Recipes managed in CMS (`recipes` collection) with nutritional data verified by nutrition team.
- Cost and seasonality metadata maintained in `recipe_metadata` table (monthly updates).
- Snack library stored separately; grooves with macros and convenience tags.

## Integrations & Dependencies
- Macro & protein/fiber targets consumed from previous tools.
- Shopping list planner integrates via `GroceryCoordinator`.
- Analytics instrumentation per `clarivum_meal_plan` schema.
- Notion export uses Integration Manager (requires user OAuth).

## Analytics & KPIs
- Events: `meal_plan_generated`, `recipe_swapped`, `shopping_list_pushed`, `plan_exported`.
- KPI: Export rate ≥45%; swap usage indicates personalization (target 25–40%).

## Non-Functional Requirements
- Generation latency ≤700 ms (cached recipe graph); escalate to async job if constraints heavy.
- Responsive design; offline-ready for saved plans (PWA storage).
- Ensure server scaling for peak Sunday evening usage.

## Compliance & Access Control
- Terms require acceptance before Notion sync (third-party data).
- Age gate: tool for adults; for minors prompt parental guidance note.
- Admin recipe edits require review workflow with approvals.

## Launch Readiness Checklist
- QA recipe data completeness and macros accuracy.
- Validate export formats; confirm CTA updates on `/fuel/narzedzia/`.
- Train support team with troubleshooting guide (common user issues).

## Open Questions & Assumptions
- Future addition: integrate grocery delivery APIs?
- Need internationalization considerations for other markets (units, ingredients).
