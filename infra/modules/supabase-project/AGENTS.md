# infra/modules/supabase-project · AGENTS Guide

This Terraform module provisions a Supabase project (PITR-enabled) and returns the anon/service keys so platform automation can distribute credentials. Treat it as the single Lego brick for `tasks/backlog/platform/plat-012-supabase-tenancy-provision.md`.

## Required inputs & secrets
- `organization_id`, `region`, `plan`—match planning data in `docs/PRDs/requierments/supabase-platform/feature-requirements.md`.
- `management_access_token` should always be loaded from an environment variable or AWS Secrets Manager entry when running `terraform` (never commit the PAT). Follow `docs/runbooks/secrets-management.md`.
- Optional `database_password` only when we must reproduce an existing credential; otherwise let the module generate one and sync the value from the Terraform output.

## Usage pattern
```bash
terraform -chdir=infra/supabase \
  init \
  -backend-config="bucket=$TF_BACKEND_BUCKET" \
  -backend-config="key=$TF_BACKEND_KEY" \
  -backend-config="region=$TF_BACKEND_REGION"

terraform -chdir=infra/supabase plan \
  -var-file=env/dev.tfvars \
  -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"
```
Use `terraform output -json` to capture `anon_key`, `service_role_key`, and `database_url`, then sync them to Vercel/Lambda per `docs/runbooks/supabase-operations.md`.

## Validation checklist
- Run `terraform fmt`, `terraform validate`, and `tflint` (once TSK-PLAT-022 lands) before opening a PR.
- Rotate the PAT if the module errors with `403` and log the rotation in the Supabase runbook.
- After apply, verify the project appears in the Supabase dashboard and that PITR is enabled (Management API doesn’t expose PITR validation—double-check in UI).

Always resolve Terraform/Supabase questions through Context7 (`/hashicorp/terraform`, `/supabase/supabase`).
