---
id: TSK-BE-001
title: Model Supabase Schema v0
status: ready
area: backend
subarea: data-modeling
owner: Unassigned
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-24
links:
  - docs/PRDs/first_steps.md#4
  - docs/PRDs/requierments/supabase-platform/feature-requirements.md
  - docs/architecture.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
context7:
  - /supabase/supabase
  - /postgresql/docs
tags:
  - supabase
  - schema
  - data-modeling
---

## Summary
Establish the initial Supabase (Postgres) schema, migrations, and indexing plan that support Clarivum's personas, content taxonomy, lead capture, and entitlements.

## Definition of Ready
- [x] Confirm product data requirements (personas, leads, entitlements) with business analyst (v0 scope locked: personas `{id,key,name,description}`, leads `{id,email,persona_id?,utm,source,created_at}`, entitlements `{id,user_id,feature_key,plan_key,starts_at,ends_at?}` with hashed emails for analytics).
- [x] Gather existing content taxonomy from `docs/PRDs/clarivum_brand.md` (requires machine-readable export `docs/PRDs/clarivum_brand.taxonomy.json` before schema work begins; gate via `taxonomy-frozen` label).
- [x] Align on naming conventions, auditing columns, and soft-delete policy per PTRD §4 (plural snake_case tables, UUID v7 PKs, audit columns `created_at/by`, `updated_at/by`, `revision`, soft delete via `deleted_at` with RLS defaults).
- [x] Document zero-downtime migration approach using Supabase CLI (expand-migrate-contract pattern with dual-write feature flags, transactional migrations where safe, batched backfills, documented in `docs/runbooks/zero-downtime-migrations.md`).

## Definition of Done
- [ ] SQL schema + migrations covering core entities (users, personas, content, entitlements).
- [ ] Index plan documented for primary queries (JOIN/WHERE/ORDER BY) with rationale.
- [ ] ADR addendum or new ADR summarizing trade-offs and future considerations.
- [ ] Seed/fixture script committed for CI and local testing.
- [ ] Documentation updates merged (`docs/architecture.md`, relevant runbooks).
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Prereqs are locked; coordinate implementation sequencing with DevOps (Terraform task) to ensure infra alignment.
