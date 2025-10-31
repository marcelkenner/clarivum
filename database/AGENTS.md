# Database & Storage · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
Clarivum’s primary data layer now runs on Aurora PostgreSQL (Serverless v2) with Amazon S3 for binary assets. Follow this guide when changing schemas, RLS, seeds, or storage policies. Coordinate efforts with ADR-001, ADR-023, ADR-024, ADR-036 (historical context), and the backend guide.

## Tooling and prerequisites

- Install the AWS CLI and authenticate with the platform account (`aws sso login --profile clarivum-platform`) before working with Aurora resources.
- Export required connection details from AWS Secrets Manager into your environment (`DATABASE_URL`, `READ_DATABASE_URL`, `DATABASE_SSL`, `DATABASE_POOL_MAX`, etc.). Never commit credentials— store them locally or access via `aws-vault`.
- Use the shared migration runner scripts (`npm run db:migrate`, `npm run db:migration:status`) and `psql` when debugging locally. Document any deviations in `docs/runbooks/aurora-operations.md`.

## Schema workflow

1. Draft ERD or schema changes in `docs/architecture.md` and the relevant ADR/PRD.
2. Author migrations under `database/migrations/<timestamp>_<slug>.sql`; follow the expand → migrate → contract pattern from the Zero-Downtime runbook.
3. Apply locally with the Dockerised Postgres env or Aurora dev cluster (`npm run db:migrate -- --env dev`). Regenerate TypeScript types afterwards (`npm run db:types`) so `database/types.ts` stays in sync.
4. Commit migration and regenerated type files, and document rollback steps plus verification queries in the PR.

## Policies, seeds, and fixtures

- Maintain row-level security (RLS) policies for every table. Mirror policy rationale in the PR and update runbooks if access patterns change.
- Store seed scripts under `database/seeds/` with clear re-run instructions. Include idempotent statements to avoid duplicate data.
- For test fixtures, create SQL or TypeScript builders alongside Vitest suites; reference governing ADRs or tasks via comments.

## Storage guidance

- Buckets should default to private access with signed URL delivery. Define lifecycle rules and CDN settings through Terraform under `infra/aws`.
- Document new buckets, object naming conventions, and retention policies in `docs/runbooks/ops-hub.md` or a dedicated storage runbook section.
- When exposing assets to the frontend, route access through managers that request signed URLs—never embed bucket paths client-side.

## Guardrails and verification

- Run `npm run validate` (lint + typecheck + format) and any relevant Vitest suites for repositories touching the schema.
- If migrations affect critical tables, add or update smoke tests, monitoring alerts, and dashboards. Log added guardrails in the Kaizen issue.
- Perform manual verification against Aurora (counts, RLS behaviour) and capture results in the PR checklist or runbook changelog.

## Review checklist

- [ ] Migration SQL reviewed for deterministic order, indexes, and rollback notes.
- [ ] RLS policies and Auth0 role mappings updated and documented.
- [ ] TypeScript types regenerated or validated against schema changes (`database/types.ts`).
- [ ] Storage buckets/policies recorded in runbooks with access patterns explained.
- [ ] Guardrails (tests, alerts, monitoring) added or updated; Sisu/Kaizen logs referenced.

Keep this file current as database tooling, schemas, or storage conventions evolve. Add subdirectory-specific `AGENTS.md` files (`migrations/`, `seeds/`, etc.) when they gain additional guidance.
