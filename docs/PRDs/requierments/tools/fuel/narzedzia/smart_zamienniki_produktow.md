# Feature Requirements — Fuel Tool: Smart Zamienniki Produktów

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Data steward: Ingredient Intelligence Manager  
> Last updated: 2025-02-14

## Objective
- Recommend smarter product substitutions that improve nutritional quality, cost, or convenience while respecting user preferences and constraints.
- Serve as shared engine for label analysis, shopping planner, and meal plans.

## Target Outcomes
- Business: Increase conversion on affiliate recommendations by 12%; drive 20% more adoption of healthier swaps.
- Experience: Substitution relevance rating ≥4.6/5; performance latency ≤200 ms.

## Primary Users & Segments
- Grocery shoppers seeking healthier or cheaper options.
- Meal planners adjusting recipes for allergies or macros.
- Users flagged by sugar/sodium monitor for high-risk items.

## Experience Principles
- Provide transparent reasoning (nutritional delta, price difference, availability).
- Respect dietary preferences and allergens—never recommend conflicting items.
- Offer multiple options (good, better, best) to encourage incremental improvements.

## Functional Requirements

### FR1 — Input Context
- Accept inputs from: label analysis (product barcode), shopping list items, recipe ingredients, manual product entry.
- Collect user constraints: allergens, dietary preference, budget tier, preparation effort tolerance.
- Capture desired improvement focus (`lower_sugar`, `higher_protein`, `lower_cost`, `sustainable`).

### FR2 — Substitution Engine
- Data sources: curated ingredient/product database with macros, micronutrients, cost, certifications.
- Scoring algorithm combines:
    - Nutritional delta (weighted by goal).
    - Cost difference (per serving).
    - Availability (country, seasonality).
    - Taste/texture similarity score.
- Generate up to three suggestions with explanation and impact metrics.
- Provide fallback same-brand alternative for limited availability.

### FR3 — UI Presentation
- Card per substitution showing:
    - Product image, macros comparison, price comparison, key claims.
    - Badges (e.g., “-40% cukru”, “+5g białka”).
    - Action buttons: “Dodaj do listy zakupów”, “Zapisz jako ulubione”.
- Provide evidence footnotes (data source, last update).

### FR4 — Learning & Personalization
- Allow users to rate substitutions; feed into model to improve suggestions.
- Track accepted vs dismissed swaps to adjust future recommendations.
- Offer ability to blacklist certain products or brands.

### FR5 — Integrations
- Feeds substitution suggestions to label analysis, shopping planner, meal generator, GI database.
- Supports API endpoint for other tools; authentication via tokens.
- Sync with affiliate tracking for recommended products.

## Content & Data Inputs
- Product database includes brand, ingredient list, nutrition, price, certifications, allergens.
- Data ingestion from Open Food Facts, partner retailers, manual curation.
- Copy for explanations stored in Strapi; templates for reason statements.

## Analytics & KPIs
- Events: `substitution_requested`, `substitution_viewed`, `substitution_accepted`, `affiliate_link_clicked`, `substitution_rated`.
- KPI: Acceptance rate ≥35%; affiliate link CTR ≥15%.

## Non-Functional Requirements
- API response ≤200 ms with caching.
- Handle fallback gracefully if data missing; provide manual suggestions.
- Accessible UI (text alternatives for images, keyboard navigation).

## Compliance & Access Control
- Ensure allergen information accurate; display disclaimers.
- Maintain audit logs for data updates; restricted access to ingredient database.
- Respect GDPR for user preference storage (ratings, blacklists).

## Launch Readiness Checklist
- Populate dataset with top 500 products + verified substitutions.
- QA scoring algorithm with nutrition team.
- Integrate with label analysis and shopping planner flows before launch.

## Open Questions & Assumptions
- Future machine learning enhancements? (collect acceptance data).
- Determine approach for supplements vs whole foods substitution boundaries.
