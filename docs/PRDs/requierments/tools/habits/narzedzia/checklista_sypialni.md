# Feature Requirements — Habits Tool: Checklista Sypialni

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Reviewer: Sleep Environment Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide an interactive bedroom optimization checklist covering light, sound, temperature, bedding, and routines to improve sleep environment.
- Enable users to track upgrades, link to supporting tools, and capture before/after outcomes.

## Target Outcomes
- Business: Increase affiliate conversions for sleep products by 15%; boost engagement with digital sunset planner and sleep index by 20%.
- Experience: 85% completion of checklist; perceived usefulness ≥4.6/5.

## Primary Users & Segments
- Adults improving sleep hygiene.
- Parents adjusting shared bedrooms.
- Renters seeking low-cost adjustments.

## Experience Principles
- Present recommendations in tiers (free tweaks, low-cost, premium).
- Use concise descriptions and visuals.
- Encourage incremental progress.

## Functional Requirements

### FR1 — Checklist Structure
- Categories: Light, Sound, Temperature & Air, Bedding & Mattress, Tech & Clutter, Wind-down Rituals, Safety.
- Each item includes description, estimated effort, cost range, impact rating.
- Allow marking as `done`, `in progress`, `not applicable`, `add to wishlist`.
- Provide photo upload optional for before/after.

### FR2 — Personalized Recommendations
- Inputs: chronotype, sleep regularity score, room size, climate, budget preference, allergies.
- Tailor suggestions (e.g., blackout curtains for evening types, air purifier for allergy reports).
- Link to relevant tools (digital sunset, hydration, nap planner) based on gaps.

### FR3 — Progress Tracking
- Dashboard showing completion percentage, high-impact items remaining.
- Offer timeline for scheduling upgrades; integrate with calendar reminders.
- Provide shareable summary for household members.

### FR4 — Integrations & Commerce
- Connect to affiliate catalog for recommended products; track clicks.
- Suggest meal or supplement tie-ins (e.g., magnesium) in context of bedtime routine.
- Feed improvements into sleep index (note when environment upgrades completed).

## Content & Data Inputs
- Checklist data stored in `sleep_environment_items` with citations to sleep medicine research.
- Product recommendations maintained by ops; include disclaimers.
- Localization via Strapi.

## Analytics & KPIs
- Events: `bedroom_checklist_started`, `item_completed`, `wishlist_saved`, `affiliate_link_clicked`.
- KPI: Completion of high-impact items ≥60% within 4 weeks; affiliate click-through ≥20%.

## Non-Functional Requirements
- Offline support to view checklist and mark progress.
- Accessible design (large tap targets, descriptive labels).
- Photos stored encrypted with auto-delete option.

## Compliance & Access Control
- Non-medical disclaimer; highlight that environmental changes support but do not treat disorders.
- User data (photos, notes) encrypted; allow deletion/export.
- Staff access limited to aggregated analytics.

## Launch Readiness Checklist
- Validate checklist with sleep environment specialist.
- QA personalization logic, localization, and affiliate tracking.
- Update `/habits/tematy/sen/` with tool introduction.

## Open Questions & Assumptions
- Should we suggest professional services (e.g., electricians) in future?
- Determine cadence for re-running checklist (seasonal prompts).
