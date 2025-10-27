# Feature Requirements — Fuel Tool: Kalendarz Sezonowości

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Content owner: Culinary Content Lead  
> Data steward: Nutrition Data Manager  
> Last updated: 2025-02-14

## Objective
- Provide an interactive calendar showing seasonal availability of produce, fish, and regional staples in Poland.
- Guide users to fresher, cost-effective, and nutrient-dense choices within meal plans and shopping lists.

## Target Outcomes
- Business: Increase adoption of seasonality-based swaps in shopping planner by 25%; boost engagement with recipe content featuring seasonal ingredients by 15%.
- Experience: Query latency ≤150 ms; satisfaction with recommendations ≥4.6/5.

## Primary Users & Segments
- Meal planners optimizing freshness and cost.
- Home cooks exploring new ingredients.
- Budget-conscious users aligning purchases with seasonal deals.

## Experience Principles
- Visualize information clearly (monthly grid) and offer actionable tips (recipes, storage).
- Provide educational snippets about nutritional peaks and sustainability.
- Integrate seamlessly with other tools (shopping planner, smart substitutions).

## Functional Requirements

### FR1 — Data Structure & Navigation
- Dataset fields: ingredient name, category, peak months, shoulder months, storage tips, nutrient highlights, typical price index.
- UI: month selector, category filters (fruit, vegetables, herbs, fish), search bar.
- Display monthly view with ingredient cards (peak indicator, quick actions).

### FR2 — Recommendations & Integrations
- For selected month, surface top seasonal picks with:
    - Recipe suggestions (links to Clarivum recipes).
    - Shopping list shortcuts (“Add to list”).
    - Nutritional benefits (e.g., “Wysoka zawartość wit. C”).
- Provide substitution suggestions: if user selects non-seasonal item, recommend seasonal alternative.
- Integrate with grocery budget tool to adjust price assumptions for seasonal produce.

### FR3 — Localization & Content
- Provide Polish default; allow EN for future expansion.
- Include region tags (Polska północ/południe) when availability differs.
- Provide sustainability notes (certifications, overfishing alerts).

### FR4 — State & Personalization
- Auth users can favorite ingredients; receive push/email notifications when ingredient enters peak season.
- Provide custom calendar view highlighting favorites.
- Track user interactions to refine content recommendations.

### FR5 — Data Maintenance
- Admin interface for nutrition team to update seasonality table; audit log of changes.
- Set reminders for quarterly review of data (climate shift adjustments).

## Content & Data Inputs
- Seasonality data sourced from Polish agricultural reports and fisheries agencies.
- Nutrient highlights cross-referenced with Clarivum ingredient database.
- Copy & educational tips stored in Strapi with localized content.

## Integrations & Dependencies
- Shopping planner and smart substitutions for quick actions.
- Meal plan generator for recipe linking.
- Notifications Manager for seasonal alerts.

## Analytics & KPIs
- Events: `seasonality_view`, `ingredient_favorited`, `seasonal_swap_clicked`, `shopping_list_add`.
- KPI: Click-through to recipe or shopping list ≥30%; favorite retention (revisits) ≥50%.

## Non-Functional Requirements
- Static data cached; updates propagate within 15 minutes.
- Accessible UI: keyboard navigation, textual descriptions for color cues.
- Responsive design optimized for mobile use in store.

## Compliance & Access Control
- Cite data sources; include disclaimers about availability variability.
- Admin updates restricted to Nutrition Data Manager + Content Lead.
- Ensure GDPR compliance for notification opt-ins.

## Launch Readiness Checklist
- Populate initial dataset covering ≥80 seasonal items.
- QA integrations with shopping planner and substitution tool.
- Update site navigation and marketing to highlight calendar launch.

## Open Questions & Assumptions
- Explore integration with weather API for dynamic adjustments (future).
- Determine if push notifications should include recipe suggestions automatically.
