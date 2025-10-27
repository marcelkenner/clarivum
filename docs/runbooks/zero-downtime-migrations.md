# Zero-Downtime Migrations Runbook

> Complements `docs/runbooks/supabase-operations.md`, ADR-001 (Primary Cloud & Database), and ADR-036 (Supabase Schema v0). Follow this guide whenever altering Supabase Postgres schemas so production stays online.

## Purpose
- Deploy database changes using an **expand → migrate → contract** pattern that preserves availability for the public site, background jobs, and the Operations Hub.
- Guard against performance regressions by validating index coverage and query plans before and after every release.
- Ensure audit trails (`set_audit_fields()` triggers, `entitlement_status_history`) remain intact during schema evolution.

## Scope
- Supabase `public` schema migrations (`database/migrations/*.sql`) and associated seed fixtures (`database/seeds/*.sql`).
- Extensions (`pg_uuidv7`, `pgcrypto`, `citext`) and helper functions created by migration `20251027090000_core_schema.sql`.
- Core tables: `personas`, `profiles`, `leads`, `content_items`, `entitlements`, `entitlement_status_history`.
- Excludes Terraform-managed infrastructure (covered in infra repo runbooks) and Strapi schema updates (see `docs/runbooks/ops-hub.md` for downstream checks).

## Preconditions
- Supabase CLI authenticated (`supabase login`) and pointed at the correct project (`SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` exported).
- Local database refreshed with latest migrations: `supabase db reset --db-url "$SUPABASE_DB_URL"` or equivalent environment-specific command.
- Application tests pass locally (`npm run validate`) before attempting production rollout.
- Observability alerts (`sisu-debugging`, Grafana slow query dashboards) healthy; no open incidents related to Postgres.

## Tooling & References
- `supabase db diff --use-migra --schema public --file migrations/<timestamp>_<slug>.sql`
- `supabase db reset` / `supabase db push`
- `npm run lint:tasks`, `npm run lint:docs` (PR hygiene)
- `psql` or Supabase SQL editor for dry-run verification (`EXPLAIN (ANALYZE, BUFFERS)`)
- Grafana dashboards: `Postgres Health`, `Slow Query Watch`, `Connection Saturation`
- Related ADRs / PRDs: ADR-001, ADR-036, `docs/PRDs/requierments/supabase-platform/feature-requirements.md`, `docs/runbooks/account-claiming.md`

## Workflow
### 1. Expand
- Create additive changes first: new tables, columns (nullable), enums, indexes, triggers.
- Avoid destructive operations; prefer defaults + backfill columns before introducing `NOT NULL`.
- Verify new indexes with representative queries:
  ```sql
  EXPLAIN (ANALYZE, BUFFERS) SELECT id FROM public.profiles WHERE email = 'demo@clarivum.test';
  EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.content_items WHERE persona_id = '<uuid>' AND status = 'published' ORDER BY published_at DESC LIMIT 5;
  EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.entitlements WHERE profile_id = '<uuid>' AND status IN ('pending_claim','active');
  ```
- Keep migration files deterministic: order statements, qualify schema names, include `if not exists` when re-running is expected (extensions, indexes).

### 2. Migrate
- Backfill data using idempotent statements (`update ... where ... is null`) or script-based jobs and document progress in PR description.
- For workloads touching hashed identifiers or audit fields, confirm triggers still fire:
  ```sql
  INSERT INTO public.leads (email, source, created_by, updated_by)
  VALUES ('test@example.com', 'debug-seed', 'migration', 'migration')
  ON CONFLICT (email, source) DO UPDATE SET metadata = '{}'::jsonb;
  SELECT revision FROM public.leads WHERE email = 'test@example.com';
  ```
- Coordinate with feature flag owners when dual-write or read-modify-write logic is required; document toggles in PRD/ADR updates.

### 3. Contract
- Only drop columns / enums / indexes once code no longer references them (feature flag or deployment checks in place).
- Validate `npm run validate` plus targeted integration tests before merging the contract migration.
- Update runbooks and ADRs to reflect the final state (e.g., removing deprecated columns from support procedures).

## Deployment Checklist
- [ ] Migration reviewed by database steward (or delegate) with rollback notes documented in PR description.
- [ ] Local apply: `supabase db reset` (or `db push`) passes; seed script reruns cleanly with `psql -f database/seeds/<file>.sql`.
- [ ] `EXPLAIN ANALYZE` snapshots captured for critical queries pre/post change (attach to PR or Ops notes).
- [ ] Grafana alert thresholds reviewed/updated if cardinality or latency expectations shift.
- [ ] `docs/architecture.md`, relevant ADRs, and runbooks updated.
- [ ] `npm run validate`, `npm run lint:docs`, and domain-specific tests (`npm run test` when applicable) pass before requesting review.
- [ ] Production rollout coordinated during collaboration window; post-deploy health checks captured in Ops channel.

## Rollback
- Store explicit rollback statements or scripts alongside each migration (`-- ROLLBACK:` comments or paired files).
- For destructive mistakes, use Supabase PITR within configured window. Document timeline, recovered tables, and remediation in `sisu-log/`.
- If extension changes fail (e.g., `pg_uuidv7` missing), disable application feature flags consuming new columns, revert PR, and coordinate with platform team to enable the extension before retrying.

## Guardrails & Monitoring
- Enable `pg_stat_statements` and review after each deployment; queries without index usage must trigger Kaizen guardrails.
- Alert thresholds:
  - Lead ingestion end-to-end < 500 ms (API/BFF + insert).
  - Entitlement shelf hydrate query p95 < 20 ms.
  - Pending claim token lookup p95 < 5 ms.
- Record stats in the daily Kaizen issue when migrations complete (slowdowns, guardrail additions, follow-up owner).

## Change Log
- 2025-10-27 — Initial runbook covering Schema v0, expand/migrate/contract workflow, and index verification steps.
