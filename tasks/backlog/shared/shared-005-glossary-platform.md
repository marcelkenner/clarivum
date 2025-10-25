---
id: TSK-SHARED-005
title: Publish Cosmetic Ingredients Glossary
status: backlog
area: shared
subarea: knowledge-base
owner: Content Strategist
collaborators:
  - Backend Engineer
  - Localization Partner
  - Legal Partner
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-25
links:
  - docs/PRDs/requierments/glossary/cosmetic-ingredients-glossary.md
  - docs/PRDs/requierments/glossary/inci.md
  - docs/adr/ADR-010-content-management-platform.md
context7:
  - /strapi/documentation
  - /supabase/supabase
  - /vercel/next.js
tags:
  - glossary
  - content
  - localization
---

## Summary
Create the ingredient glossary data pipeline, editorial workflow, and UI so visitors can explore INCI information with localization and compliance guardrails.

## Definition of Ready
- [ ] Confirm data sources, normalization rules, and legal review cadence.
- [ ] Define content model fields and localization requirements in Strapi.
- [ ] Align frontend presentation patterns with component library.
- [ ] Plan enrichment (synonyms, tags) and search integration.
- [ ] Schedule sync checkpoint with Product Catalog owners to lock SKU/ingredient mapping workflow and `ProductIngredientSync` field contract.

## Definition of Done
- [ ] Glossary content model + ingestion pipeline operational with versioning.
- [ ] UI delivered with filtering, detail pages, and analytics instrumentation.
- [ ] Localization + accessibility checks completed.
- [ ] Editorial handbook + governance schedule documented.
- [ ] Follow-up tasks added for ongoing enrichment and automation.
- [ ] “Products with &lt;ingredient&gt;” module reads from the catalog-powered association component with freshness telemetry, and catalog + editorial teams acknowledge the weekly reconciliation ritual in the runbook.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

