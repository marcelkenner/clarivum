# infra/modules/aurora-postgres-cluster · AGENTS Guide

Provision an **AWS Aurora PostgreSQL Serverless v2** cluster with Terraform. The module creates a subnet group, configures automated backups, enables CloudWatch log exports, and generates a strong master password when one is not supplied. Outputs expose writer/reader endpoints and a ready-to-use PostgreSQL connection URI for application consumers.

## Required inputs & secrets

- `subnet_ids` must point to private subnets with outbound access to AWS services (see VPC documentation in `infra/aws/app`).
- `vpc_security_group_ids` should allow PostgreSQL traffic from the application layers (ECS/Fargate, Lambda, etc.).
- Supply `kms_key_id` when the account enforces customer-managed encryption keys; defaults fall back to `aws/rds`.
- Optional `database_password` lets you reuse an existing credential during migrations; otherwise the module emits a random 32-character password.

Refer to `docs/runbooks/aurora-operations.md` for rotation cadence, failover drills, and performance tuning.

## Usage pattern

```bash
terraform -chdir=infra/app-data init \
  -backend-config="bucket=$TF_BACKEND_BUCKET" \
  -backend-config="key=$TF_BACKEND_KEY" \
  -backend-config="region=$TF_BACKEND_REGION"

terraform -chdir=infra/app-data plan \
  -var-file=env/dev.tfvars
```

Capture outputs via `terraform output -json` and sync credentials into AWS Secrets Manager or deployment pipelines per `docs/runbooks/secrets-management.md`.

## Validation checklist

- Run `terraform fmt`, `terraform validate`, and `tflint` (once enabled via TSK-PLAT-022) before opening a PR.
- Confirm the cluster appears in the AWS console with Serverless v2 scaling and that backup retention matches expectations.
- Smoke-test connectivity from the application VPC (set up temporary bastion or Session Manager port forwarding) after the first apply.

Always resolve Terraform/AWS provider questions through Context7 (`/hashicorp/terraform-provider-aws`).
