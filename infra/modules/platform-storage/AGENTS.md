# infra/modules/platform-storage · AGENTS Guide

## Scope

- Provision the S3 buckets backing static assets, media uploads, CloudFront logs, and OpenNext incremental cache.
- Enforce best practices: versioning, SSE-KMS, public access blocks, and ownership controls.
- Wire logging from static assets into the central logs bucket.

## Key Terraform Components

- `aws_s3_bucket.static/media/logs/cache` each represent a discrete bucket. Tags and names must remain stable because other modules reference them by string.
- Versioning + SSE + access block resources are duplicated per bucket to keep behaviour explicit.
- `aws_s3_bucket_logging.static` routes access logs to the logs bucket under the `static/` prefix.

## Inputs & Coordination

- Required names: `static_bucket_name`, `media_bucket_name`, `logs_bucket_name`, `cache_bucket_name`.
- `kms_master_key_id` defaults to `alias/aws/s3`; override with environment CMKs in production.
- Coordinate with `platform-cloudfront` for logging and `platform-storage` outputs that feed CloudFront origins and OpenNext config.

## Implementation Notes

- When adding lifecycle rules, create dedicated resources per bucket to avoid cross-contamination of retention policies.
- For public static hosting, keep buckets private and rely on CloudFront OAC; never disable public access blocks here.
- If replication is needed, model it via separate modules referencing specific buckets to keep this file focused.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and ensure bucket replacements are avoided (renaming buckets forces recreation).
- After apply, verify encryption via `aws s3api get-bucket-encryption` and ownership controls via `get-bucket-ownership-controls`.
- Confirm CloudFront logging writes under `s3://<logs_bucket>/cloudfront/` once distribution updates propagate.
- Execute `npm run ensure:agents` and review S3 documentation with Context7 before altering encryption or access policies.
