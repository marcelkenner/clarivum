# App Data Provisioning · AGENTS Guide

This Terraform workspace provisions the shared **Aurora PostgreSQL Serverless v2** cluster and application asset **S3 buckets** that replaced the legacy Supabase tenancy. Follow the guardrails in `docs/runbooks/aurora-operations.md` and ADR-001 before touching production.

## Prerequisites

- Terraform >= 1.7
- AWS CLI configured to assume the `TerraformDeployer` role (see `infra/AGENTS.md`)
- VPC primitives available (private subnet IDs, security groups for database access)
- `.tfvars` populated per environment (see `env/` samples and replace placeholders with real IDs)

## Common commands

- `terraform -chdir=infra/app-data init -backend-config="bucket=$TF_BACKEND_BUCKET" ...`
- `terraform -chdir=infra/app-data workspace select dev || terraform -chdir=infra/app-data workspace new dev`
- `terraform -chdir=infra/app-data plan -var-file=env/dev.tfvars`
- `terraform -chdir=infra/app-data apply -var-file=env/prod.tfvars`
- Run `terraform fmt`, `terraform validate`, and (once configured) `tflint` before opening a PR.

## Secret layout

`apply` stores database connection metadata in AWS Secrets Manager under:

- `/clarivum/app/<env>/database/url`
- `/clarivum/app/<env>/database/password`
- `/clarivum/app/<env>/database/username`
- `/clarivum/app/<env>/database/name`
- `/clarivum/app/<env>/database/writer_endpoint`
- `/clarivum/app/<env>/database/reader_endpoint`
- `/clarivum/app/<env>/database/cluster_arn`

Sync these secrets into ECS task definitions, Lambda env vars, and CI pipelines per `docs/runbooks/secrets-management.md`.

## Bucket guardrails

- Defaults create `ebooks-public` and `ebooks-private` buckets with Intelligent-Tiering after 180 days and noncurrent expiry after 365 days. Adjust `asset_buckets` in tfvars when a product squad needs different retention.
- Buckets are private by default; `public_read=true` only lifts S3 public access blocks. Serve content via CloudFront signed URLs to avoid world-readable objects.
- Document lifecycle rule changes in `docs/runbooks/deployment.md` and the owning task.

## Post-apply verification

1. Confirm the Aurora cluster is available, writer/reader endpoints resolve, and connection works via Session Manager port forwarding.
2. Check that Secrets Manager contains the entries listed above.
3. Review S3 buckets for correct versioning/encryption settings.

Resolve AWS/Terraform provider questions via Context7 (`/hashicorp/terraform-provider-aws`).
