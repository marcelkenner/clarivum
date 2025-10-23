# Feature Requirements — Fuel Tool: Baza Indeks GI & Zamienniki

> Product owner: Fuel PM  
> Science reviewer: Metabolic Health Specialist  
> Data steward: Nutrition Data Manager  
> Last updated: 2025-02-14

## Objective
- Provide a searchable database of foods with glycemic index (GI), glycemic load (GL), and recommended lower-GI substitutes.
- Support educational content, meal planning, and glycemic load calculator.

## Target Outcomes
- Business: Increase cross-tool usage with glycemic load calculator by 25%; drive 10% more newsletter signups for blood sugar series.
- Experience: Query latency ≤200 ms; user satisfaction with substitute recommendations ≥4.6/5.

## Primary Users & Segments
- Individuals managing blood sugar.
- Nutrition-conscious shoppers seeking better swaps.
- Coaches building meal plans for clients.

## Experience Principles
- Provide trustworthy, cited data; show GI testing sources and variability notes.
- Make substitution suggestions practical, locally available, and budget-aware.
- Support filtering by meal type, cuisine, preparation method.

## Functional Requirements

### FR1 — Data Structure & Search
- Database fields: food name, category, preparation state (raw/cooked), GI value, GL per typical portion, available carbs, portion size, fiber, substitution list, seasonality flag, pricing tier.
- Search features: keywords (PL/EN), filters (category, GI range, GI testing location, dietary preference), sorting (GI ascending, fiber descending).
- Provide API endpoint for other tools; respond in JSON with caching.

### FR2 — Substitution Logic
- Each food entry contains 1–3 substitutes with:
    - GI difference, macro differences, taste/texture notes, recipe compatibility.
    - Links to meal plan recipes using the substitute.
- Offer “smart swap” scoring (0–100) evaluating GI improvement, nutrient bonus, availability.
- Provide region-specific availability tags (Poland national vs niche).

### FR3 — UI Presentation
- Search results list with key metrics; detail page includes:
    - GI/GL chart, portion guidance, research citation (study year, population).
    - Macro breakdown, fiber, micronutrient highlights.
    - Substitution cards with call-to-action to add to grocery planner.
- Provide toggle to show per 100 g vs per serving data.

### FR4 — Data Stewardship & Updates
- Allow nutrition team to upload CSV/JSON updates; run validation (GI range 0–110).
- Track provenance: include study reference, sample size, measurement method.
- Build moderation queue for user-submitted updates (if activated in future).

### FR5 — Integrations & Flow
- Glycemic load calculator pulls GI values via API.
- Smart substitutions and grocery planner share dataset.
- Label analysis uses database to suggest lower-GI alternatives.

## Content & Data Inputs
- GI data curated from peer-reviewed studies; stored with citations.
- Pricing and availability from grocery price database.
- Localization via Strapi (descriptions, tips).

## Integrations & Dependencies
- Depends on nutrition data warehouse for ingestion pipeline.
- Connects to meal planner for linking recipes.
- API authentication via Tools platform tokens.

## Analytics & KPIs
- Events: `gi_database_search`, `food_detail_view`, `substitution_clicked`, `added_to_grocery`.
- KPI: Substitution click-through ≥35%; average session length ≥2.5 minutes.

## Non-Functional Requirements
- API responses cached (Redis) for 5 minutes; fallback to static JSON if outage.
- Ensure accessibility: data tables readable, support keyboard navigation.
- File updates validated automatically; rollback plan documented.

## Compliance & Access Control
- Cite all GI data; provide disclaimers about individual variability.
- Role-based access: only Nutrition Data Manager can approve updates.
- Log data changes with timestamp and editor.

## Launch Readiness Checklist
- Populate initial dataset (>=250 items) with verified references.
- QA substitution logic with dietitians.
- Update glycemic load tool and label analysis to consume API.

## Open Questions & Assumptions
- Should we expose API publicly? (likely no for MVP).
- Determine update cadence (quarterly recommended).
