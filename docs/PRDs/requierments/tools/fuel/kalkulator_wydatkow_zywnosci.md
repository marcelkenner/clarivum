# Feature Requirements — Fuel Tool: Kalkulator Wydatków Żywności

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Finance reviewer: Ops & Cost Analyst  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Help users budget weekly and monthly food expenses aligned with their meal plans and macro goals.
- Provide transparency on cost trade-offs and promote Clarivum shopping list planner.

## Target Outcomes
- Business: Increase grocery planner usage by 25%; convert 10% of budgeters into Clarivum membership or ebook buyers.
- Experience: 90% of users create a budget in under 2 minutes; satisfaction ≥4.5/5.

## Primary Users & Segments
- Families managing household grocery spend.
- Students/young professionals balancing macros with tight budgets.
- Athletes controlling supplement + grocery expenses.

## Experience Principles
- Keep interface approachable with default presets (solo, couple, family of 4).
- Provide actionable recommendations (swap suggestions, batch cooking tips) rather than just totals.
- Show price variability ranges to set realistic expectations.

## Functional Requirements

### FR1 — Input & Presets
- Users select household size, weekly cooking frequency, dietary preference, meal plan linkage (optional).
- Allow manual entry of baseline budget and current spend for comparison.
- Provide location toggle (urban, suburban, rural) adjusting price multipliers.

### FR2 — Cost Model Logic
- Base cost derived from meal plan or macro profile (ingredient list with unit cost).
- Maintain price database with categories: protein, produce, pantry, dairy, snacks, supplements.
- Calculate totals:
    - Weekly cost = sum(ingredient qty * price per unit).
    - Monthly projection = weekly cost * 4.33.
    - Provide min/max if price range exists.
- Include optional extras: eating out frequency, coffee/tea, supplements; allow user adjustments.
- Highlight savings opportunities: batch cooking (10–15% reduction), seasonal swaps, loyalty programs.

### FR3 — UI & Output
- Summary cards: baseline budget, projected spend, delta vs target.
- Category breakdown chart (stacked bar).
- Suggestions list (e.g., “Zamień łososia na makrelę – oszczędzasz 22 zł/tydz.”).
- Provide callouts for seasonal produce deals (via seasonality calendar data).

### FR4 — Export & Integration
- Export summary to PDF/CSV; push ingredient list to shopping planner with budget annotations.
- Allow saving multiple budget scenarios (e.g., “Cutting Phase”, “Family Week”).
- Provide notifications for budget deviations (opt-in weekly digest).

### FR5 — State Management
- Store user-specific adjustments in Profile `food_budget_profiles`.
- Support scenario duplication and editing.

## Content & Data Inputs
- Price data sourced from aggregated Polish grocery chains; updated monthly.
- Seasonality and substitution data from respective tools (kalendarz sezonowości, smart zamienniki).
- Copy localized via Strapi; disclaimers for price variability by region.

## Integrations & Dependencies
- Meal plan generator and Macro Manager for ingredient quantities.
- Smart substitutions for savings suggestions.
- Notifications Manager for digests.

## Analytics & KPIs
- Events: `food_budget_tool_open`, `budget_calculated`, `scenario_saved`, `shopping_list_synced`, `savings_tip_clicked`.
- KPI: Scenario save rate ≥30%; average projected savings communicated to user.

## Non-Functional Requirements
- Cost computation ≤200 ms with cached price tables.
- Provide offline support for last-synced price table.
- Ensure visualizations accessible with text alternatives.

## Compliance & Access Control
- Transparent about data sources; avoid overstating accuracy.
- Only Finance Analyst + Product may edit price database; maintain change log.
- Respect GDPR: allow deletion of saved budgets.

## Launch Readiness Checklist
- Validate sample scenarios (single person high protein, family vegetarian).
- QA integration with shopping planner.
- Update `/fuel/tematy/zakupy/` content with calculator CTA.

## Open Questions & Assumptions
- Determine approach for inflation adjustments (CPI integration?).
- Evaluate partnership with grocery delivery for real-time pricing in future.
