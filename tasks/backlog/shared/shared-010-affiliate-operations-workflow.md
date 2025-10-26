---
id: TSK-SHARED-010
title: Stand Up Affiliate Operations Workflow
status: backlog
area: shared
subarea: partnerships
owner: Partner Ops Lead
collaborators:
  - Content Strategist
  - Finance Analyst
  - Platform Engineer
effort: small
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/affiliate/feature-requirements.md
  - docs/adr/ADR-035-affiliate-catalog-and-offer-management.md
  - docs/runbooks/affiliate-ad-ops.md
  - docs/PRDs/requierments/glossary/cosmetic-ingredients-glossary.md
context7:
  - /strapi/documentation
  - /supabase/supabase
  - /airtable/product-guru
tags:
  - affiliate
  - operations
  - compliance
---

## Summary
Design and document the day-to-day workflow for onboarding partners, curating offers, associating offers with glossary/tool taxonomy, and reconciling payouts using the new Affiliate Catalog Service (ACS).

## Definition of Ready
- [ ] Catalog data model validated (TSK-PLAT-046) and Strapi plugin UX mock-ups available.
- [ ] Partner lifecycle requirements gathered from finance, legal, and marketing.
- [ ] Glossary + tools editors aligned on taxonomy naming alignment.
- [ ] Slack/issue escalation paths drafted (`#clarivum-partners`, Kaizen guardrail template).

## Definition of Done
- [ ] Operating procedure documented in `docs/runbooks/affiliate-ad-ops.md` covering partner onboarding, offer approvals, kill switch usage, freshness audits, and payout reconciliation.
- [ ] Training materials (Loom walkthrough + checklist) delivered for Content, Partner Ops, and Support teams.
- [ ] Glossary bulk-tagging workflow tested: editors associate an ingredient entry with an ACS offer via Strapi and see it live on the glossary page.
- [ ] Finance reconciliation workflow defined (CSV import template, variance thresholds, notification steps) and instrumented through Ops Hub widgets.
- [ ] Issue templates/automation (e.g., Kaizen guardrail for stale offers) updated to capture ACS context.
- [ ] Acceptance criteria: All relevant README/AGENTS/PRDs updated; partner contact sheet references ACS IDs.

## Notes
- Coordinate with legal on disclosure copy review cadence and ensure `/jak-zarabiamy/` stays aligned.
- Consider future automation (partner self-serve portal) but keep scope to internal workflow first.
