---
id: TSK-PLAT-012
title: Provision Supabase Tenancy & Environment Secrets
status: in-progress
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Backend Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-11-05
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
Supabase Terraform scaffolding is merged (modules, secrets wiring, documentation). Awaiting environment credential application and runtime sync.

## Definition of Ready
- [x] Supabase project inventory defined per environment (dev, prod) with required add-ons.
- [x] Terraform module boundaries identified (`supabase_project`, storage buckets, secrets).
- [x] Secrets flow confirmed with AWS Secrets Manager naming and CI scope.
- [x] Bucket structure and retention policy agreed upon (ebooks public/private, 180/365 lifecycle).

## Definition of Done
- [x] Supabase modules committed and documented.
- [ ] Real Supabase organisation UUIDs populated in tfvars.
- [ ] Terraform apply executed for dev/prod with outputs captured.
- [ ] Secrets synced into runtime environments and validated end-to-end connectivity.
- [ ] Follow-up tickets raised for schema migration automation and monitoring dashboards.
- [ ] Docs/READMEs/AGENTS reflecting Supabase provisioning remain current.

## Completed
- [x] Created reusable Terraform modules for Supabase tenants and storage buckets.
- [x] Added `infra/supabase` root configuration with Secrets Manager integration.
- [x] Updated runbooks (`supabase-operations`, `secrets-management`) and AGENTS guides.
- [x] Documented follow-up actions in TODO.md for credential population and apply steps.

## Next
- [ ] Populate real Supabase organisation UUIDs in `infra/supabase/env/*.tfvars`.
- [ ] Run `terraform -chdir=infra/supabase plan/apply` with Supabase PAT for dev/prod.
- [ ] Sync `/clarivum/supabase/<env>/*` secrets into Vercel/Lambda and validate service connectivity.
