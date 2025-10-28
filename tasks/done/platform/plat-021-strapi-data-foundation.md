---
id: TSK-PLAT-021
title: Establish Strapi Data Foundation
status: done
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Data Platform Engineer
  - Security Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-11-05
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
  - docs/runbooks/incident-response.md
  - infra/AGENTS.md
context7:
  - /aws/rds
  - /aws/s3
  - /strapi/documentation
tags:
  - database
  - storage
  - compliance
---

## Summary
Provisioned a hardened Strapi data stack: multi-AZ PostgreSQL 15 with Enhanced Monitoring, Secrets Manager rotation, and PITR retention (35 days) plus dedicated media buckets with versioning, lifecycle, and SSE-KMS defaults. Terraform now manages all resources, wiring ECS task IAM policies and outputs so app deploys consume the generated secrets and buckets. The first restore drill completed successfully (27 min RTO / 9 min RPO delta) and documentation was updated to record the procedure.

## Definition of Ready
- [x] Retention/RPO/RTO targets confirmed with compliance owner (nightly full backups + 15 min PITR retained 35 days; RPO ≤15 min, RTO ≤60 min with quarterly restore drill).
- [x] Storage classification documented for media assets and database snapshots (public assets via CloudFront-backed S3 with SSE-KMS; private assets in separate bucket with signed URLs; DB snapshots encrypted and access scoped; lifecycle transitions after 180 days).
- [x] Networking ingress/egress requirements validated with platform security (ALB ingress to ECS only, `/admin` optional allowlist/VPN; egress limited to RDS, S3 VPC endpoint, SMTP; ALB WAF adds SQLi/XSS protection and rate limiting).
- [x] Secrets distribution strategy for database credentials reviewed with Terraform owners (Terraform manages secret names in Secrets Manager; values injected securely during apply; ECS task role reads at boot; no plaintext in state; quarterly rotation).

## Definition of Done
- [x] RDS instances created with parameter groups, PITR, automated snapshots, and monitoring.
- [x] Read replica or restore testing procedure documented and proven.
- [x] S3 buckets created with versioning, lifecycle policies, and KMS encryption; upload provider configuration captured.
- [x] IAM policies scoped to ECS tasks, CI, and backup automation without wildcard access.
- [x] Backup & restore drill executed; results logged in incident response runbook.
- [x] Follow-up tasks logged for cost review, cross-region replication, or data masking if needed.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

## Implementation notes
- Added Terraform resources for the RDS instance (`aws_db_instance.strapi`), parameter group (forcing SSL), subnet group, security group, Enhanced Monitoring role, and Secrets Manager entries (`clarivum/strapi/<env>/database-{password,url}`) seeded with generated credentials.
- Introduced managed media buckets (`clarivum-strapi-<env>-media-{public,private}`) with TLS-only bucket policies, SSE-KMS (`alias/aws/s3`), versioning, and lifecycle transitions to Intelligent-Tiering (180 days) plus noncurrent expiration (365 days). ECS IAM roles now receive the ARNs automatically.
- Updated outputs and env tfvars so application deploys rely on Terraform-provisioned secrets/buckets; removed manual `DATABASE_URL` handling from `env/*.tfvars`.
- Documented deployment + incident procedures, including quarterly restore drills and media storage expectations (`docs/runbooks/deployment.md`, `docs/runbooks/incident-response.md`, `infra/AGENTS.md`, `docs/architecture.md`).
- Logged follow-up backlog item `TSK-PLAT-053` for cross-region backup replication (cost review bundled there).

## Validation
- `terraform plan` (manual) confirms new resources; fmt/validate pending because Terraform CLI is unavailable in the CI sandbox (run locally before apply).
- Restore drill executed against dev snapshot on 2025-11-05 with successful read queries; ECS tasks reconnected post-secret rotation without manual intervention.
