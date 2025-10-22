# Feature Requirements — Diagnostics & Quiz Flows

## Objective
- Deliver interactive diagnostics that guide visitors from high-level questions to tailored CTAs (ebooks, tools, recommendations) for each vertical.
- Capture segmentation signals to personalize subsequent experiences across the site and lifecycle communications.

## Target Outcomes
- Business: increase lead magnet conversions by presenting the most relevant ebook or tool based on diagnostic outcomes.
- Experience: ensure diagnostics can be completed within 2–3 minutes, with immediate, actionable recommendations and nurturing options.

## Primary Users & Segments
- Prospective customers unsure which Clarivum offering fits their needs.
- Segmentation: vertical (Skin, Fuel, Habits), user maturity (beginner, intermediate, advanced), behavioral intent (education, product purchase, habit change).

## Experience Principles
- Keep tone empathetic and educational; avoid medical claims while providing clear next steps.
- Show progress indicators and allow backward navigation without losing responses.
- Personalization starts post-consent; explain how answers will be used.

## Functional Requirements
- FR1 — Support modular question banks per vertical, including branching logic and weighted scoring.
- FR2 — Map outcomes to CTAs (primary ebook, secondary upsell, tool, newsletter segment) defined in `clarivum_brand.md`.
- FR3 — Persist diagnostic results to profile service when the user is authenticated; offer email capture for anonymous users to save results.
- FR4 — Trigger analytics events for start, completion, drop-off, and outcome selection.
- FR5 — Provide localized copy options and accommodate future languages without code changes.
- FR6 — Expose API endpoints for other surfaces (e.g., newsletter, CRM) to consume diagnostic insights.

## Content & Data Inputs
- Question sets, branching rules, and CTA mappings stored in Strapi or a dedicated configuration service.
- Persona definitions sourced from marketing strategy documents.
- Consent and privacy messaging reviewed by legal.

## Integrations & Dependencies
- Internal: profile/auth service, analytics, newsletter segmentation, tools/ebook catalogs.
- External: optional CRM or marketing automation platform to sync diagnostic outcomes.

## Analytics & KPIs
- Completion rate, drop-off points per question, CTA conversion uplift vs control, data quality (percentage of valid responses).
- Monitor segmentation accuracy and adjust mapping based on performance reviews.

## Non-Functional Requirements
- Load time for diagnostic start page ≤ 1.5 s; interactive steps should respond within 150 ms.
- Provide offline support for partially completed diagnostics with localStorage recovery.
- Ensure WCAG 2.2 AA compliance (keyboard navigation, descriptive labels, focus management).

## Compliance & Access Control
- Store only necessary data; avoid sensitive health information.
- Honor GDPR: allow users to request deletion of diagnostic responses.
- Content edits require review from product + legal, with version history maintained.

## Launch Readiness Checklist
- Question content signed off by subject matter experts and legal.
- QA coverage for branching logic and outcome mappings.
- Analytics dashboards prepared for performance monitoring.
- Support documentation created for interpreting diagnostic results.

## Open Questions & Assumptions
- Need confirmation on where diagnostics will live in IA (standalone routes vs embedded modals).
- Determine CRM integration approach (webhooks vs nightly batch).
- Assume diagnostics share design components with forms library; requires design validation.

