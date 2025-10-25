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
updated_at: 2025-10-25
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
- [ ] Inventory required Supabase projects, organizations, and add-on services with architecture lead.
- [ ] Confirm Terraform module boundaries from `TSK-PLAT-001` and required outputs for dependent services.
- [ ] Align secrets management flow (AWS Secrets Manager naming, CI integration) with security baseline.
- [ ] Capture storage bucket structure and retention requirements from product and content stakeholders.

## Definition of Done
- [ ] Supabase dev/prod projects created with Postgres 16, Storage buckets, and PITR enabled per ADR-001.
- [ ] Service roles, anon keys, and access tokens stored in secrets manager with rotation schedule documented.
- [ ] Baseline Terraform configuration merged and applied; `docs/runbooks/supabase-operations.md` updated with provisioning details.
- [ ] Connectivity validated from Next.js dev environment and Strapi webhooks using limited-scope keys.
- [ ] Follow-up tickets logged for schema migration automation and monitoring dashboards.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

