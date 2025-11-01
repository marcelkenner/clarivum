# infra/modules/platform-lambda · AGENTS Guide

## Scope

- Provision the core Lambda function that runs the Clarivum Next.js server runtime.
- Manage IAM execution roles, baseline policies, logging, and networking for the runtime.
- Ship a placeholder ZIP so Terraform can create the function even before CI deploys real code.

## Key Terraform Components

- `data "archive_file"` builds a stub handler under `.generated/`; keep lifecycle `ignore_changes` on code properties so CI deploys are not overwritten by Terraform.
- `aws_lambda_function.core` sets runtime configuration (memory, timeout, layers, VPC). All runtime tuning should be exposed via variables rather than hardcoded.
- `aws_cloudwatch_log_group.lambda` controls log retention; coordinate retention with observability policies.
- IAM layout: `aws_iam_role.core` plus managed policy attachments for CloudWatch/VPC, and a custom policy for DynamoDB + Secrets Manager access.

## Inputs & Coordination

- Required inputs: `function_name`, `subnet_ids`, `security_group_ids`, `dynamodb_table_arn`, `secrets_allowed_arns`.
- Optional tunables expose runtime levers: `memory_size`, `timeout`, `reserved_concurrency`, `ephemeral_storage_size`, `layers`, `environment_variables`.
- Outputs feed `platform-api` (function ARN/invoke ARN) and `platform-observability` (function name/ARN). Update consumers in lockstep when renaming.

## Implementation Notes

- Expand IAM permissions thoughtfully; prefer adding fine-grained statements in `data.aws_iam_policy_document.runtime` over attaching broad AWS managed policies.
- Additional environment secrets should be referenced via Secrets Manager and read at runtime; avoid embedding secrets directly.
- Keep VPC subnet lists limited to private subnets with outbound NAT; the Lambda must reach Aurora/DynamoDB while staying isolated.
- For new event sources (SQS, EventBridge), define them in a dedicated module and inject ARNs through variables to preserve SRP.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and confirm no code redeploy is triggered (`filename` and `source_code_hash` should be ignored).
- After deployment, verify IAM permissions using `aws iam simulate-principal-policy` when adding new statements.
- Ensure CloudWatch log retention matches compliance requirements.
- Execute `npm run ensure:agents` and read Lambda/IAM documentation via Context7 when adjusting runtimes or policies.
