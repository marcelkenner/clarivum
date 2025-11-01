---
id: TSK-PLAT-023
title: Provision Novu Notification Platform
status: backlog
area: platform
subarea: infrastructure
owner: DevOps Lead
collaborators:
  - Platform Engineer
  - Security Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-28
links:
  - docs/adr/ADR-012-notification-experience-and-toasts.md
  - docs/architecture.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/runbooks/notifications.md
context7:
  - /novuhq/docs
  - /aws/ecs
  - /hashicorp/terraform
tags:
  - notifications
  - infrastructure
  - aws
---

## Summary
Deploy a self-hosted Novu stack on AWS ECS Fargate with MongoDB and Redis backends managed through Terraform. Ensure networking, IAM, secrets, and scaling policies meet Clarivum security and reliability requirements while keeping operations aligned with ADR-012.

## Definition of Ready
- [x] Networking finalized: Novu self-hosted on ECS in private subnets with public ALB, minimal security groups approved.
- [x] Datastores chosen: MongoDB Atlas via PrivateLink plus Amazon ElastiCache Serverless Redis tier with backup policy and ownership confirmed.
- [x] Secrets catalog defined: `/novu/<env>/{api_key,worker_creds,smtp_*}` in Secrets Manager with documented rotation.
- [x] Logging/monitoring requirements locked: structured logs to CloudWatch, metrics into Grafana, alerts on queue lag and handler failures.

## Definition of Done
- [ ] Terraform modules provision ECS services (API, worker), ALB, autoscaling targets, and task definitions with injected secrets.
- [ ] MongoDB and Redis instances created with encryption, automated backups, and incident response procedures documented.
- [ ] Health checks, HTTPS termination, and private networking validated in dev and prod.
- [ ] CloudWatch dashboards/alerts created for API latency, worker queue depth, and resource utilization.
- [ ] Runbook updated with deployment, scaling, and recovery steps; follow-up tasks logged for cost optimization or multi-region resiliency.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
