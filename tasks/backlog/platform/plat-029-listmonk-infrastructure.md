---
id: TSK-PLAT-029
title: Provision Listmonk Messaging Infrastructure
status: backlog
area: platform
subarea: messaging-infrastructure
owner: DevOps Lead
collaborators:
  - Platform Engineer
  - Lifecycle Marketing Lead
effort: medium
created_at: 2025-10-27
updated_at: 2025-10-27
links:
  - docs/PRDs/requierments/newsletter/feature-requirements.md
  - docs/PRDs/requierments/ebooks/feature-requirements.md
  - docs/adr/ADR-013-mailing-platform-and-campaign-automation.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/runbooks/mailing-operations.md
  - docs/runbooks/deployment.md
context7:
  - /knadh/listmonk
  - /aws/ecs
  - /hashicorp/terraform
tags:
  - listmonk
  - ecs
  - infrastructure
---

## Summary
Deploy Listmonk as a hardened AWS ECS service with PostgreSQL storage, network isolation, and observability so Clarivum can deliver newsletters, lifecycle campaigns, and ebook fulfillment with compliant auditing.

## Definition of Ready
- [ ] Confirm required Listmonk environments (dev, prod), scaling targets, and throughput expectations with lifecycle marketing.
- [ ] Align infrastructure blueprint (VPC, subnets, security groups, ALB) with platform networking standards from `TSK-PLAT-001`.
- [ ] Document PostgreSQL sizing, backup retention, and restoration SLAs for mailing workloads.
- [ ] Capture secrets catalog (SMTP credentials, admin users, API tokens) and rotation policy in line with ADR-007.
- [ ] Validate monitoring/alerting requirements with observability owners (`TSK-PLAT-017` dependencies).

## Definition of Done
- [ ] Terraform modules provision ECS services, task definitions, autoscaling, RDS/PostgreSQL, and S3 backups with documentation.
- [ ] Secrets stored in AWS Secrets Manager, injected via CI/CD, and referenced in `.env.example` with least-privilege IAM roles.
- [ ] Health checks, HTTPS termination, logging, and dashboards configured; runbooks updated with deployment and recovery procedures.
- [ ] Listmonk admin initialized with RBAC, SMTP connectivity verified (via SES task), and smoke-tested newsletter + automation flows.
- [ ] Follow-up tasks filed for advanced analytics integrations or localization requirements discovered during rollout.
