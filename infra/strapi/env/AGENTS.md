# infra/strapi/env · AGENTS Guide

Environment variable files for the Strapi Terraform stack (`infra/strapi`). Each `*.tfvars` contains the concrete AWS resource identifiers for a specific environment.

## Editing rules

- Never commit real account IDs, subnet IDs, or secret ARNs from production. Use placeholders in version control and provide actual values via encrypted secret stores (`sops`, AWS SSM) or deployment pipelines.
- Keep filenames aligned with workspace names (`dev.tfvars`, `prod.tfvars`). Clarivum does not maintain a `stage` workspace; use `dev` for rehearsal runs.
- Mirror any change here in the runbook so operators know which secrets or buckets were updated.
- Leave `DATABASE_URL` and media bucket ARNs out of the tfvars—Terraform now provisions the Strapi database secrets and buckets automatically.

## Validation

- Run `terraform -chdir=infra/strapi plan -var-file=env/<env>.tfvars` after editing. Plans should show only expected resource changes.
- Ensure Secrets Manager ARNs referenced exist and contain the keys required by Strapi (`APP_KEYS`, `ADMIN_JWT_SECRET`, etc.). Do not hand-edit secrets; use AWS console or CLI.

## Common fields

- Networking: `vpc_id`, `public_subnet_ids`, `private_subnet_ids` must line up with the platform networking baseline (three AZs minimum). Override `database_subnet_ids` only when Strapi must use dedicated data subnets.
- Observability: `alarm_action_arns` should point to `clarivum-oncall` SNS or whatever incident topic replaces it; confirm with reliability lead when altering.
- Scaling: adjust `autoscaling_min_capacity`, `autoscaling_max_capacity`, and thresholds (`latency_threshold_ms`, `target_5xx_threshold`) per environment SLAs.

Update placeholders and instructions whenever new environments or secret catalogs are introduced.
