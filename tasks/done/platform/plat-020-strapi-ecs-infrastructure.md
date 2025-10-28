---
id: TSK-PLAT-020
title: Provision Strapi ECS Infrastructure
status: done
area: platform
subarea: infrastructure
owner: DevOps Lead
collaborators:
  - Platform Engineer
  - Editorial Engineering
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-27
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
Terraform modules now provision the Strapi ECS topology—cluster, IAM roles, ALB, task definitions, autoscaling, and CloudWatch alarms—covering dev and prod environments with environment-specific tfvars. Runbooks and AGENTS guidance were updated to describe deployment and operational steps.

## Definition of Ready
- [x] VPC, subnet, and security group conventions agreed with platform networking owners (VPC /16 across three AZs; subnets split into public ALB, private-app, private-data with NAT per AZ; SGs chaining ALB→ECS→RDS with least-privilege inbound/egress).
- [x] Container image registry strategy finalized (shared ECR repo per app using immutable tags `app:<git-sha>`, `app:staging`, `app:prod` with promotions retagging digests and SBOM attestations).
- [x] Secrets catalog approved, including database DSNs, upload provider credentials, and webhook tokens (catalog includes Strapi keys, JWT secrets, `DATABASE_URL`, S3 provider creds, webhook tokens, OAuth/SSO, email provider; stored in AWS Secrets Manager, ECS task role read-only).
- [x] Observability requirements (logs, metrics, traces) signed off with reliability lead (FireLens→CloudWatch logs 30 days, metrics on CPU/memory/5xx/p95 latency, OTEL traces to X-Ray, alerts for p95>1s sustained 15 min or 5xx>2% for 5 min).

## Definition of Done
- [x] Terraform modules for ECS service, task definition, IAM roles, and ALB listener committed with documentation.
- [x] Autoscaling policies configured (CPU and latency thresholds) and validated in dev.
- [x] Task definitions mount secrets and config maps without embedding sensitive values in code or images.
- [x] CloudWatch log groups, metrics, and alarms created; alerts wired to incident response channel.
- [x] Deployment runbook updated with rollout/rollback procedures and health-check endpoints.
- [x] Follow-up tasks logged for cost optimization or multi-region resiliency if needed.
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

## Notes
- `infra/` directory and modules added for Strapi ALB, IAM, and ECS service logic with environment overrides in `infra/strapi/env/`.
- Documentation updates: deployment runbook now includes Strapi ECS procedure, architecture doc captures the new cluster/alarms, root `AGENTS.md` references Terraform usage, and `infra/AGENTS.md` explains IaC commands.
- CloudWatch alarms publish to the existing `clarivum-oncall` SNS topic; ensure the topic subscription stays healthy.

## Follow-ups
- Confirm `terraform fmt/validate/plan` runs in CI once TSK-PLAT-022 (Strapi CI/CD pipeline) lands so infra changes stay gated.
