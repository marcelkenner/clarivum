# Feature Requirements — Fuel Tool: Podział Makroskładników

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Data reviewer: Analytics Lead  
> Last updated: 2025-02-14

## Objective
- Help users translate calorie targets into personalized macronutrient splits aligned with Clarivum Fuel guidance.
- Provide reusable macro templates that feed meal planning, grocery lists, and sports profiles.

## Target Outcomes
- Business: Drive a 15% uplift in macro planning ebook downloads; generate 10% more saved meal plans week-over-week.
- Experience: 95% of users should finalize a macro split in <90 seconds; completion CSAT ≥4.6/5.

## Primary Users & Segments
- Weight management seekers connecting from BMR/TDEE tool.
- Strength athletes needing higher protein and periodised carbs.
- Plant-forward eaters balancing macros with fiber requirements.

## Experience Principles
- Respect cultural eating patterns: default macros to Polish Dietary Guidelines while allowing presets (High Protein, Low Carb, Balanced).
- Provide transparent math and explain trade-offs before saving changes.
- Encourage follow-on actions (meal plan generator, grocery list) with contextual CTAs.

## Functional Requirements

### FR1 — Input & Preset Selection
- Required: total daily calories (prefilled if coming from TDEE tool), goal (`maintain`, `fat_loss`, `muscle_gain`, `balanced_wellness`).
- Optional toggles: dietary preference (`omnivore`, `vegetarian`, `vegan`, `low_carb`, `mediterranean`), training intensity, fiber emphasis.
- Allow preset selection that sets macro ratios (e.g., Balanced 30/30/40) editable afterwards.

### FR2 — Macro Calculation Logic
- Ratios handle protein, fat, carbs; ensure sum = 100%.
- Default ratio table:
    - Balanced wellness: Protein 25%, Fat 30%, Carbs 45%.
    - Fat loss: Protein 30%, Fat 30%, Carbs 40%.
    - Muscle gain/high performance: Protein 30%, Fat 25%, Carbs 45%.
    - Low carb: Protein 30%, Fat 40%, Carbs 30%.
- Convert to grams: `grams = (calories * ratio / 100) / kcal_per_macro`, where kcal per macro = Protein 4, Carbs 4, Fat 9.
- Minimum thresholds: Protein ≥1.4 g/kg body weight (if weight known); Fat ≥20% calories; Carbs floor for vegans 35%.
- Provide fiber recommendation from `cel-bialko-i-blonnik` config; display as part of results summary.

### FR3 — UI & Output
- Live updating donut chart, macro bars, and grams table.
- Provide sample day split suggestions (breakfast/lunch/dinner/snacks) referencing meal generator presets.
- Allow user to save macro profile (requires auth) tagged with context (`default`, `half_marathon`, `cutting`).
- Provide export to PDF/CSV and share to grocery planner.

### FR4 — Coordinator Flows
- Accept deep links with query parameters (`?calories=2200&preset=fat_loss`).
- On save, trigger updates to Meal Plan service through Macro Manager API.

## Content & Data Inputs
- Preset definitions stored in `macro_profiles` table (editable by nutrition team).
- Copy & guidance managed via Strapi with localized fields.
- Pull fiber guidelines from `protein_fiber_targets` service.

## Integrations & Dependencies
- Consumes TDEE outputs via shared context when user comes from calculator.
- Saves to Profile service (macro_profiles).
- Feeds Meal Plan Generator and Grocery Planner through shared Macro Manager.

## Analytics & KPIs
- Events: `macro_tool_open`, `macro_ratio_adjusted` (delta), `macro_profile_saved`, `macro_export`.
- KPI: Save rate ≥35% for authenticated users; CTA click-through to meal plan generator ≥20%.

## Non-Functional Requirements
- Instant recalculation (<100 ms) on slider changes.
- Mobile-first layout with responsive charts; ensure color contrast meets WCAG.
- Store user custom ratios using double precision; round display to 1 decimal for grams.

## Compliance & Access Control
- Display disclaimer: macros for healthy adults; consult physician for medical conditions.
- Admin edits to preset table require dual approval (nutrition + product) with audit log.

## Launch Readiness Checklist
- Validate math against sample cases (1500/1800/2200 kcal).
- Confirm localization strings and CTA destinations.
- Update `/fuel/narzedzia/` index card with new macro planner.

## Open Questions & Assumptions
- Should keto (<10% carbs) be offered? pending dietitian policy.
- Need to clarify support for carb cycling (weekly averages) in future iteration.
