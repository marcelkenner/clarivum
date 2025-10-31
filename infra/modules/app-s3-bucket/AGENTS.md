# infra/modules/app-s3-bucket · AGENTS Guide

Create an **AWS S3 bucket** with encryption, versioning, lifecycle rules, and optional public access controls. Use this module for Clarivum product assets (ebooks, media, exports) and align bucket naming with the taxonomy in `docs/runbooks/aurora-operations.md` and `docs/runbooks/deployment.md`.

## Inputs & conventions

- `bucket_prefix` should include the environment (e.g., `clarivum-app-dev-ebooks`); the module appends a random suffix when `force_random_suffix=true` to guarantee global uniqueness.
- `acl` defaults to `private`. When `public_read=true`, S3 public access blocks are relaxed but you must front the bucket with CloudFront signed URLs per ADR-001.
- Lifecycle defaults transition objects to Intelligent-Tiering after 180 days and expire noncurrent versions after 365 days. Override via `lifecycle_rules` when a product area needs bespoke retention.
- Optional `object_ownership` lets you enforce bucket-owner enforced ACLs if multiple principals upload objects.

## Execution

```bash
terraform -chdir=infra/app-data plan \
  -var-file=env/dev.tfvars
```

Capture outputs (`bucket_name`, `bucket_arn`) and update consuming runbooks/tasks. Always run `terraform fmt` and `terraform validate` before opening a PR; add `tflint` once TSK-PLAT-022 lands.

## Post-apply checks

- Verify the bucket exists in AWS with versioning enabled and encryption policy attached.
- Confirm lifecycle policies match retention expectations and document deviations in the relevant runbook.
- If `public_read=true`, add CloudFront or Signed URL guidance to prevent accidental public exposure.

Resolve Terraform/AWS questions through Context7 (`/hashicorp/terraform-provider-aws`).
