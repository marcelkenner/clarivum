---
id: TSK-PLAT-020
title: Provision Strapi ECS Infrastructure
status: ready
area: platform
subarea: infrastructure
owner: DevOps Lead
collaborators:
  - Platform Engineer
  - Editorial Engineering
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
  - docs/architecture.md
context7:
  - /strapi/documentation
  - /aws/ecs
  - /hashicorp/terraform
tags:
  - strapi
  - aws
  - infrastructure
---

## Summary
Build Terraform-managed AWS infrastructure for Strapi v5, including ECS services, load balancers, networking, and task definitions that inject secrets from AWS Secrets Manager. Ensure dev and prod workloads support blue/green deploys, health probes, autoscaling, and logging consistent with Clarivum’s platform standards.

## Definition of Ready
- [x] VPC, subnet, and security group conventions agreed with platform networking owners (VPC /16 across three AZs; subnets split into public ALB, private-app, private-data with NAT per AZ; SGs chaining ALB→ECS→RDS with least-privilege inbound/egress).
- [x] Container image registry strategy finalized (shared ECR repo per app using immutable tags `app:<git-sha>`, `app:staging`, `app:prod` with promotions retagging digests and SBOM attestations).
- [x] Secrets catalog approved, including database DSNs, upload provider credentials, and webhook tokens (catalog includes Strapi keys, JWT secrets, `DATABASE_URL`, S3 provider creds, webhook tokens, OAuth/SSO, email provider; stored in AWS Secrets Manager, ECS task role read-only).
- [x] Observability requirements (logs, metrics, traces) signed off with reliability lead (FireLens→CloudWatch logs 30 days, metrics on CPU/memory/5xx/p95 latency, OTEL traces to X-Ray, alerts for p95>1s sustained 15 min or 5xx>2% for 5 min).

## Definition of Done
- [ ] Terraform modules for ECS service, task definition, IAM roles, and ALB listener committed with documentation.
- [ ] Autoscaling policies configured (CPU and latency thresholds) and validated in dev.
- [ ] Task definitions mount secrets and config maps without embedding sensitive values in code or images.
- [ ] CloudWatch log groups, metrics, and alarms created; alerts wired to incident response channel.
- [ ] Deployment runbook updated with rollout/rollback procedures and health-check endpoints.
- [ ] Follow-up tasks logged for cost optimization or multi-region resiliency if needed.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

