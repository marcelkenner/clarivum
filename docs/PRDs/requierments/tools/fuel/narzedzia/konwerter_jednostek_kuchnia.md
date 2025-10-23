# Feature Requirements — Fuel Tool: Konwerter Jednostek Kuchennych

> Product owner: Fuel PM  
> UX owner: Experience Design Lead  
> QA owner: Tooling QA Lead  
> Last updated: 2025-02-14

## Objective
- Provide a precise unit conversion tool for cooking measurements (metric, imperial, volume ↔ weight) tailored to Clarivum recipes.
- Reduce friction in meal preparation and support international audiences.

## Target Outcomes
- Business: Increase recipe completion rate by 10%; reduce support tickets about conversions by 50%.
- Experience: Conversion response instant (<50 ms); accuracy verified against lab measurements.

## Primary Users & Segments
- Polish users encountering foreign recipes.
- International audiences adapting Clarivum recipes.
- Meal prep enthusiasts scaling recipes up/down.

## Experience Principles
- Make conversions intuitive with context (ingredient density, measurement visuals).
- Support quick switching between single conversion and batch scaling.
- Provide reliability cues (source of density data, rounding explanation).

## Functional Requirements

### FR1 — Input Options
- Convert between volume, weight, temperature, and pan sizes.
- Support quick conversions (e.g., “1 cup oats → grams”) and advanced mode (bulk entries).
- Allow scaling recipes by servings; apply conversions automatically to ingredient list.

### FR2 — Ingredient Density Database
- Maintain density table per ingredient (e.g., almond flour, Greek yogurt).
- Source data from lab measurements or reliable references; store per temperature (if relevant).
- Provide fallback for unknown ingredient with generic category values; prompt user to confirm.

### FR3 — Conversion Logic
- Standard formulas:
    - Weight ↔ volume: `grams = volume_metric * density`.
    - Temperature: Celsius ↔ Fahrenheit ↔ Gas Mark.
    - Pan size adjustments: Use area comparisons to compute scaling ratio.
- Provide rounding rules (1 decimal for grams under 100g, nearest whole otherwise).
- Display error margin if density estimate used.

### FR4 — UI & Output
- Inline search for ingredient with autocomplete.
- Results card: precise conversion, rounding info, tips (“Użyj wagi kuchennej dla precyzji”).
- Provide quick copy/share buttons; allow export for entire recipe.
- Show measurement visuals (interactive diagrams) where helpful.

### FR5 — Integrations & Flow
- Embedded within recipes and meal planner; opens as modal or standalone `/fuel/narzedzia/konwerter-jednostek-kuchnia/`.
- Allows saving favorite conversions for quick access.
- Provide CTA to purchase recommended kitchen tools (affiliate link).

## Content & Data Inputs
- Density table stored in `ingredient_density` dataset; includes source citations.
- Copy localized via Strapi; disclaimers for estimation cases.
- Temperature conversions and pan data curated by culinary team.

## Integrations & Dependencies
- Recipe service for ingredient metadata (units, default weights).
- Shopping planner uses conversions for quantity adjustments.
- Analytics instrumentation to monitor usage.

## Analytics & KPIs
- Events: `conversion_performed` (type, ingredient), `recipe_scaled`, `favorite_saved`, `affiliate_tool_clicked`.
- KPI: Recipe scaling feature usage ≥20%; affiliate click-through ≥8%.

## Non-Functional Requirements
- Client-side calculations; ensure caching of density data.
- Provide offline capability with last-synced dataset.
- Accessible UI (ARIA labels, keyboard navigation).

## Compliance & Access Control
- Cite data sources for density; update logs stored.
- Only culinary/nutrition team can edit density dataset.
- Provide GDPR-compliant storage for favorites (opt-in).

## Launch Readiness Checklist
- Validate conversions for top 50 ingredients.
- QA integration inside recipe flow across devices.
- Update help center with conversion guidance.

## Open Questions & Assumptions
- Explore integration with voice assistants (future).
- Determine policy for user-submitted density corrections (moderation).
