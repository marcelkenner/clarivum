# Supabase Provisioning · AGENTS Guide

Terraform configuration for Clarivum Supabase projects lives in this directory. Follow the secrets and guardrails outlined in `docs/runbooks/supabase-operations.md` and ADR-001.

## Prerequisites

- Terraform >= 1.6
- Supabase personal access token with **Organization → Projects** management scope
- Supabase organization ID (see dashboard URL or `supabase organizations list`)
- AWS credentials with permission to manage Secrets Manager in the target account
- `.tfvars` populated per environment (see `env/` examples)

Export the Supabase token at runtime (avoid committing to disk):

```bash
export SUPABASE_ACCESS_TOKEN="$(pass show clarivum/supabase/pat)"
```

## Common commands

- `terraform -chdir=infra/supabase init` — initialise providers and backend
- `terraform -chdir=infra/supabase workspace select dev || terraform -chdir=infra/supabase workspace new dev`
- `terraform -chdir=infra/supabase plan -var-file=env/dev.tfvars -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"`
- `terraform -chdir=infra/supabase apply -var-file=env/prod.tfvars -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"`
- `terraform -chdir=infra/supabase fmt` / `validate` — keep Terraform formatting consistent

## Secret layout

Running `apply` creates the following AWS Secrets Manager entries:

- `/clarivum/supabase/<env>/anon_key`
- `/clarivum/supabase/<env>/service_role`
- `/clarivum/supabase/<env>/db_url`
- `/clarivum/supabase/<env>/db_password`
- `/clarivum/supabase/<env>/url`
- `/clarivum/supabase/<env>/project_ref`
- `/clarivum/supabase/<env>/next_public_url`
- `/clarivum/supabase/<env>/next_public_anon_key`

Sync these into Vercel/Lambda using the secrets management runbook. CI should only read the `<env>=dev` anon key.

## Bucket guardrails

Default storage buckets are defined in `variables.tf`:

- `ebooks-public` — private bucket for signed URL delivery (100 MiB object cap, PDF/EPUB only)
- `ebooks-private` — archival bucket for evidence uploads (500 MiB cap)

Override `storage_buckets` in tfvars if additional buckets are required; document lifecycle/retention decisions in the Supabase runbook.
