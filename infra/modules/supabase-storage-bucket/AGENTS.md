# infra/modules/supabase-storage-bucket · AGENTS Guide

Provision a Supabase storage bucket tied to a project ref. Use this module whenever a team requests managed object storage (ebooks, media, private assets).

## Inputs & conventions

- `project_ref` should come from the `supabase-project` module output to avoid typos.
- `name` must stay kebab-case; mirror the taxonomy defined in `docs/runbooks/supabase-operations.md` (e.g., `ebooks-public`, `ebooks-private`).
- `public=false` for sensitive buckets. Pair public buckets with CDN rules documented in ADR-036.
- `allowed_mime_types` and `file_size_limit` map directly to Supabase storage constraints; set them explicitly for guardrail work (TSK-PLAT-018).

## Execution

```bash
terraform -chdir=infra/supabase plan \
  -var-file=env/dev.tfvars \
  -var="supabase_access_token=$SUPABASE_ACCESS_TOKEN"
```

Run `terraform fmt`, `terraform validate`, and (once configured) `tflint` before submitting changes. Capture the resulting `bucket_id` output in the PR description and link the consumer task.

## Post-apply checks

- Confirm the bucket appears in the Supabase dashboard with the expected public/private flag.
- If `public=true`, add RLS policies or signed URL guidance to `docs/runbooks/supabase-operations.md`.
- Sync new bucket names into `infra/supabase/env/<env>.tfvars` comment headers so future engineers spot the mapping quickly.

Questions about Supabase storage go through Context7 (`/supabase/supabase`).
