---
id: TSK-PLAT-057
title: Apply Aurora Cluster Provisioning and Sync Secrets
status: backlog
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Backend Lead
  - Platform Engineer
effort: small
created_at: 2025-11-11
updated_at: 2025-11-11
links:
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/runbooks/aurora-operations.md
  - docs/runbooks/secrets-management.md
  - TODO.md
context7:
  - /websites/aws_amazon-amazonrds-aurorauserguide
  - /hashicorp/terraform
tags:
  - aurora
  - infrastructure
  - guardrail
---

## Summary
Execute the Aurora Terraform apply for dev and prod using the new cluster modules, then distribute the generated secrets across runtimes and validate connectivity so downstream teams can rely on the database migration.

## Definition of Ready
- [x] Aurora cluster parameters reviewed and approved (instance class, replica strategy, backup retention).
- [ ] AWS session credentials with apply permissions confirmed for target account.
- [x] Terraform workspace initialised (`infra/aws/data`).

## Definition of Done
- [ ] `terraform -chdir=infra/aws/data plan` and `apply` executed for dev/prod with artefacts archived.
- [ ] AWS Secrets Manager entries verified for each environment.
- [ ] Aurora connection strings synced to ECS, Lambda, and local `.env` with validation checklist complete.
- [ ] TODO entries for apply and secret sync closed or annotated with completion date.
- [ ] Runbook updated with apply timestamp + verification notes.

## Work Plan
- [ ] Assume platform IAM role, run Terraform plan/apply for dev.
- [ ] Repeat for prod (after change approval).
- [ ] Sync secrets to runtime environments and run connectivity smoke tests.
- [ ] Log completion in ops runbook + TODO tracker, notify stakeholders in `#clarivum-platform`.

## Risks & Mitigations
- IAM session expiry mid-apply → re-authenticate and re-run.
- Secrets drift between environments → automate via scripts and double-check with smoke tests.
