# Feature Requirements — Fuel Tool: Kalkulator BMI/WHR/WHtR

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Metabolic Health Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide anthropometric indicators (Body Mass Index, Waist-to-Hip Ratio, Waist-to-Height Ratio) in one trusted tool with guidance on interpretation.
- Educate users on health context and direct them toward personalized nutrition or training plans.

## Target Outcomes
- Business: Increase conversions to nutrition coaching funnel by 12%; grow email opt-ins from tool by 10%.
- Experience: Calculation latency <60 ms; comprehension (post-result tooltips helpfulness) ≥4.6/5.

## Primary Users & Segments
- Adults curious about metabolic risk.
- Users stepping down from medical consultations to lifestyle modifications.
- Fitness enthusiasts tracking physique changes.

## Experience Principles
- Deliver context-rich insights (risk bands, next steps) without stigmatizing language.
- Encourage better measurements (tutorial, visual guide).
- Offer cross-links to advanced tools (US Navy body fat, weight change plans).

## Functional Requirements

### FR1 — Input Capture
- Required: height (cm), weight (kg).
- Optional: waist circumference (cm), hip circumference (cm), sex at birth, measurement date/time.
- Provide measurement guidance (diagram) via tooltip.
- Store previous entries for authenticated users (history view).

### FR2 — Calculation Logic
- BMI = `weight / (height/100)^2`; categorize per WHO:
    - <18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30–34.9 obesity I, 35–39.9 obesity II, ≥40 obesity III.
- WHR = `waist / hip`; thresholds:
    - Men: <0.9 low risk, 0.9–0.99 moderate, ≥1.0 high.
    - Women: <0.8 low, 0.8–0.84 moderate, ≥0.85 high.
- WHtR = `waist / height`; thresholds general: <0.5 optimal, 0.5–0.59 caution, ≥0.6 high risk.
- Provide commentary explaining limitations (athletes, pregnancy).

### FR3 — UI & Guidance
- Results card shows each metric with color-coded status, trend (if historical data).
- Provide “What to do next” suggestions: macro planner, weight plan, consult professional.
- Offer note: BMI less relevant for high muscle mass; prompt to use body fat calculator.

### FR4 — History & Export
- Auth users can save measurements, view charts over time.
- Export as CSV/PDF; allow manual annotation (e.g., measurement context).

### FR5 — Coordinator & Flow
- Deep link support for autopopulated values from other tools (e.g., weight from profile).
- Encourage navigation to `plan-utrata-przyrost-masy` upon high BMI or weight change desire.

## Content & Data Inputs
- Thresholds stored in `risk_thresholds` configuration.
- Copy managed in Strapi; include legal disclaimers.
- Visual measurement guide assets stored in CDN.

## Integrations & Dependencies
- Profile service for saving metrics.
- Analytics event pipeline for tracking risk status distribution.
- Body fat calculator share data (waist measurement) to reduce duplicate input.

## Analytics & KPIs
- Events: `anthro_tool_open`, `metric_calculated` (type), `measurement_saved`, `cta_clicked`.
- KPI: Save rate ≥35%; cross-tool engagement (next tool open) ≥25%.

## Non-Functional Requirements
- Input validation ensures realistic ranges; highlight errors immediately.
- Accessible: tables and charts with textual description.
- Support both metric and imperial toggles.

## Compliance & Access Control
- Provide disclaimers: not diagnostic; pregnant individuals/power athletes see special note.
- Sensitive measurement data accessible only to user; allow deletion.
- Admin changes to threshold require legal + science approval.

## Launch Readiness Checklist
- QA formulas and rounding (1 decimal for BMI).
- Validate history chart rendering across browsers.
- Update `/fuel/narzedzia/` listing and support knowledge base.

## Open Questions & Assumptions
- Whether to add child/adolescent percentiles (requires pediatric data).
- Evaluate integration with wearable devices for auto waist measurement (future).
