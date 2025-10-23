# Feature Requirements — Fuel Tool: Ładunek Glikemiczny

> Product owner: Fuel PM  
> Science reviewer: Metabolic Health Specialist  
> Data reviewer: Analytics Lead  
> Last updated: 2025-02-14

## Objective
- Help users evaluate the glycemic load (GL) of meals and recipes to manage blood sugar.
- Integrate with meal planning and label analysis to encourage lower-GL choices.

## Target Outcomes
- Business: Increase cross-usage with meal generator by 20%; capture 8% more leads for glucose-focused content.
- Experience: Calculation accuracy validated against reference tables; user understanding (post-tool survey) ≥4.4/5.

## Primary Users & Segments
- Individuals monitoring blood glucose (prediabetes, insulin resistance).
- Athletes timing carbohydrate intake.
- Caregivers planning balanced meals for family members.

## Experience Principles
- Provide quick, reliable GL scores with actionable guidance (swap suggestions, fiber tips).
- Transparently display data sources and encourage professional consultation for medical decisions.
- Support manual ingredient entry and recipe import from Clarivum meal plans.

## Functional Requirements

### FR1 — Input Options
- Manual entry: user lists ingredients with carbohydrate amount (g) and portion size.
- Food lookup: search curated GI/GL database; fallback to Open Food Facts + internal GI table.
- Meal import: select from saved meal plan or recipe to auto-populate ingredients.
- Support adjustments for cooked/raw states and ripeness levels where data exists.

### FR2 — Calculation Logic
- For each ingredient:
    - Carbs available = total carbs − fiber.
    - Glycemic load per component: `GL = (GI * availableCarbs) / 100`.
    - GI defaults from dataset; allow user override if brand-specific data differs.
- Meal GL = sum of ingredient GLs.
- Provide categorization: Low (<10), Medium (11–19), High (≥20).
- Offer fiber and protein augmentation prompts to reduce GL impact.

### FR3 — UI & Output
- Display per-ingredient table (GI, available carbs, GL contribution).
- Provide gauge visual for total GL with textual explanation.
- Suggest swaps with lower GI alternatives (pull from substitution dataset).
- Provide “post-meal monitoring tips” CTA linking to educational content.

### FR4 — Save & Compare
- Allow users to save GL profiles and compare meals over time.
- Offer trend view (line chart) for logged meals (requires profile).
- Export data to CSV for healthcare consultations.

### FR5 — Coordinator & Navigation
- Deep links for prefilled recipes; shareable results link.
- Encourage follow-on routing to `monitor-cukier-sod` and `planer-post-przerywany`.

## Content & Data Inputs
- Core GI table derived from peer-reviewed sources; stored in `glycemic_index_reference`.
- Open Food Facts provides macro data; GI bridging table maintained by science team.
- Copy localized via Strapi; disclaimers include medical advisory.

## Integrations & Dependencies
- Uses Recipe service for meal import.
- Writes GL history to Profile analytics (opt-in).
- Shares substitution suggestions with Smart Substitutions service.

## Analytics & KPIs
- Events: `glycemic_tool_open`, `ingredient_added` (source), `gl_calculated`, `gl_saved`, `swap_clicked`.
- KPI: Save rate ≥25%; average GL reduction for returning users ≥3 points.

## Non-Functional Requirements
- Calculation executed client-side; ensure precision with two decimals before rounding.
- Database lookup latency ≤200 ms (cached).
- Provide accessible table with keyboard entry, supporting screen readers.

## Compliance & Access Control
- Medical disclaimer: not diagnostic; encourage consultation.
- Sensitive data flagged; deletion available on request.
- Only nutrition science team can edit GI table; track change history.

## Launch Readiness Checklist
- Validate GL outputs against reference meals (white rice, oatmeal, etc.).
- QA integrations with meal plan import/export.
- Update `/fuel/tematy/cukier/` content with tool embed link.

## Open Questions & Assumptions
- Future integration with CGM (continuous glucose monitor) data?
- Determine cadence for GI table updates (quarterly suggested).
