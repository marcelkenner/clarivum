# AWS Platform · AGENTS Guide

This directory will store Terraform configurations for Clarivum’s AWS-only application and data platform. Use these instructions while we migrate away from Vercel and Supabase.

## Prerequisites

- Terraform >= 1.7 with the AWS provider pinned in `versions.tf` (to be added alongside the modules).
- AWS CLI configured for the target account and able to assume the `TerraformDeployer` role via SSO/OIDC.
- Remote state bucket `clarivum-tf-state-<account>` and DynamoDB table `clarivum-tf-locks` (see `infra/AGENTS.md`).
- Container images for the Next.js workload are published to ECR (`clarivum/nextjs-app`) via CI.

## Module layout (in flight)

- `infra/aws/app` — CloudFront distribution, ALB, ECS/Fargate service for the Next.js runtime, and the supporting IAM roles, logs, and autoscaling policies.
- `infra/aws/data` — Amazon Aurora PostgreSQL cluster (Serverless v2), parameter groups, Secrets Manager entries, and S3 buckets for rich media + CDN origins.
- `infra/aws/network` — Shared VPC, subnets, NAT gateways, and security groups reused by Strapi, background workers, and the Clarivum web app.

Create the directories above as Terraform code is checked in. Until then, capture design notes in `docs/adr/` and `infra/README.md`.

## Common commands

Run Terraform from the repo root. Each workspace (`dev`, `stage`, `prod`) maps to an AWS account or environment-specific configuration.

```bash
# Initialize remote state and providers
terraform -chdir=infra/aws/app init \
  -backend-config="bucket=$TF_BACKEND_BUCKET" \
  -backend-config="key=aws-app/terraform.tfstate" \
  -backend-config="region=$TF_BACKEND_REGION" \
  -backend-config="dynamodb_table=$TF_BACKEND_DYNAMODB_TABLE"

# Select or create workspace
terraform -chdir=infra/aws/app workspace select dev \
  || terraform -chdir=infra/aws/app workspace new dev

# Preview changes for the Next.js stack
terraform -chdir=infra/aws/app plan -var-file=env/dev.tfvars

# Preview data-layer updates
terraform -chdir=infra/aws/data plan -var-file=env/dev.tfvars

# Apply only with an approved change request
terraform -chdir=infra/aws/app apply -var-file=env/prod.tfvars
terraform -chdir=infra/aws/data apply -var-file=env/prod.tfvars
```

Always run `terraform fmt`, `terraform validate`, and the relevant `tflint`/`tfsec` jobs before opening a PR.

## Migration checklist

- [ ] Replace the Supabase Terraform module with Aurora + S3 equivalents (`infra/aws/data`).
- [ ] Update CI workflows to assume the AWS deployer role instead of Supabase management tokens.
- [ ] Rotate secrets: move Supabase connection strings out of Secrets Manager and publish new Aurora credentials.
- [ ] Update runtime configuration (`next.config.ts`, environment files) to target the new AWS endpoints.
- [ ] Remove Vercel deploy hooks in favour of the GitHub Actions → ECR → ECS pipeline (documented in `docs/runbooks/deployment.md`).

Mark each item complete in `TODO.md` and create follow-up guardrail tasks as gaps appear during the migration.
