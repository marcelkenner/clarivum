# infra/modules/strapi-ecs-service · AGENTS Guide

Manages the Strapi ECS service, task definition, security group, autoscaling policies, and CloudWatch alarms.

## Responsibilities

- Define the Fargate task (`aws_ecs_task_definition`) with secrets pulled from AWS Secrets Manager and logs sent to CloudWatch (`/aws/ecs/<name>`).
- Provision target-tracking (CPU) and step-scaling (latency) policies plus CloudWatch alarms for `TargetResponseTime` and `HTTPCode_Target_5XX_Count`.
- Attach an ALB-managed security group allowing inbound traffic only from the ALB SG passed by the caller.

## Inputs to know

- `environment_variables` (plain values) vs `secret_environment_variables` (Secrets Manager ARNs). Never hard-code secrets.
- `autoscaling_*` knobs default to dev-friendly values (2–6 tasks, CPU target 50%). Override in env tfvars when production needs different limits.
- `latency_threshold_ms` drives both the alarm description and the numeric threshold (converted to seconds in locals).

## Validating changes

1. `terraform fmt infra/modules/strapi-ecs-service/main.tf`.
2. `terraform -chdir=infra/strapi plan -var-file=env/dev.tfvars` to exercise the module with real inputs.
3. Confirm alarm dimension names against AWS docs via Context7 (`/aws/elasticloadbalancing`) when modifying metrics.
4. When editing health checks, keep Strapi’s `/api/healthz` endpoint up to date (see ADR-010 and `docs/runbooks/deployment.md`).

## Operational notes

- CloudWatch alarms expect SNS ARNs through `alarm_action_arns`. Update the runbook if you wire a new topic.
- If you enable FireLens (`enable_firelens = true`), coordinate with Observability owners to configure delivery (Kinesis/Firehose details live in ADR-017).
- Maintain symmetry between `log_retention_days` here and the values described in `infra/AGENTS.md`.
