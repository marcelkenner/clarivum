# Feature Requirements — Fuel Tool: Cel Białko i Błonnik

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Data reviewer: Analytics Lead  
> Last updated: 2025-02-14

## Objective
- Provide individualized protein and fiber targets aligned with health and performance contexts.
- Encourage upsell to Clarivum meal plans and grocery planners that help users hit those targets.

## Target Outcomes
- Business: Grow download rate of `Smart Protein & Fiber` ebook by 18%; capture 25% more newsletter signups from the tool.
- Experience: 90% of users understand target explanation (tooltip helpfulness ≥4.5/5); return visits to adjust settings within 14 days ≥20%.

## Primary Users & Segments
- Active adults seeking muscle maintenance or growth.
- Individuals addressing satiety and blood sugar stability via higher fiber.
- Plant-based users verifying adequacy of protein and fiber.

## Experience Principles
- Explain *why* each target matters; link to credible sources and Clarivum content.
- Provide daily and per-meal breakdowns to make targets actionable.
- Keep UI empathetic: celebrate realistic progress rather than perfection.

## Functional Requirements

### FR1 — Input Configuration
- Required: weight (kg), biological sex, goal (`maintenance`, `muscle_gain`, `fat_loss`, `gut_health`), dietary pattern (`omnivore`, `vegetarian`, `vegan`, `flexitarian`).
- Optional: activity level, body fat %, caloric intake, digestive sensitivity (bloat prone).
- Accept manual override for target range (advanced users) but enforce guardrails.

### FR2 — Protein Target Logic
- Base formula: `protein_g = weight * factor`, with factor from table:
    - Maintenance: 1.4 g/kg
    - Muscle gain/high training: 1.8–2.2 g/kg (range surfaces min/max)
    - Fat loss: 1.6–2.0 g/kg
    - Gut health/balanced: 1.4–1.6 g/kg
- Adjustments:
    - Vegan/vegetarian: add +0.2 g/kg due to lower digestibility.
    - If caloric intake <1400 kcal, cap at 30% of calories / 4.
    - Provide per-meal suggestion assuming 3–5 meals (user chooses meal count).

### FR3 — Fiber Target Logic
- Use guideline: 14 g per 1000 kcal intake (Institute of Medicine). If calories unknown, default:
    - Women: 25–30 g/day.
    - Men: 30–38 g/day.
- Gut health goal adds +5 g (with caution note).
- If user flags digestive sensitivity, provide ramp-up plan (e.g., +3 g every 3 days) and hydration reminder.

### FR4 — UI & Coaching
- Results card: daily ranges, per-meal suggestions, example foods (pull from `smart-zamienniki-produktow` data).
- Provide toggle to show metric vs household units (cups/spoons).
- Offer integration buttons: send to meal generator, add to shopping list staples.

### FR5 — Save & Reminder
- Authenticated users can save targets and set reminders (push/email) for weekly check-ins.
- Coordinator ensures event scheduling integrates with Notifications Manager.

## Content & Data Inputs
- Copy stored in Strapi; tooltip content includes citations to EFSA/WHO.
- Food examples pulled from `ingredient_substitutions` dataset; fiber counts from Open Food Facts dataset (via `openfoodfacts` ingestion service referencing Context7 docs).
- Ramp-up schedule configurable in `protein_fiber_config` JSON.

## Integrations & Dependencies
- Links to Macro Split (prefills protein grams).
- Syncs with Profile `nutrition_targets` object.
- Notifications Manager for reminders; respects user opt-in status.

## Analytics & KPIs
- Events: `protein_fiber_tool_open`, `target_calculated`, `target_saved`, `reminder_opt_in`.
- KPI: Save rate ≥30%; follow-on click to meal generator ≥22%.

## Non-Functional Requirements
- Calculations performed client-side with validation; ensure rounding to 0.5 g.
- Provide accessible explanation modals, ARIA labelled; charts high contrast.
- Ensure hydration reminder copy adapts by locale.

## Compliance & Access Control
- Display disclaimers for renal issues, pregnancy, minors.
- Edit rights for configuration limited to Nutrition Science & Product; log updates.

## Launch Readiness Checklist
- Validate target ranges with SMEs for edge cases (high weight, vegan athletes).
- Confirm data sync to profile and notifications.
- Update `/fuel/tematy/bialko/` article CTAs.

## Open Questions & Assumptions
- Whether to incorporate lean body mass calculation automatically (needs body fat input).
- Pending decision on integration with supplement recommendations for protein powders.
