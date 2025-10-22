# Feature Requirements — Tools & Calculators

## Objective
- Build and maintain the interactive tools catalog (`/narzedzia/` and vertical-specific tool hubs) that help users apply Clarivum guidance to daily routines.
- Drive engagement and lead capture by offering high-quality calculators, planners, and checklists.

## Target Outcomes
- Business: increase lead magnet conversions, drive ebook and subscription upsell through tool usage.
- Experience: ensure tools deliver actionable results within minutes and are easy to revisit or share.

## Primary Users & Segments
- Visitors seeking practical support (e.g., SPF calculator, meal planner, sleep tracker).
- Returning customers using tools to maintain routines.
- Segmentation: vertical (Skin, Fuel, Habits), goal (diagnosis, planning, tracking), persona maturity.

## Experience Principles
- Tools should reflect Clarivum’s calm, evidence-based tone; provide clear instructions and disclaimers.
- Prioritize responsiveness and accessibility so tools work seamlessly across devices.
- Encourage account creation or email capture when additional value is provided (save, export).

## Functional Requirements
- FR1 — Global tools index with filtering by vertical, tool type (calculator, planner, checklist), difficulty level, and time to complete.
- FR2 — Individual tool pages with hero, value statement, step-by-step interaction, results, CTA to related ebooks/coupons/diagnostics.
- FR3 — Support downloadable outputs (PDF, CSV) and ability to email results to the user.
- FR4 — Allow saving tool states for authenticated users; offer reminder scheduling via newsletter system.
- FR5 — Provide instrumentation for inputs, completions, and conversions.
- FR6 — Handle localization for copy, units (metric/imperial), and cultural nuances where applicable.

## Content & Data Inputs
- Tool specifications (inputs, formulas, output narratives) maintained in collaboration with subject matter experts; stored in structured format (Strapi or configuration service).
- Visual assets (icons, illustrations) per tool from design system.
- Legal disclaimers and usage notes from legal team.

## Integrations & Dependencies
- Internal: diagnostics (for pre-filled inputs), ebooks/recommendations, profile service (saved results), analytics, component library.
- External: third-party APIs if any tool requires external data (e.g., UV index feed), email service for result delivery.

## Analytics & KPIs
- Tool start vs completion rate, conversion to related CTA, average time spent, repeat usage frequency.
- Monitor data quality of saved results and export/download counts.

## Non-Functional Requirements
- Tools must load within 1.5 s initial rendering and respond to user actions within 150 ms.
- Ensure offline resilience for simpler calculators (local fallback).
- Meet WCAG 2.2 AA accessibility (keyboard support, focus management, descriptive outputs).

## Compliance & Access Control
- Provide non-medical disclaimers; avoid storing sensitive health data beyond minimal necessary inputs.
- Respect privacy preferences; saved results tied to authenticated users with deletion controls.
- Admin/editor access managed through Strapi or configuration management with approvals.

## Launch Readiness Checklist
- Each tool undergoes subject matter expert review, QA (functional + accessibility), and load testing where applicable.
- Documentation created for formulas/logic and maintenance schedule.
- Analytics events validated; dashboards set for monitoring.
- Support materials (FAQ, troubleshooting) prepared for customer service.

## Open Questions & Assumptions
- Determine list of MVP tools per vertical and prioritization.
- Clarify whether any API licenses are needed (e.g., weather data for UV index).
- Assume shared component patterns will cover most tool UI; escalate if bespoke interactions required.

