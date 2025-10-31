# Clarivum Infrastructure

Infrastructure-as-code for Clarivum platform services lives under this directory. Modules follow the conventions laid out in `answers_dor_platform-md` and ADR-001.

## Layout

- `modules/` — reusable Terraform modules shared across workloads.
- `strapi/` — environment-specific configuration for Strapi ECS (TSK-PLAT-020).
- `app-data/` — Aurora PostgreSQL + application asset buckets (replaces the retired Supabase tenancy; TSK-PLAT-012 follow-up).
- `aws/platform/` — complete Track A platform stack (VPC, CloudFront, API Gateway + Lambda, DynamoDB, Secrets, monitoring).
- Future services should create their own subdirectories (e.g., `ops-hub/`, `novu/`) and reuse shared modules when possible.

## Naming and tagging

- Tags use the standard Clarivum map: `Environment`, `Service`, `Owner`, `CostCenter`, `ManagedBy` (`terraform`), and `Repository`.
- Resource names follow the pattern `<service>-<env>-<component>` (e.g., `strapi-dev-alb`).

## Remote state

Configure S3 + DynamoDB backend per environment. Use distinct state keys for each stack:

```bash
terraform -chdir=infra/strapi init \
  -backend-config="bucket=clarivum-tf-state-<account>" \
  -backend-config="key=platform/strapi/terraform.tfstate" \
  -backend-config="region=eu-central-1" \
  -backend-config="dynamodb_table=clarivum-tf-locks"

terraform -chdir=infra/aws/platform init \
  -backend-config="bucket=clarivum-tf-state-<account>" \
  -backend-config="key=platform/runtime/terraform.tfstate" \
  -backend-config="region=eu-central-1" \
  -backend-config="dynamodb_table=clarivum-tf-locks"
```

Workspaces map 1:1 with deployment environments (`dev`, `prod`). Clarivum does not run a persistent staging account; use PR previews or the `dev` workspace for validation.

## Validation

Run the following before opening a PR:

```bash
terraform -chdir=infra/strapi fmt
terraform -chdir=infra/strapi validate

terraform -chdir=infra/aws/platform fmt
terraform -chdir=infra/aws/platform validate
```

GitHub Actions workflow `.github/workflows/infra-ci.yml` (TSK-PLAT-022 · Terraform Gates) now runs `terraform fmt -check`, `terraform validate`, and `terraform plan` for both `infra/strapi` and `infra/aws/platform` on every pull request that touches `infra/**`. Set repository variables `TF_BACKEND_BUCKET`, `TF_BACKEND_KEY_STRAPI`, `TF_BACKEND_KEY_PLATFORM`, `TF_BACKEND_REGION`, `TF_BACKEND_DYNAMODB_TABLE` (and optionally `TERRAFORM_DEFAULT_WORKSPACE`) plus secret `AWS_TERRAFORM_DEPLOYER_ROLE_ARN` so the job can assume the `TerraformDeployer` role.
