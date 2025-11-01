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

## Design (2025-11-01)

```
Terraform (infra/app-data workspace)
 ├─ module.aurora ──► AWS RDS Aurora cluster + instance
 │     └─ optional existing subnet group / parameter groups
 └─ module.asset_buckets ──► S3 asset buckets (ebooks-public / ebooks-private)
```

- **State adoption flow**
  1. Select the target workspace (`terraform workspace select <env>`).
  2. Import existing resources into the module addresses (cluster, instance, subnet group, buckets).
  3. Run `terraform plan -var-file=env/<env>.tfvars` to confirm drift and accept any safe updates (e.g., deletion protection, copy tags to snapshot).
- **Naming alignment**
  - Provide explicit overrides when legacy resources deviate from module defaults (e.g., reuse existing subnet group `platform-dev-db-subnets` instead of creating `${var.name}-subnet-group`).
  - Ensure `force_random_suffix` is disabled in tfvars when we must target deterministic bucket names so imports succeed.
- **Secrets propagation**
  - After apply, capture outputs (`writer_endpoint`, `reader_endpoint`, secret ARNs) and feed them into `infra/aws/platform` tfvars and runtime secret sync scripts per `docs/runbooks/secrets-management.md`.
- **Acceptance checks**
  - `aws rds describe-db-clusters --db-cluster-identifier platform-<env>-aurora` returns `Status=available` and Serverless capacity bounds.
  - `aws s3api get-bucket-ownership-controls --bucket clarivum-app-<env>-ebooks-{public,private}` shows enforced ownership and matches lifecycle rules.
- **Current status (2025-11-01)**
  - Dev asset buckets are not yet provisioned in the platform account; Terraform is configured to skip bucket creation until the owning squad confirms the desired naming scheme.
  - Aurora dev/prod clusters are imported and mapped via `tools/infra/import_app_data.sh`; apply is blocked on aligning remaining drift once provider downloads are available in a networked shell.

## Risks & Mitigations
- IAM session expiry mid-apply → re-authenticate and re-run.
- Secrets drift between environments → automate via scripts and double-check with smoke tests.
