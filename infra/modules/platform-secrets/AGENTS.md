# infra/modules/platform-secrets · AGENTS Guide

## Scope

- Manage Secrets Manager artifacts for Aurora credentials and connection URLs.
- Deploy the AWS Serverless Application Repository rotation function and attach rotation policies.
- Provide optional read access for CI/CD principals without widening scope.

## Key Terraform Components

- `aws_secretsmanager_secret.master` and `.url` create two distinct secrets encrypted with `kms_key_id` (optional CMK).
- SAR stack (`aws_serverlessapplicationrepository_cloudformation_stack.rotation`) provisions rotation Lambda. Its outputs are wrapped by `local.rotation_lambda_arn` to handle version differences.
- `aws_secretsmanager_secret_rotation.master` schedules rotation via `rotation_schedule_expression`.
- Conditional policies allow CI principals to read secrets when `ci_secret_reader_principals` is non-empty.

## Inputs & Coordination

- Required: `master_secret_name`, `url_secret_name`, `rotation_subnet_ids`, `rotation_security_group_ids`, `aurora_cluster_arn`, `aurora_secret_username`, `aurora_database_name`, `aurora_host`.
- Optional: `kms_key_id`, `aurora_port`, `rotation_schedule_expression`, `ci_secret_reader_principals`.
- Coordinate with `platform-security-groups` to ensure rotation function subnets/SGs permit database access.

## Implementation Notes

- Keep secret names immutable once clients rely on them; rotation stacks tie to the ARN.
- When changing rotation schedule or SAR version, review AWS release notes via Context7 and document rationale in ADRs.
- Extend policies cautiously; grant access to specific ARNs rather than `*` to avoid privilege sprawl.
- If additional secrets are required (e.g., API keys), create a companion module to avoid mixing responsibilities.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and check for replacement of secrets (avoid `force destroy`).
- After apply, verify rotation status with `aws secretsmanager describe-secret` (look for `RotationEnabled true`).
- Confirm SAR stack completed successfully in CloudFormation before considering the apply done.
- Execute `npm run ensure:agents` and consult Secrets Manager docs via Context7 before adjusting rotation topologies.
