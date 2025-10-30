# Aurora Operations Runbook

> Implements operational guardrails from `docs/adr/ADR-001-primary-cloud-and-database.md` and the Clarivum data platform requirements in `docs/PRDs/requierments/platform/feature-requirements.md`.

## Purpose
- Maintain Clarivum’s Aurora PostgreSQL cluster with predictable performance, automated backups, and disciplined schema governance.
- Provide procedures for migrations, restoration drills, and incident response after migrating fully onto AWS-managed data services.

## Scope
- Aurora PostgreSQL clusters: `clarivum-dev` and `clarivum-prod` (multi-AZ, eu-central-1).
- Associated S3 buckets for logical backups and bulk imports.
- Secrets distribution through AWS Secrets Manager.
- Excludes analytics warehouse ETL (covered separately).

## Clarivum Workloads
- **Transactional core** — Per ADR-036, Aurora holds `profiles`, `personas`, `leads`, `content_items`, `entitlements`, `entitlement_status_history`, and the operations audit trail (`ops_audit`). Next.js API routes, the Account Center (ADR-023), and the Operations Hub all depend on these tables for identity, personalization, incentive tracking, and historical playback. Row-level security remains mandatory for member-scoped data.
- **Background jobs** — Mission progress reconciliation, fulfillment pipelines, and finance ledgers connect through the Aurora writer endpoint using IAM-authenticated credentials issued to ECS tasks and Lambda workers.
- **Storage alignment** — Downloadable assets (ebooks, evidence) now live in S3. Access policies reference Aurora state via signed URL minting services so entitlement checks and storage access stay consistent even though the data plane moved.

## Preconditions
- Terraform state up to date for `infra/aws/data`; latest apply timestamp recorded in the infra README.
- Parameter groups (`clarivum-postgres`) and subnet groups provisioned per ADR-001.
- Secrets in AWS Secrets Manager (`/clarivum/<env>/database/{writer_url,reader_url,iam_role}`) rotated on the documented cadence.
- `database/migrations` contains versioned SQL with forward and rollback scripts and smoke tests (`database/smoke`).
- CloudWatch dashboards (`Aurora / Writer`, `Aurora / Reader`) configured and alerts routed to `#clarivum-data`.

## Provisioning & Secrets
1. Authenticate to AWS with the platform role (`aws sso login --profile clarivum-platform`).
2. Select workspace and apply Terraform for the target environment:
   ```bash
   terraform -chdir=infra/aws/data init
   terraform -chdir=infra/aws/data workspace select dev \
     || terraform -chdir=infra/aws/data workspace new dev
   terraform -chdir=infra/aws/data apply \
     -var-file=infra/aws/data/env/dev.tfvars
   ```
3. Capture Terraform outputs (`writer_endpoint`, `reader_endpoint`, `secret_arn`, `cluster_identifier`) and store in the weekly ops log.
4. Populate Secrets Manager entries with:
   - `DATABASE_URL` (writer, password-based for migrations)
   - `READ_DATABASE_URL` (reader, readonly connections)
   - `DATABASE_IAM_ROLE_ARN` for IAM authentication (ECS tasks, Lambda workers)
5. Sync secrets to runtimes following `docs/runbooks/secrets-management.md`. GitHub Actions retain read-only access to the dev replica; production secrets are scoped to runtime principals using IAM roles.
6. Regenerate TypeScript database types when schemas change: `npm run db:types` (wraps `kanel` against Aurora).

## Tooling & References
- AWS Console: RDS (cluster metrics, backups), CloudWatch (alerts), Performance Insights.
- Terraform (`infra/aws/data`) workspace.
- `npm run db:migrate` — runs migrations through the shared migration runner.
- `npm run db:migration:status` — lists pending/applied migrations per environment.
- `psql` CLI tunnelled via `aws rds generate-db-auth-token` for break-glass access.
- Slack `#clarivum-data` for deployment coordination, `#clarivum-alerts` for incidents.

## Environment Configuration
- Application services expect:
  - `DATABASE_URL` (writer)
  - `READ_DATABASE_URL` (reader)
  - `DATABASE_SSL=true`
  - `DATABASE_POOL_MAX` (default 10, override for worker fleets)
- Rotate credentials via Secrets Manager rotation Lambda or manual rotation procedure; update ECS task definitions, Lambda environment variables, and local `.env` files immediately after rotation.
- IAM-authenticated connections must assume the `aurora-app-access` role; policy updates require security approval per ADR-028.

## Operational Checklist
### Daily
- Review CloudWatch alarms (`AuroraCPUHigh`, `AuroraConnectionSaturation`, `AuroraReplicaLag`).
- Confirm AWS Health dashboard shows no RDS advisories for the region.
- Check automated backup status in RDS console (latest snapshot timestamp + PITR window).
- Sample `pg_stat_activity` for long-running queries and terminate runaway sessions where necessary.

### Weekly
- Run `npm run db:migration:status -- --env prod` to ensure no unapplied migrations remain.
- Inspect Performance Insights for top queries; share findings with backend guild.
- Assess storage growth; archive or purge tables flagged in lifecycle policies (e.g., old mission evidence) by moving data to S3 Glacier via curated scripts.

### Quarterly
- Execute restoration drill:
  1. Launch temporary cluster from latest snapshot into isolated subnet.
  2. Apply replay to target timestamp.
  3. Run smoke queries validating core tables and RLS policies.
  4. Document RPO/RTO results in `docs/runbooks/aurora-operations.md` changelog.
- Audit IAM roles with access to the cluster; remove unused principals.
- Review parameter group overrides (work_mem, statement_timeout) and compare with production baselines.

## Migration Deployment Procedure
1. **Preparation**
   - Author SQL migration with reversible scripts and corresponding smoke test.
   - Update ADRs/docs describing schema or contract changes.
   - Validate locally using Dockerized Postgres aligned with Aurora version (`npm run db:migrate -- --env local`).
2. **Dry Run**
   - Apply to staging (`npm run db:migrate -- --env staging`).
   - Execute integration tests, RLS checks, and load representative synthetic data if needed.
3. **Production Rollout**
   - Schedule deployment during low-traffic window; announce in `#clarivum-data`.
   - Run `npm run db:migrate -- --env prod` (uses writer endpoint + credentials from Secrets Manager).
   - Monitor CloudWatch dashboard for latency/lock spikes; run validation query checklist (counts, RLS, triggers).
4. **Post-Deployment**
   - Update ERDs/diagrams (`docs/diagrams/adr-001-primary-cloud-and-database`).
   - Create follow-up Kaizen ticket if indexes or guardrails are pending.

## Backup & Restore
- Automated backups retained 7 days (adjust via Terraform variable `aurora_backup_retention`).
- Additional weekly manual snapshots stored with lifecycle rule (delete after 35 days).
- PITR procedure for incidents:
  1. Quiesce writes (feature flag maintenance mode, pause background jobs).
  2. Launch new cluster from snapshot/restore time.
  3. Redirect staging environment to restored cluster for validation.
  4. Once verified, promote restored cluster to production or perform selective table restore via `pg_dump`.
  5. Document incident and update changelog.

## Incident Response
### Availability / Latency Degradation
- Verify alarms and Performance Insights to identify blocking session or missing index.
- If AWS reports regional impact, notify leadership and enable read-only banner in the app.
- For runaway queries: capture plan (`EXPLAIN (ANALYZE, BUFFERS)`) and coordinate hotfix (index, query rewrite, or feature rollback).

### RLS or Permission Drift
- Symptoms include 401/403 responses or wrong-scope records.
- Audit policies:
  ```sql
  select schemaname, tablename, policyname, permissive, roles, cmd
  from pg_policies
  where tablename = '<table>';
  ```
- Patch via migration or manual policy update; ensure regression tests added within 48 h.

### Data Integrity Issues
- Re-run reconciliation scripts (`npm run ops:reconcile -- --fix`) comparing Aurora tables with Stripe/Listmonk/Flagsmith sources.
- If corruption detected, restore specific tables from snapshot using `pg_restore --table` into staging, then apply fix-forward migration.

## Compliance & Access Control
- Enforce IAM least privilege; rotate Secrets Manager credentials quarterly.
- Enable CloudTrail data events for RDS; export audit logs monthly to the compliance S3 bucket.
- Honor GDPR deletion requests via stored procedures (`sp_redact_personal_data`); log completion in `sisu-log/`.
- Dashboard access (Performance Insights, query editor) restricted to platform engineering group with MFA.

## Escalation Matrix
- Level 1: Database steward on rotation.
- Level 2: Platform lead (schema/infra decisions).
- Level 3: CTO + AWS Support (Business Critical) for production-impacting incidents.
- Coordinate with legal/security if data exposure suspected.

## Maintenance
- Update this runbook whenever cluster configuration, tooling, or deployment processes change.
- Record changes in the changelog with date and summary.

## Changelog
- 2025-11-09 — Replaced legacy tenancy guidance with Aurora procedures following AWS migration (TSK-PLAT-080).
- 2025-10-26 — Initial database runbook (superseded).
