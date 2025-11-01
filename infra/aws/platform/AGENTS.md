# infra/aws/platform · AGENTS Guide

Terraform here manages both dev and prod stacks for the Clarivum platform. Follow these guardrails to avoid disrupting live traffic.

- **Workspace discipline**: `terraform workspace select dev|prod` before planning or applying. State lives under `terraform.tfstate.d/<workspace>`.
- **Required variables**: Use `-var-file=env/<env>.tfvars`. Prod tfvars specify `logs_bucket_object_ownership = "ObjectWriter"`; keep that in sync with S3 when rotating buckets.
- **Existing resources**: ElastiCache serverless caches (`platform-dev-cache`, `platform-prod-cache`), CloudFront validation records, the prod NAT gateway, and the Secrets rotation stacks are imported. Do not taint/recreate without a documented migration plan.
- **Apply workflow**: `terraform plan -var-file=env/<env>.tfvars` then `terraform apply -var-file=env/<env>.tfvars`. Capture outputs for runbooks. Never apply to prod without reviewing the plan and confirming impacted resources with the platform lead.
- **AWS changes**: When adjusting cache/rate-limit env vars, verify Lambda configuration via `aws lambda get-function-configuration --function-name platform-<env>-core` after apply.
- **Docs**: Update `infra/aws/README.md`, ADR-006, and relevant runbooks whenever infra topology changes (new buckets, endpoints, env vars).
