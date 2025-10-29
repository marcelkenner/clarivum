# Infra · AGENTS Guide

This directory stores Terraform configurations for Clarivum platform services. Always run commands from repo root and ensure AWS credentials are sourced via SSO or `aws-vault`.

## Prerequisites

- Terraform >= 1.7 (see `docs/adr/ADR-001-primary-cloud-and-database.md`).
- AWS CLI configured for the target account with permissions to assume `TerraformDeployer` (OIDC role).
- S3 remote state bucket `clarivum-tf-state-<account>` and DynamoDB lock table `clarivum-tf-locks` exist (per `answers_dor_platform-md`).
- `direnv`/`.envrc` optional; otherwise export `TF_VAR_*` inputs manually.

## Common commands

- `terraform -chdir=infra/strapi init -backend-config="workspace_key_prefix=platform"` — initialize using S3 backend (supply bucket, key, region, dynamodb table flags as CLI arguments).
- `terraform -chdir=infra/strapi workspace select dev || terraform -chdir=infra/strapi workspace new dev` — select environment workspaces (`dev`, `prod`).
- `terraform -chdir=infra/strapi plan -var-file=env/dev.tfvars` — generate a plan for dev.
- `terraform -chdir=infra/strapi apply -var-file=env/prod.tfvars` — apply changes for prod (requires release approval).
- `terraform -chdir=infra/strapi fmt` and `terraform -chdir=infra/strapi validate` — formatting and validation guardrails (mirrors CI expectations).

## Supabase tenancy (TSK-PLAT-012)

- Terraform code under `infra/supabase` provisions Supabase projects, storage buckets, and AWS secrets.
- Supply a Supabase access token at runtime: `export SUPABASE_ACCESS_TOKEN=$(pass show clarivum/supabase/pat)`.
- Configuration expects an organisation slug in each tfvars (`supabase_organization_slug`); the module resolves the UUID automatically via the Management API unless an override is supplied.
- Usage mirrors the Strapi flow:
  - `terraform -chdir=infra/supabase init`
  - `terraform -chdir=infra/supabase workspace select dev || terraform -chdir=infra/supabase workspace new dev`
  - `terraform -chdir=infra/supabase plan -var-file=env/dev.tfvars -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"`
  - `terraform -chdir=infra/supabase apply -var-file=env/prod.tfvars -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"`
- Outputs surface Supabase URLs, project refs, and Secrets Manager ARNs for downstream wiring (Next.js, Strapi webhooks, background workers).

## Strapi data foundation (TSK-PLAT-021)

- Terraform now provisions the Strapi RDS instance (`aws_db_instance.strapi`), Secrets Manager entries `clarivum/strapi/<env>/database-{password,url}`, and paired media buckets (`clarivum-strapi-<env>-media-public`, `clarivum-strapi-<env>-media-private`). Do not create or rename these in the console—drive changes through code so IAM policies stay in sync.
- `database_subnet_ids` defaults to the ECS private subnets; override in `env/<env>.tfvars` only if the platform networking team allocates dedicated data subnets.
- Backups: automated snapshots retain 35 days with PITR ≤15 minutes; Enhanced Monitoring + Performance Insights are enabled by default.
- Restore drill cadence: run quarterly (next due **2026-02-03**) following the deployment runbook. Record drill IDs and findings in `docs/runbooks/incident-response.md`.
- Media buckets enforce TLS-only access and lifecycle rules (transition to Intelligent-Tiering after 180 days, expire noncurrent versions after 365). If CloudFront origins change, update bucket policies here.

## Observability guardrails

- CloudWatch log groups default to 30-day retention; adjust via variables if business requirements change.
- Alarms page: `AWS Console → CloudWatch → Alarms → Clarivum/Strapi/*`. Acknowledge incidents in `#clarivum-oncall` following the Sisu playbook.

## CI hooks

- Workflow `.github/workflows/infra-ci.yml` (TSK-PLAT-022 · Terraform Gates) runs `terraform fmt -check`, `terraform validate`, and a `terraform plan` against `infra/strapi` whenever `infra/**` changes. Configure repository variables `TF_BACKEND_BUCKET`, `TF_BACKEND_KEY`, `TF_BACKEND_REGION`, `TF_BACKEND_DYNAMODB_TABLE`, and (optionally) `TERRAFORM_DEFAULT_WORKSPACE`, plus the secret `AWS_TERRAFORM_DEPLOYER_ROLE_ARN` so the job can assume the `TerraformDeployer` role.
- Add `tflint`/`tfsec` once their configs are checked in (tracked under the remaining TSK-PLAT-022 tasks).
- Before merging, capture plan outputs in the PR comment using the standard Terraform plan template.

Always update this guide when adding new Terraform workspaces or modules.
