---
id: TSK-PLAT-046
title: Build Affiliate Catalog Service & SDK
status: backlog
area: platform
subarea: monetization
owner: Platform Tech Lead
collaborators:
  - Partner Ops Lead
  - Content Platform Lead
  - Finance Analyst
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/adr/ADR-035-affiliate-catalog-and-offer-management.md
  - docs/PRDs/requierments/affiliate/feature-requirements.md
  - docs/adr/ADR-026-coupons-and-affiliate-incentives.md
  - docs/adr/ADR-033-advertising-and-affiliate-telemetry.md
  - docs/runbooks/affiliate-ad-ops.md
context7:
  - /supabase/supabase
  - /strapi/documentation
  - /vercel/next.js
  - /plausible/docs
tags:
  - affiliate
  - monetization
  - platform
---

## Summary
Deliver the Affiliate Catalog Service (ACS) that centralizes partner programs, offers, disclosures, and link templates, plus the APIs/SDK used by tools, glossary entries, recommendations, and Ops Hub.

## Definition of Ready
- [ ] Supabase schema outline (`affiliate_programs`, `affiliate_offers`, `affiliate_assets`, etc.) reviewed with data and finance stakeholders.
- [ ] Auth0 RBAC model for catalog management endpoints approved by security.
- [ ] Strapi component spec drafted for editor workflows (offer form, disclosure selector, taxonomy tagging).
- [ ] Telemetry payload contract aligned with ADR-033 so click/impression events carry ACS identifiers.
- [ ] Infrastructure budget confirmed (Supabase storage/functions, Vercel edge cache allowances).

## Definition of Done
- [ ] Supabase schema + migrations deployed with row-level security and audit logging.
- [ ] Management APIs (`/api/affiliates/v1/manage`) and public read endpoints (`/api/affiliates/v1/offers`) implemented with Auth0 + feature flags.
- [ ] `@clarivum/affiliate` SDK published (server + client helpers) with typed responses, disclosure utilities, and link builders.
- [ ] Strapi plugin ships catalog forms + workflows; webhooks sync data to Supabase and broadcast offer lifecycle events.
- [ ] Kill switch + short-link generator integrated with existing `/go/...` redirect handler.
- [ ] Tool and glossary reference implementations migrated to ACS (at least one Fuel tool + one glossary page), including cache strategy and fallback behavior.
- [ ] Observability + alerting wired: OTEL traces, Plausible counters, freshness job metrics feeding Ops Hub.
- [ ] Runbook (`docs/runbooks/affiliate-ad-ops.md`) updated with service overview, endpoints, and rollback instructions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, ADRs, and PRDs updated to reflect the implementation.

## Notes
- Pair with monetization telemetry team to ensure ACS IDs are propagated into click/impression logs for payout reconciliation.
- Coordinate with toolbox owners so blueprint CTA slots consume the SDK once merged.
