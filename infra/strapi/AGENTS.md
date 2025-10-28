# infra/strapi · AGENTS Guide

Environment-specific Terraform configuration for Strapi ECS (TSK-PLAT-020). Use this directory to plan/apply infrastructure changes across `dev` and `prod`.

## Commands
Run from repo root with AWS credentials sourced (`aws sso login` or `aws-vault exec clarivum-devops -- bash`):

```bash
terraform -chdir=infra/strapi init \
  -backend-config="bucket=clarivum-tf-state-<account>" \
  -backend-config="key=platform/strapi/terraform.tfstate" \
  -backend-config="region=eu-central-1" \
  -backend-config="dynamodb_table=clarivum-tf-locks"

terraform -chdir=infra/strapi workspace select dev || terraform -chdir=infra/strapi workspace new dev
terraform -chdir=infra/strapi plan -var-file=env/dev.tfvars
terraform -chdir=infra/strapi apply -var-file=env/dev.tfvars
```

Switch to `prod` by selecting the workspace and using `env/prod.tfvars`. Always capture plan output in PR discussions per ADR-001.

## Files
- `main.tf` wires the Strapi cluster, ALB, IAM, and ECS service modules.
- `variables.tf` defines environment knobs (subnets, image, scaling thresholds).
- `outputs.tf` exposes ARNs and SG IDs for integration with other stacks (e.g., observability).
- `env/*.tfvars` store environment overrides—replace placeholder subnets/ARNs with real values via secrets manager or SSM, not hard-coded commits.

## Expectations
- Align changes with ADR-010 and `docs/PRDs/requierments/strapi/setup.md`.
- Update `docs/runbooks/deployment.md` and `docs/architecture.md` when topology or alarms change.
- Run `terraform fmt infra/strapi` and `terraform validate infra/strapi` before submitting a PR (ensure Terraform CLI available locally).
- Route new alarms/SNS topics through the on-call process documented in `infra/AGENTS.md`.

Always fetch the latest AWS or Strapi guidance through Context7 (`/aws/ecs`, `/strapi/documentation`) when adding features.
