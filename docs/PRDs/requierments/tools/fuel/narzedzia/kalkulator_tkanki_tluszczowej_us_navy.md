# Feature Requirements — Fuel Tool: Kalkulator Tkanki Tłuszczowej (US Navy)

> Product owner: Fuel PM  
> Science reviewer: Body Composition Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide an accessible body fat percentage estimate using the US Navy circumference method, offering context for nutrition and training programs.
- Encourage deeper engagement with weight change planning and macro personalization.

## Target Outcomes
- Business: Drive 15% cross-traffic to `plan-utrata-przyrost-masy`; increase coaching inquiries by 8%.
- Experience: 90% of users complete calculation with correct measurements; comprehension of results ≥4.5/5.

## Primary Users & Segments
- Individuals tracking body recomposition.
- Users referred from BMI/WHR/WHtR for more tailored data.
- Fitness enthusiasts and coaches building programs.

## Experience Principles
- Provide clear measurement guidance (visual, step-by-step) to ensure accuracy.
- Explain limitations and encourage combination with progress photos and performance metrics.
- Keep interface empathetic; emphasize health, not aesthetics.

## Functional Requirements

### FR1 — Input Capture
- Required fields vary by sex:
    - Male: neck circumference (cm), waist circumference at navel (cm), height (cm).
    - Female: neck, waist (natural waist), hip circumference, height.
- Optional: measurement date, weight, measurement condition (morning/evening).
- Provide measurement instructions with diagrams, measurement validation (range checks).

### FR2 — Calculation Logic
- Use US Navy formulas:
    - Male: `%BodyFat = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76`.
    - Female: `%BodyFat = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387`.
- Ensure units converted to centimeters; log10 uses base 10.
- Validate `waist > neck`; if not, prompt correction.
- Provide lean body mass = `weight * (1 - bodyFat%)` if weight provided.
- Flag if result outside plausible range (2–75%).

### FR3 — Output & Interpretation
- Display body fat %, lean mass (if weight known), category guidance:
    - Athletic, Fitness, Average, Above Average, High (per ACSM ranges, sex-specific).
- Offer recommended next steps (macro adjustments, caloric target, training tips).
- Provide disclaimers about method limitations (water retention, non-binary guidance).

### FR4 — History & Export
- Allow saving results with date; show trendline.
- Export to PDF/CSV; share to training coach via link (optional).
- Provide reminder to re-measure (every 2–4 weeks) via Notifications Manager.

### FR5 — Integration & Flow
- Prefill waist/hip from BMI tool if available.
- Provide button to compute `cel-waga-na-bf` using current body fat.

## Content & Data Inputs
- Category thresholds stored in `body_fat_categories` config.
- Copy localized via Strapi; include references to US Navy method.
- Measurement graphics stored in CDN, accessible offline.

## Integrations & Dependencies
- Profile service for storing measurements.
- Notifications Manager for reminders.
- Macro planner uses lean mass to suggest protein targets.

## Analytics & KPIs
- Events: `bodyfat_tool_open`, `measurement_submitted`, `result_saved`, `reminder_opt_in`, `next_tool_clicked`.
- KPI: Save rate ≥40%; follow-up action (weight plan or macro tool) ≥30%.

## Non-Functional Requirements
- Calculations executed client-side; ensure log10 precision with double.
- Provide accessible instructions; support screen reader for forms and charts.
- Secure measurement data; encrypt at rest.

## Compliance & Access Control
- Display medical disclaimer; highlight that method is estimation.
- Limit staff access to aggregated analytics; no individual data without consent.
- Audit changes to category thresholds.

## Launch Readiness Checklist
- Validate formula outputs with known test cases.
- QA measurement guidance translation + images on mobile.
- Update cross-link cards in BMI tool to reference this calculator.

## Open Questions & Assumptions
- Should we add other methods (Jackson & Pollock) as advanced toggle? (future).
- Determine approach for non-binary users (provide best-fit guidance).
