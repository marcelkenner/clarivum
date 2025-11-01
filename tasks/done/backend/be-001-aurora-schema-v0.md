---
id: TSK-BE-001
title: Model Aurora Schema v0
status: done
area: backend
subarea: data-modeling
owner: Marcel (Backend Engineer)
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-27
links:
  - docs/PRDs/first_steps.md#4
  - docs/architecture.md
  - docs/PRDs/requierments/aurora-data-platform/feature-requirements.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/adr/ADR-036-supabase-schema-v0.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /postgresql/docs
tags:
  - aurora
  - schema
  - data-modeling
---

## Summary
Establish the initial Aurora (Postgres) schema, migrations, and indexing plan that support Clarivum's personas, content taxonomy, lead capture, and entitlements.

## Definition of Ready
- [x] Confirm product data requirements (personas, leads, entitlements) with business analyst (v0 scope locked: personas `{id,key,name,description}`, leads `{id,email,persona_id?,utm,source,created_at}`, entitlements `{id,user_id,feature_key,plan_key,starts_at,ends_at?}` with hashed emails for analytics).
- [x] Gather existing content taxonomy from `docs/PRDs/clarivum_brand.md` (requires machine-readable export `docs/PRDs/clarivum_brand.taxonomy.json` before schema work begins; gate via `taxonomy-frozen` label).
- [x] Align on naming conventions, auditing columns, and soft-delete policy per PTRD §4 (plural snake_case tables, UUID v7 PKs, audit columns `created_at/by`, `updated_at/by`, `revision`, soft delete via `deleted_at` with RLS defaults).
- [x] Document zero-downtime migration approach using shared migration runner (expand-migrate-contract pattern with dual-write feature flags, transactional migrations where safe, batched backfills, documented in `docs/runbooks/zero-downtime-migrations.md`).

## Definition of Done
- [x] SQL schema + migrations covering core entities (users, personas, content, entitlements).
- [x] Index plan documented for primary queries (JOIN/WHERE/ORDER BY) with rationale.
- [x] ADR addendum or new ADR summarizing trade-offs and future considerations.
- [x] Seed/fixture script committed for CI and local testing.
- [x] Documentation updates merged (`docs/architecture.md`, relevant runbooks).
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

## Outcome
- Aurora schema v0 applied with personas/profiles/leads/content/entitlements, audit helpers, and RLS guardrails (see ADR-036).
- Seed fixtures added for CI/local flows; schema captured in docs/architecture.md and zero-downtime runbook.
- Database clients and env configuration wired into repo; runtime secrets synchronized for deploy parity.


## Notes
Prereqs are locked; coordinate implementation sequencing with DevOps (Terraform task) to ensure infra alignment.
