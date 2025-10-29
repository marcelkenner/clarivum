# cms/database · AGENTS Guide

**Context7:** Cross-check database settings and migration patterns with `/strapi/documentation/v5_2_2`.

## Responsibilities
- Store application-owned SQL/data migrations under `migrations/`. Do not rely on manual admin edits in hosted environments.
- Mirror platform requirements from `docs/PRDs/requierments/strapi/setup.md` (Postgres 15, PITR, backups). Keep related Terraform updates in sync with `infra/strapi/AGENTS.md`.
- Version any deterministic seed data that environments need (locales, baseline taxonomy). Prefer fixtures that can be replayed safely.

## Workflow
- Generate structural changes via the Strapi content-type builder or CLI locally, commit the generated files under `cms/src/api`, then add a migration if the change also transforms data.
- Write idempotent migrations in TypeScript or SQL. Verify them against a disposable Postgres instance (`npm run develop` pointing at a scratch database) before merging.
- Coordinate schema changes with downstream consumers (Next.js, Supabase). Update `docs/PRDs/requierments/strapi/feature-requirements.md` when the API contract shifts.

## Guardrails
- Add a Sisu note and guardrail issue when a migration closes an incident. Capture verification steps in the Kaizen daily template.
- Update `docs/runbooks/deployment.md` whenever the migration toolchain or execution order changes, and link to the PR implementing the change.
