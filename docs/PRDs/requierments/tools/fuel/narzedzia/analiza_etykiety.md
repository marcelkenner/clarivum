# Feature Requirements — Fuel Tool: Analiza Etykiety

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Nutrition Science Lead  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Enable users to evaluate packaged food labels quickly against Clarivum Fuel standards (sugar, sodium, protein, fiber, additives).
- Drive trust by demystifying nutritional claims and linking to healthier substitutes.

## Target Outcomes
- Business: Increase affiliate conversions for approved products by 10%; boost newsletter opt-ins via label analysis by 15%.
- Experience: 80% of scans yield actionable feedback; user NPS for tool ≥45.

## Primary Users & Segments
- Grocery shoppers comparing packaged foods.
- Parents monitoring sugar/sodium for family meals.
- Health-conscious professionals auditing pantry items.

## Experience Principles
- Provide clear verdicts (“Świetny wybór”, “Uważaj na…”) with specific actionable tips.
- Accept both manual entry and photo upload/UPC lookup; keep flow under 60 seconds.
- Educate without fear tactics; highlight balanced swaps.

## Functional Requirements

### FR1 — Input Methods
- Manual entry form: product name, serving size, calories, macronutrients, sugar (total + added), fiber, sodium, saturated fat, ingredient list.
- Barcode/UPC entry (PL/EU standard) with optional photo upload; use OCR for label if no database match.
- Accept photo of nutrition table; OCR pipeline extracts values with manual confirmation step.

### FR2 — Data Retrieval & Validation
- First lookup via Clarivum curated database.
- Fallback to Open Food Facts API (`/api/v2/product/<barcode>.json`); map fields per ingestion spec from Context7 documentation.
- On missing data, request manual input and flag for curation queue.

### FR3 — Evaluation Logic
- Apply scoring rubric:
    - Sugar: green ≤5 g per 100 g (solid) / ≤2.5 g per 100 ml (drink); amber 5–15 g; red >15 g.
    - Sodium: green ≤120 mg per 100 g; amber 120–400 mg; red >400 mg.
    - Fiber: highlight positive if ≥3 g per serving.
    - Protein: highlight positive if ≥10 g per serving for protein-rich categories.
    - Saturated fat: warn if >5 g per 100 g.
    - Additives: flag if ingredient list contains restricted additives (list maintained by nutrition science).
- Provide overall traffic light verdict using weighted scoring; deliver personalized commentary based on user goals (if logged in).

### FR4 — Output & Recommendations
- Display summary card with traffic lights, key metrics, ingredient highlights.
- Offer swap suggestions via `smart-zamienniki-produktow` dataset (match category and improvement metrics).
- Provide share/export options (PDF/email) and save to pantry list (Profile > Pantry).

### FR5 — Education & CTA
- Show contextual tooltips (e.g., “Dlaczego limit cukru?”) referencing EFSA guidelines.
- Link to relevant content (articles, ebooks) and grocery planner integration.

## Content & Data Inputs
- Ingredient blacklist/alert list maintained in `label_analysis_rules` table.
- Localization content in Strapi (copy, disclaimers, thresholds by region).
- Open Food Facts ingestion scheduled daily; store normalized nutrition per 100 g/ml.

## Integrations & Dependencies
- OCR service (Google Vision or AWS Textract per ADR) with privacy guardrails (images deleted after processing).
- Pantry Manager for saved products.
- Smart Substitutions service for recommending alternatives.

## Analytics & KPIs
- Events: `label_analysis_initiated` (input_type), `label_analysis_completed` (verdict, data_source), `label_swap_clicked`, `label_saved`.
- KPI: Completion rate ≥75%; swap click-through ≥30%; affiliate click-through ≥12%.

## Non-Functional Requirements
- Response time ≤400 ms for database hits; ≤2 s including OCR.
- GDPR compliant: purge uploaded images after 24 h; anonymize usage data.
- Accessible: support screen readers for verdict, provide textual description for traffic light colors.

## Compliance & Access Control
- Display disclaimer: non-medical; verify claims with legal before updates.
- Admin access to modify thresholds restricted to Nutrition Science + Legal roles.
- Log barcode lookups for auditing (rate limit to prevent scraping).

## Launch Readiness Checklist
- Validate OCR accuracy across sample packaging (PL and EN).
- QA verdict scoring with SMEs; ensure swap suggestions align with affiliate agreements.
- Update support doc in `docs/runbooks/tools-platform-operations.md` with troubleshooting.

## Open Questions & Assumptions
- Should we support allergen detection in v1 or rely on future release?
- Need policy for user-submitted products (moderation SLA).
