# infra/modules/strapi-iam · AGENTS Guide

Creates the IAM execution + task roles required by the Strapi ECS service while enforcing least-privilege access to Secrets Manager and S3 media buckets.

## Role structure

- Execution role attaches AWS managed `AmazonECSTaskExecutionRolePolicy` plus `AWSXRayDaemonWriteAccess` and a custom policy granting read access to declared secrets. Extend via `extra_execution_statements`.
- Task role grants Secrets Manager read, X-Ray emit, and (optionally) S3 object/bucket permissions driven by `media_bucket_arns`. Additional statements go through `extra_task_statements`.

## Editing guidelines

- Never hard-code ARNs; accept lists through variables so callers choose the correct Secret or bucket.
- Keep `sts:AssumeRole` principals limited to `ecs-tasks.amazonaws.com` unless ADR-010 changes the runtime.
- When adding new permissions, double-check ADR-007 (secrets management) and ADR-010 for compliance.

## Validation

1. `terraform fmt infra/modules/strapi-iam/main.tf`.
2. Run `terraform -chdir=infra/strapi plan -var-file=env/dev.tfvars` to confirm IAM diffs render correctly.
3. If policies fail validation, use AWS docs via Context7 (`/aws/iam`) to confirm action/resource syntax.

## Security guardrails

- Keep all secret/resource ARNs in `secret_arns`/`media_bucket_arns` lists to prevent wildcard access.
- Policy changes that widen scope must be reviewed by the platform security owner and reflected in `docs/runbooks/secrets-management.md`.
