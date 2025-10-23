# Feature Requirements — Fuel Tool: Planer + Lista Zakupów z Budżetem

> Product owner: Fuel PM  
> UX owner: Experience Design Lead  
> Ops reviewer: Grocery Partnerships Lead  
> Last updated: 2025-02-14

## Objective
- Combine shopping list planning with real-time budget tracking to help users execute Clarivum meal plans efficiently.
- Encourage use of smart substitutions, seasonality, and bulk buying insights.

## Target Outcomes
- Business: Increase grocery list exports by 30%; drive 12% more affiliate clicks to partner stores.
- Experience: 90% of users build a list within 3 minutes; satisfaction ≥4.6/5.

## Primary Users & Segments
- Meal planner users preparing weekly shops.
- Budget-conscious households aligning with spending targets.
- Busy professionals needing shareable lists for household coordination.

## Experience Principles
- Ensure list building feels effortless—auto group items, highlight savings.
- Provide dynamic budget feedback (remaining, overage) with actionable suggestions.
- Support collaboration (shareable lists, assignments).

## Functional Requirements

### FR1 — List Creation & Inputs
- Sources: import from meal plan, add from recipe, manual item entry, scan barcode.
- Group by store section (produce, dairy, pantry).
- Allow specifying quantity, preferred brand, price caps, notes.

### FR2 — Budget Tracking
- Budget sources: from food expense calculator or manual entry.
- Each item includes price estimate (from price database) with ability to override.
- Display running total, remaining budget, savings suggestions.
- Provide “swap to save” prompts drawing on smart substitution & seasonality data.

### FR3 — Collaboration & Sharing
- Share list via email/link; allow collaborators to check off items.
- Real-time updates (websocket or polling) for multi-user editing.
- Provide version history to track changes.

### FR4 — Execution & Integrations
- Toggle for “Purchased” with actual price entry to refine future estimates.
- Offer export to PDF, CSV, Apple/Google wallet notes.
- Integrate with partner grocery APIs (if available) for cart pre-fill (future).

### FR5 — State & Reminders
- Save multiple lists (e.g., “Tydzień 7”, “Impreza weekendowa”).
- Remind users before weekly shopping day; include summary and quick add of staples.

## Content & Data Inputs
- Price data from `grocery_price_index`; seasonality cues from `kalendarz_sezonowosci`.
- Copy localized via Strapi; highlight disclaimers for price variability.
- Savings tips curated by ops team.

## Integrations & Dependencies
- Meal plan generator for ingredient import.
- Food expense calculator for budget baseline.
- Smart substitutions and seasonality tool for alternative suggestions.
- Notifications Manager for reminders.

## Analytics & KPIs
- Events: `shopping_list_created`, `item_added`, `budget_warning_shown`, `list_shared`, `list_exported`, `swap_clicked`.
- KPI: Export/share rate ≥50%; average savings suggestions accepted ≥25%.

## Non-Functional Requirements
- Autosave every action; offline support with sync.
- Responsive design for mobile grocery use; accessible checklists.
- Real-time collaboration latency ≤500 ms.

## Compliance & Access Control
- Handle household sharing under GDPR (explicit consent by owner).
- Only aggregated price data stored; individual purchases optional and encrypted.
- Admin updates to price data require approval workflow.

## Launch Readiness Checklist
- QA list import accuracy, budget calculations, and sharing flows.
- Validate localization and offline mode.
- Update `/fuel/tematy/zakupy/` and marketing assets with tool CTA.

## Open Questions & Assumptions
- Investigate integration with loyalty programs for receipt upload.
- Determine support for multiple currencies in future expansion.
