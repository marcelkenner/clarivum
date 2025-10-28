---
id: TSK-PLAT-012
title: Provision Supabase Tenancy & Environment Secrets
status: backlog
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Backend Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/supabase-platform/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/adr/ADR-007-secrets-management-and-configuration-distribution.md
  - docs/runbooks/supabase-operations.md
  - docs/runbooks/deployment.md
context7:
  - /supabase/supabase
  - /hashicorp/terraform
tags:
  - supabase
  - data-platform
  - infrastructure
---

## Summary
Provision Supabase projects for dev and prod, configure storage buckets, and distribute service credentials through secrets management so the Clarivum app, Strapi, and background jobs can rely on an EU-hosted data backbone.

## Definition of Ready
- [x] Supabase project inventory set: per-environment projects with add-ons `pg_cron`, storage, functions.
- [x] Terraform module boundaries defined: modules `supabase_project`, `supabase_bucket` emitting anon/service_role keys and DB URL for downstream use.
- [x] Secrets flow confirmed: names `/clarivum/supabase/<env>/{anon_key|service_role|db_url}` with CI limited to dev anon key.
- [x] Bucket structure/retention captured: `ebooks-public` (signed URLs limited) and `ebooks-private` (signed only) with 180d infrequent access and 365d glacier lifecycle.

## Definition of Done
- [ ] Supabase dev/prod projects created with Postgres 16, Storage buckets, and PITR enabled per ADR-001.
- [ ] Service roles, anon keys, and access tokens stored in secrets manager with rotation schedule documented.
- [ ] Baseline Terraform configuration merged and applied; `docs/runbooks/supabase-operations.md` updated with provisioning details.
- [ ] Connectivity validated from Next.js dev environment and Strapi webhooks using limited-scope keys.
- [ ] Follow-up tickets logged for schema migration automation and monitoring dashboards.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
