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
created_at: 2025-10-24
updated_at: 2025-10-28
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
- [x] Environments and throughput confirmed: dev and prod tenants targeting 50k emails/hour with concurrency tuning.
- [x] Infra blueprint aligned: ECS behind ALB within VPC private app/data subnets, security groups per `TSK-PLAT-001` standards.
- [x] PostgreSQL plan set: RDS Postgres multi-AZ `db.t4g.medium`, PITR 7-day, snapshot retention 35 days.
- [x] Secrets catalog defined: SMTP creds, admin accounts, API tokens in Secrets Manager with rotation policy.
- [x] Monitoring scope locked: delivery metrics, bounce rates, backlog/5xx alerts routed to observability team.

## Definition of Done
- [ ] Terraform modules provision ECS services, task definitions, autoscaling, RDS/PostgreSQL, and S3 backups with documentation.
- [ ] Secrets stored in AWS Secrets Manager, injected via CI/CD, and referenced in `.env.example` with least-privilege IAM roles.
- [ ] Health checks, HTTPS termination, logging, and dashboards configured; runbooks updated with deployment and recovery procedures.
- [ ] Listmonk admin initialized with RBAC, SMTP connectivity verified (via SES task), and smoke-tested newsletter + automation flows.
- [ ] Follow-up tasks filed for advanced analytics integrations or localization requirements discovered during rollout.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
