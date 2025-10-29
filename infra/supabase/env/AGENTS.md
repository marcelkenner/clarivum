# Supabase environment tfvars

Store non-secret environment configuration files here. Populate one tfvars per workspace and keep sensitive values (Supabase access tokens) out of disk.

Recommended fields:

- `environment` — `dev`, `prod`, etc.
- `aws_region` — Secrets Manager region (defaults to `eu-central-1`)
- `supabase_region` — Supabase project region slug (e.g. `eu-central-1`)
- `supabase_organization_slug` — Organisation slug (from the dashboard URL or `supabase orgs list`)
- `supabase_organization_id_override` — Optional explicit organisation UUID when the slug lookup should be skipped
- `supabase_plan` — Plan slug (`pro`, `team`, ...)
- `storage_buckets` — Optional overrides for bucket policies/limits

Example usage:

```bash
terraform -chdir=infra/supabase plan \
  -var-file=env/dev.tfvars \
  -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"
```
