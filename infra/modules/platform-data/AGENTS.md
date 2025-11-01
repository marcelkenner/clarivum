# infra/modules/platform-data · AGENTS Guide

## Scope

- Provision the shared DynamoDB table that stores Clarivum platform state.
- Enforce resilience standards: on-demand billing, PITR, KMS encryption, and TTL-based cleanup.

## Key Terraform Components

- `aws_dynamodb_table.kv` is the only resource; hash key `pk` and range key `sk` implement the composite key pattern used by the runtime.
- `point_in_time_recovery`, `server_side_encryption`, and `ttl` blocks are opt-in features controlled via module variables. Keep them enabled unless a governing ADR says otherwise.

## Inputs & Coordination

- Required inputs: `table_name`, `kms_master_key_arn`. Use customer-managed CMKs for production; default keys are only acceptable in sandboxes.
- `ttl_attribute` defaults to `ttl`; update runtime code before changing it. TTL assumes epoch seconds.
- Expose outputs `table_name` and `table_arn` to `platform-lambda` and `platform-observability`; coordinate renames to prevent IAM drift.

## Implementation Notes

- Secondary indexes belong in dedicated submodules to maintain single responsibility; inject index definitions through composition rather than editing this file directly.
- Keep attribute definitions minimal (only keys). Additional attributes are schemaless and should be documented at the application layer.
- Any table-wide settings (streaming, deletion protection) require explicit ADR references before enabling.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and confirm table replacement is not triggered (look for `forces new resource`).
- After deployment, verify TTL status with `aws dynamodb describe-time-to-live`.
- Ensure KMS policy allows DynamoDB usage; if using CMKs, update key policy accordingly.
- Execute `npm run ensure:agents` and fetch DynamoDB docs using Context7 for non-trivial schema updates.
