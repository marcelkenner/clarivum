# Feature Requirements — Fuel Tool: Analiza Mikroskładników

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Micronutrient Specialist  
> Data steward: Nutrition Data Manager  
> Last updated: 2025-02-14

## Objective
- Provide a comprehensive analysis of vitamin and mineral intake vs recommended daily allowances (RDA) and tolerable upper limits (UL).
- Guide users to dietary adjustments, supplements, and educational content within Clarivum Fuel.

## Target Outcomes
- Business: Increase supplement guide downloads by 18%; drive 15% more grocery list adjustments targeting micronutrients.
- Experience: 90% data completeness when pulling from meal plans; satisfaction ≥4.6/5.

## Primary Users & Segments
- Individuals concerned about nutrient deficiencies (iron, vitamin D, etc.).
- Athletes optimizing performance.
- Plant-based eaters ensuring adequate micronutrient intake.

## Experience Principles
- Present complex data in digestible format (scorecards, color coding).
- Provide actionable suggestions via whole foods first, supplements second.
- Emphasize safe intake ranges; warn against exceeding ULs.

## Functional Requirements

### FR1 — Data Intake
- Sources: meal plan recipes, manual food logs, imported grocery list items.
- Allow manual entry of supplements with dosage and frequency.
- Support integration with third-party tracking apps (CSV import).

### FR2 — Calculation Engine
- Map food items to micronutrient content using Clarivum nutrient database (per 100 g or serving).
- Aggregate daily totals per nutrient; compare to RDA (age/sex-specific) and UL.
- Highlight deficiencies (<80% RDA) and excesses (>100% UL or threshold defined by science team).
- Provide weekly averages to smooth daily variability.

### FR3 — UI & Recommendations
- Dashboard:
    - Summary score for each nutrient (deficient, adequate, high).
    - Detailed tables with intake vs RDA/UL.
    - Trend charts for tracked period (7/30 days).
- Recommendation cards: food suggestions, recipe ideas, supplement guidance (with disclaimers).
- Provide interactive filters (focus on immune support, bone health, energy).

### FR4 — Alerts & Follow-up
- Alerts triggered when deficiency/excess persists for 3 consecutive days.
- Suggest scheduling blood test or consulting healthcare professional for critical nutrients (iron, B12, vitamin D).
- Link to relevant educational content and clarivum-run programs.

### FR5 — Save & Export
- Auth users save analysis reports; export PDF/CSV for healthcare provider.
- Provide ability to share with coach/nutritionist via share link (consent required).

## Content & Data Inputs
- RDA & UL values sourced from EFSA and Polish nutrition guidelines; stored in `micronutrient_reference`.
- Food micronutrient database from curated sources (Open Food Facts + lab data).
- Copy localized via Strapi; disclaimers for supplement usage.

## Integrations & Dependencies
- Meal plan, grocery planner, smart substitutions.
- Supplement recommendation engine (future) and Notification Manager for alerts.
- Analytics pipeline for aggregated nutrient trends.

## Analytics & KPIs
- Events: `micro_analysis_run`, `deficiency_alert`, `recommendation_clicked`, `report_exported`, `supplement_info_viewed`.
- KPI: Recommendation click-through ≥40%; resolution of deficiency (user logs improvement) within 2 weeks ≥30%.

## Non-Functional Requirements
- Calculations server-side due to data volume; response ≤400 ms.
- Ensure data normalized; handle missing nutrient values gracefully (flag).
- Accessible tables with descriptive text, color-blind friendly palette.

## Compliance & Access Control
- Medical disclaimers; encourage professional consultation before supplement changes.
- Sensitive data encrypted; user controls retention period.
- Admin edits to RDA/UL require science + legal approval.

## Launch Readiness Checklist
- Validate nutrient database coverage (≥85% of recipes complete).
- QA alert logic and recommendations for key nutrients.
- Update documentation with data governance procedures.

## Open Questions & Assumptions
- Integration with lab result upload for personalized targets? (future).
- Determine approach for children/pregnancy RDAs (phase 2).
