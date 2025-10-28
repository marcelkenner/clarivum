---
id: sprint-09
title: Sprint 09 Plan
status: planned
start: 2026-03-17
end: 2026-03-28
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/homepage/feature-requirements.md
  - docs/PRDs/requierments/tools/skin/feature-requirements.md
  - docs/PRDs/requierments/tools/skin/widget_indeks_uv.md
  - docs/PRDs/requierments/tools/skin/tools_ascii_designs/widget_indeks_uv.md
  - docs/PRDs/requierments/glossary/cosmetic-ingredients-glossary.md
  - docs/adr/ADR-022-tools-and-calculators-platform.md
  - docs/adr/ADR-019-frontend-platform.md
  - docs/adr/ADR-018-brand-design-system.md
  - docs/adr/ADR-038-uv-widget-service-guardrails.md
  - docs/runbooks/tools-platform-operations.md
  - docs/runbooks/analytics-qa.md
---

# Sprint 09 Plan (Winter Weeks 11–12)

- **Window:** 2026-03-17 → 2026-03-28  
- **Sprint Goal:** Launch the first tools-first customer surfaces (UV hero, Fuel/Habits blueprints) and trust pages that leverage the telemetry + lifecycle machinery from earlier sprints.  
- **Theme:** “Tools & trust” — prove the customer value loop end-to-end before the Spring design/prototype season begins.  
- **Owners:** Frontend Platform Lead, Tools squad engineers, Brand Design Lead, Platform Engineer (tools API)  
- **Slack check-ins:** `#clarivum-frontend`, `#clarivum-tools`, `#clarivum-brand`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-019-uv-widget-wttr.md`](../../backlog/platform/plat-019-uv-widget-wttr.md) | Backlog → Ready → In-progress | `/api/tools/uv-widget` service layer w/ caching + rate limits |
| [`tasks/backlog/platform/plat-047-uv-widget-strapi-copy.md`](../../backlog/platform/plat-047-uv-widget-strapi-copy.md) | Backlog → Ready → In-progress | Strapi-managed UV risk copy + preview workflow |
| [`tasks/backlog/frontend/fe-010-uv-widget-hero.md`](../../backlog/frontend/fe-010-uv-widget-hero.md) | Backlog → Ready → In-progress | Homepage hero UV widget UX + analytics |
| [`tasks/backlog/frontend/fe-012-fuel-tools-blueprints.md`](../../backlog/frontend/fe-012-fuel-tools-blueprints.md) | Backlog → Ready → In-progress | Fuel tool shell + computation managers |
| [`tasks/backlog/frontend/fe-013-habits-tools-blueprints.md`](../../backlog/frontend/fe-013-habits-tools-blueprints.md) | Backlog → Ready → In-progress | Habits tool shell + telemetry + localization |
| [`tasks/backlog/shared/shared-005-glossary-platform.md`](../../backlog/shared/shared-005-glossary-platform.md) | Backlog → Ready → In-progress | Ingredient glossary ingestion feeding tool experiences |
| [`tasks/backlog/qa/qa-002-uv-widget-validation.md`](../../backlog/qa/qa-002-uv-widget-validation.md) | Backlog → Ready → In-progress | Automated + manual QA for UV widget data + analytics |

### Stretch

- [`tasks/backlog/frontend/fe-014-trust-pages-ascii.md`](../../backlog/frontend/fe-014-trust-pages-ascii.md) — finalize trust/brand surfaces if time remains.
- Kick off personalization follow-ups (diagnostics/tool recommendations) now that telemetry + tool shells exist.

## Definition of Success

- UV widget API delivers cached, localized, observable responses powering the homepage hero with rate limiting + Strapi-managed copy fallbacks.
- Hero UX meets UX/accessibility/performance criteria, publishes analytics + feature flag toggles, and ties into notification + lifecycle triggers (e.g., high UV campaigns).
- Fuel & Habits tool blueprints provide reusable shells, localization hooks, analytics events, and computation managers so additional calculators are low effort.
- Affiliate-first tools (Analiza Etykiety, Smart Zamienniki, Checklista Sypialni, Ocena Ergonomii) render standardized disclosure + CTA components with ADR-033 telemetry, while ebook-first tools (Cel Białko i Błonnik, BMR/TDEE, Macro Split, Meal Planner) expose dynamic `/ebooks/` offers so growth can attribute conversions.
- Ingredient glossary ingests nightly with localized UI feeding tool surfaces and monetization insights.
- QA automation + manual validation ensure UV widget, telemetry, and copy variations behave across consent states and locales.
- Documentation + Storybook entries teach teams how to extend the tool shells; Playwright + Vitest coverage ensures regression safety and runbooks (tools platform, analytics QA) reflect the new flows.
- Trust surfaces ready for Spring campaigns, with instrumentation piping into Plausible + monetization telemetry from previous sprints.

## Dependencies & Prep

- Confirm tool copy + data sources with Product + Science leads by 2026-03-10.
- Ensure Strapi content models for tool copy + UV risk messages are populated (Sprint 05 output) and API tokens available for preview flows.
- Align analytics event names with the Plausible catalog delivered in Sprint 08.
- Coordinate with lifecycle team (Sprint 07) on tool-triggered notifications.
- Prepare QA data fixtures + mocked Wttr.in responses for automation runs.

## Risks & Mitigations

- **API quota issues** → implement aggressive caching, fallback responses, and Ops Hub alerts for Wttr.in failures.
- **Tool scope creep** → deliver shell + 2-3 flagship tools per vertical; bucket the rest into Spring backlog with effort estimates.
- **Localization debt** → use Strapi-driven copy + pseudo-localization reviews before launch.

## Key Dates

- **Sprint Planning:** 2026-03-17  
- **Hero + tool shell design review:** 2026-03-20  
- **Customer beta release + Retro:** 2026-03-28 (share metrics + learnings heading into Spring)

---

Sprint 09 closes Winter with customer-visible value that exercises every guardrail added earlier in the quarter (IaC/CI, Ops Hub, revenue, notifications, telemetry). The delivered tool shells become the Spring starting point for new experiments and prototypes.
