---
id: TSK-PLAT-021
title: Establish Strapi Data Foundation
status: ready
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Data Platform Engineer
  - Security Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
  - docs/policies/error-budget-policy.md
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
Provision managed PostgreSQL 15 (RDS) and S3 storage for Strapi across dev and prod with backup, retention, and lifecycle policies aligned to ADR-010. Configure encryption, replication, and access controls so the CMS meets GDPR residency, recovery, and audit requirements.

## Definition of Ready
- [x] Retention/RPO/RTO targets confirmed with compliance owner (nightly full backups + 15 min PITR retained 35 days; RPO ≤15 min, RTO ≤60 min with quarterly restore drill).
- [x] Storage classification documented for media assets and database snapshots (public assets via CloudFront-backed S3 with SSE-KMS; private assets in separate bucket with signed URLs; DB snapshots encrypted and access scoped; lifecycle transitions after 180 days).
- [x] Networking ingress/egress requirements validated with platform security (ALB ingress to ECS only, `/admin` optional allowlist/VPN; egress limited to RDS, S3 VPC endpoint, SMTP; ALB WAF adds SQLi/XSS protection and rate limiting).
- [x] Secrets distribution strategy for database credentials reviewed with Terraform owners (Terraform manages secret names in Secrets Manager; values injected securely during apply; ECS task role reads at boot; no plaintext in state; quarterly rotation).

## Definition of Done
- [ ] RDS instances created with parameter groups, PITR, automated snapshots, and monitoring.
- [ ] Read replica or restore testing procedure documented and proven.
- [ ] S3 buckets created with versioning, lifecycle policies, and KMS encryption; upload provider configuration captured.
- [ ] IAM policies scoped to ECS tasks, CI, and backup automation without wildcard access.
- [ ] Backup & restore drill executed; results logged in incident response runbook.
- [ ] Follow-up tasks logged for cost review, cross-region replication, or data masking if needed.
