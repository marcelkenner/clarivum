# Zero-Downtime Migrations Runbook

> Complements `docs/runbooks/aurora-operations.md`, ADR-001 (Primary Cloud & Database), and ADR-036 (Schema v0). Follow this guide whenever altering Aurora PostgreSQL schemas so production stays online.

## Purpose
- Ship database changes using an **expand → migrate → contract** pattern that preserves availability for the public app, background jobs, and the Operations Hub.
- Guard against performance regressions by validating index coverage and query plans before and after every release.
- Keep audit trails (`set_audit_fields()` triggers, `entitlement_status_history`) intact during schema evolution.

## Scope
- Aurora `public` schema migrations stored in `database/migrations/*.sql` and seed fixtures (`database/seeds/*.sql`).
- Extensions (`pg_uuidv7`, `pgcrypto`, `citext`) and helper functions provisioned by `20251027090000_core_schema.sql`.
- Core tables: `personas`, `profiles`, `leads`, `content_items`, `entitlements`, `entitlement_status_history`, `ops_audit`.
- Excludes Terraform-managed infrastructure (see infra runbooks) and Strapi schema updates (covered in `docs/runbooks/ops-hub.md`).

## Preconditions
- Aurora credentials available via Secrets Manager (`DATABASE_URL`, `READ_DATABASE_URL`); export locally with `aws secretsmanager get-secret-value` or `aws-vault exec` profile.
- Local Postgres Docker container refreshed with latest migrations using `npm run db:migrate -- --env local` or `psql -f database/migrations/<file>.sql` in sequence.
- Application validation suite passes (`npm run validate`) before attempting production rollout.
- Observability alerts (`sisu-debugging`, Grafana slow query dashboards) are green; no open database incidents.

## Tooling & References
- Migration authoring: create timestamped SQL files under `database/migrations` (use `$(date +%Y%m%d%H%M%S)_<slug>.sql`).
- Execution: `npm run db:migrate -- --env <env>` (wraps shared migration runner using Aurora writer endpoint).
- Verification: `psql` against staging/prod (tunnelled via `aws rds generate-db-auth-token`), `EXPLAIN (ANALYZE, BUFFERS)` for plan inspection.
- Observability: Grafana dashboards `Aurora / Writer`, `Aurora / Reader`, `Slow Query Watch`; CloudWatch Insights queries for connection spikes.
- References: ADR-001, ADR-036, `docs/runbooks/account-claiming.md`, `docs/runbooks/aurora-operations.md`.

## Workflow
### 1. Expand
- Introduce additive changes first: new tables, nullable columns, enums, indexes, triggers.
- Avoid destructive operations; add defaults + backfill columns before marking `NOT NULL`.
- Validate new indexes with representative queries:
  ```sql
  EXPLAIN (ANALYZE, BUFFERS) SELECT id FROM public.profiles WHERE email = 'demo@clarivum.test';
  EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.content_items WHERE persona_id = '<uuid>' AND status = 'published' ORDER BY published_at DESC LIMIT 5;
  EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.entitlements WHERE profile_id = '<uuid>' AND status IN ('pending_claim','active');
  ```
- Keep migration files deterministic: qualify schema names, sort statements, and include `if not exists` when safe (extensions, indexes).

### 2. Migrate
- Backfill data with idempotent statements (`update ... where ... is null`) or script-based jobs; document progress in the PR.
- Confirm triggers & audit columns remain functional:
  ```sql
  INSERT INTO public.leads (email, source, created_by, updated_by)
  VALUES ('test@example.com', 'debug-seed', 'migration', 'migration')
  ON CONFLICT (email, source) DO UPDATE SET metadata = '{}'::jsonb;
  SELECT revision FROM public.leads WHERE email = 'test@example.com';
  ```
- Coordinate with flag owners when dual-write logic is required; note toggles in ADR/task updates.

### 3. Contract
- Remove columns / enums / indexes only after application code no longer references them (feature flag or coordinated deploy ensures safety).
- Re-run `npm run validate` plus targeted integration tests before merging contract migration.
- Update runbooks and ADRs to reflect the final state (support scripts, dashboards, documentation).

## Deployment Checklist
- [ ] Migration reviewed by database steward with rollback plan documented in PR.
- [ ] Local apply using Dockerized Postgres or dev Aurora (`npm run db:migrate -- --env dev`) succeeds; seed scripts rerun cleanly (`psql -f database/seeds/<file>.sql`).
- [ ] `EXPLAIN ANALYZE` snapshots captured for critical queries pre/post change (attach to PR or Ops notes).
- [ ] Grafana alert thresholds reviewed/updated if cardinality or latency expectations shift.
- [ ] `docs/architecture.md`, relevant ADRs, and runbooks updated.
- [ ] `npm run validate`, `npm run lint:docs`, domain tests (`npm run test`) pass before requesting review.
- [ ] Production rollout scheduled and announced in `#clarivum-data`; post-deploy health checks recorded.

## Rollback
- Pair each migration with explicit rollback statements in the same file (`-- ROLLBACK:`) or companion script.
- For destructive mistakes, request Aurora point-in-time restore (PITR) within the retention window. Document timeline, recovered tables, and remediation in `sisu-log/`.
- If an extension or parameter change fails, disable relying feature flags, revert the application PR, correct the infrastructure configuration, and retry the deployment.

## Guardrails & Monitoring
- Review `pg_stat_statements` after each deployment; queries without index usage must trigger Kaizen guardrails.
- Alert thresholds:
  - Lead ingestion latency < 500 ms end-to-end (API + insert).
  - Entitlement shelf hydrate query p95 < 20 ms.
  - Pending claim token lookup p95 < 5 ms.
- Log slowdown + guardrail details in the daily Kaizen issue once migrations complete (include owner and verification plan).

## Change Log
- 2025-11-09 — Updated for Aurora migration; replaced legacy tooling references with shared migration runner steps.
- 2025-10-27 — Initial runbook covering Schema v0 expand/migrate/contract workflow and index verification.
