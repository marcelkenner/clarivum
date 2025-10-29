---
id: TSK-PLAT-053
title: Enable Cross-Region Replication for Strapi Backups
status: backlog
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Reliability Lead
  - Security Lead
effort: small
created_at: 2025-11-05
updated_at: 2025-11-05
links:
  - docs/adr/ADR-010-content-management-platform.md
  - docs/PRDs/requierments/strapi/setup.md
  - docs/runbooks/incident-response.md
  - infra/AGENTS.md
context7:
  - /aws/rds
  - /aws/backup
tags:
  - guardrail
  - resilience
  - database
---

## Summary
Configure automated cross-region replication for Strapi PostgreSQL backups so the CMS meets business continuity targets. Extend Terraform to create the destination KMS key, backup vault, and `aws_db_instance_automated_backups_replication`, then document the failover drill.

## Definition of Ready
- [ ] Confirm target region (`eu-west-1`) and account quotas with the platform networking team.
- [ ] Align on cost impact and tagging expectations with Finance Ops.
- [ ] Produce rollback/runbook updates covering cross-region restore steps.

## Definition of Done
- [ ] Terraform provisions cross-region backup replication with customer-managed KMS keys.
- [ ] Monitoring/alerting added for replication lag or failures.
- [ ] Documentation updated (deployment + incident runbooks) with cross-region recovery steps and drill cadence.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
