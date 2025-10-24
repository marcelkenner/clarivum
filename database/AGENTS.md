# Database & Storage · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
Clarivum’s data layer runs on Supabase Postgres 16 with Supabase Storage for media assets. Follow this guide when changing schemas, RLS, seeds, or storage policies. Coordinate efforts with ADR-001, ADR-002, ADR-003, ADR-006, and the backend guide.

## Tooling and prerequisites

- Install the Supabase CLI (`npm install -g supabase` or use Homebrew). Authenticate with the project before running migrations.
- Define connection details via environment variables (`SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD`, etc.). Never commit credentials—store them in `.env.local` or secret managers.
- For storage management, use the Supabase dashboard or CLI; document new buckets and policies in the PR.

## Schema workflow

1. Draft ERD or schema changes in `docs/architecture.md` and the relevant ADR/PRD.
2. Generate migrations:
   - `supabase db diff --use-migra --schema public --file migrations/<timestamp>_<slug>.sql`
   - Review and edit SQL to ensure deterministic order, explicit `CREATE`/`ALTER`, and accompanying indexes.
3. Apply locally with `supabase db reset` or `supabase db push` (for isolated branches). Run `npm run typecheck` afterwards to catch drift in shared types.
4. Commit the migration file under `database/migrations/` (create subdirectories as needed) and document the change in the PR description with rollback notes.

## Policies, seeds, and fixtures

- Maintain row-level security (RLS) policies for every table. Mirror policy rationale in the PR and update runbooks if access patterns change.
- Store seed scripts under `database/seeds/` with clear re-run instructions. Include idempotent statements to avoid duplicate data.
- For test fixtures, create SQL or TypeScript builders alongside Vitest suites; reference governing ADRs or tasks via comments.

## Storage guidance

- Buckets should default to private access with signed URL delivery. Define lifecycle rules and CDN settings through Supabase or Terraformed IaC.
- Document new buckets, object naming conventions, and retention policies in `docs/runbooks/ops-hub.md` or a dedicated storage runbook section.
- When exposing assets to the frontend, route access through Managers that request signed URLs—never embed bucket paths client-side.

## Guardrails and verification

- Run `npm run validate` (lint + typecheck + format) and any relevant Vitest suites for repositories touching the schema.
- If migrations affect critical tables, add or update smoke tests, monitoring alerts, and dashboards. Log added guardrails in the Kaizen issue.
- Perform manual verification in Supabase UI (table counts, RLS behavior) and document results in the PR checklist.

## Review checklist

- [ ] Migration SQL reviewed for deterministic order, indexes, and rollback notes.
- [ ] RLS policies and Auth0 role mappings updated and documented.
- [ ] TypeScript types regenerated or validated against schema changes.
- [ ] Storage buckets/policies recorded in runbooks with access patterns explained.
- [ ] Guardrails (tests, alerts, monitoring) added or updated; Sisu/Kaizen logs referenced.

Keep this file current as database tooling, schemas, or storage conventions evolve. Add subdirectory-specific `AGENTS.md` files (`migrations/`, `seeds/`, etc.) when they gain additional guidance.
