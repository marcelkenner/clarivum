---
id: TSK-PLAT-012
title: Provision Supabase Tenancy & Environment Secrets
status: done
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Backend Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-11-11
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
Supabase Terraform provisioning now derives the organisation UUID from the dashboard slug, eliminating hard-coded IDs and keeping env files clean. Env tfvars and ops docs are updated, unblocking apply + secret sync work.

## Definition of Ready
- [x] Supabase project inventory defined per environment (dev, prod) with required add-ons.
- [x] Terraform module boundaries identified (`supabase_project`, storage buckets, secrets).
- [x] Secrets flow confirmed with AWS Secrets Manager naming and CI scope.
- [x] Bucket structure and retention policy agreed upon (ebooks public/private, 180/365 lifecycle).

## Definition of Done
- [x] Supabase modules committed and documented.
- [x] Real Supabase organisation reference derived consistently (slug lookup or override).
- [ ] Terraform apply executed for dev/prod with outputs captured.
- [ ] Secrets synced into runtime environments and validated end-to-end connectivity.
- [ ] Follow-up tickets raised for schema migration automation and monitoring dashboards.
- [x] Docs/READMEs/AGENTS reflecting Supabase provisioning remain current.

## Completed
- [x] Created reusable Terraform modules for Supabase tenants and storage buckets.
- [x] Added `infra/supabase` root configuration with Secrets Manager integration.
- [x] Updated runbooks (`supabase-operations`, `secrets-management`) and AGENTS guides.
- [x] Documented slug verification flow in TODO.md and ops runbook.

## Follow-Up Tasks
- [ ] **Run Supabase Terraform apply** (`terraform -chdir=infra/supabase plan/apply`) once PAT + slug validated.
- [ ] **Sync Supabase secrets to runtimes** (Vercel, Lambda, local) and smoke test connectivity.
- [ ] **Raise schema automation task** covering migration pipeline & monitoring dashboards as planned.
