---
id: TSK-PLAT-012
title: Provision Aurora Cluster & Environment Secrets
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
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/adr/ADR-007-secrets-management-and-configuration-distribution.md
  - docs/runbooks/aurora-operations.md
  - docs/runbooks/secrets-management.md
  - docs/runbooks/deployment.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /hashicorp/terraform
tags:
  - aurora
  - data-platform
  - infrastructure
---

## Summary
Aurora Terraform provisioning now derives cluster identifiers and secret ARNs from the environment tfvars, eliminating hard-coded endpoints and keeping env files clean. Writer/reader endpoints and IAM auth roles are wired into Secrets Manager, unblocking downstream apply + secret sync work.

## Definition of Ready
- [x] Aurora cluster requirements documented per environment (dev, prod) with replica strategy.
- [x] Terraform module boundaries identified (`aurora_cluster`, secrets, parameter groups).
- [x] Secrets flow confirmed with AWS Secrets Manager naming and CI scope.
- [x] Snapshot retention + cross-region replication plan agreed upon (7-day PITR, 35-day manual snapshots).

## Definition of Done
- [x] Aurora Terraform modules committed and documented.
- [x] Cluster identifiers, parameter groups, and subnet groups generated consistently via Terraform outputs.
- [ ] Terraform apply executed for dev/prod with outputs captured.
- [ ] Secrets synced into runtime environments and validated end-to-end connectivity.
- [ ] Follow-up tickets raised for schema migration automation and monitoring dashboards.
- [x] Docs/READMEs/AGENTS reflecting Aurora provisioning remain current.

## Completed
- [x] Created reusable Terraform modules for Aurora clusters, parameter groups, and Secrets Manager bindings.
- [x] Added `infra/aws/data` root configuration with Secrets Manager integration.
- [x] Updated runbooks (`aurora-operations`, `secrets-management`) and AGENTS guides.
- [x] Documented endpoint verification flow in TODO.md and ops runbook.

## Follow-Up Tasks
- [ ] **Run Aurora Terraform apply** (`terraform -chdir=infra/aws/data plan/apply`) once IAM session validated.
- [ ] **Sync Aurora secrets to runtimes** (ECS, Lambda, local) and smoke test connectivity.
- [ ] **Raise schema automation task** covering migration pipeline & monitoring dashboards as planned.
