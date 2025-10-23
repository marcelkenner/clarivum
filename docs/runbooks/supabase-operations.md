# Supabase Operations Runbook

> Implements operational guardrails from `docs/adr/ADR-001-primary-cloud-and-database.md` and `docs/PRDs/requierments/supabase-platform/feature-requirements.md`.

## Purpose
- Maintain Clarivum’s Supabase Postgres and Storage tenants with reliable backups, RLS enforcement, and migration discipline.
- Provide procedures for schema deployments, restoration drills, and incident handling.

## Scope
- Supabase projects: `clarivum-dev`, `clarivum-prod`.
- Applies to Postgres database, Storage buckets (ebooks, evidence), Realtime channels used by mission progress.
- Excludes analytics warehouse ETL (covered elsewhere).

## Preconditions
- Terraform state current; latest apply timestamp recorded in infra repo README.
- Supabase access roles provisioned: `service_role`, `anon`, `member`, `subscriber`, `admin`.
- Secrets stored in AWS Secrets Manager; rotation schedule documented.
- `db/migrations` folder contains versioned SQL migrations with rollback scripts.

## Tooling & References
- Supabase Dashboard (`https://app.supabase.com`).
- Terraform workspace (`infra/supabase`).
- `npm run db:migrate` — applies migrations via Supabase CLI.
- Grafana `Postgres Health` dashboard (latency, connections, slow queries).
- Slack `#clarivum-data` for deployment coordination.

## Operational Checklist
### Daily
- Check Grafana alerts for connection spikes or replica lag.
- Review Supabase status page for ongoing incidents.
- Verify backup status (daily backups success message in Supabase dashboard).
- Spot-check error logs for RLS violations or auth failures.

### Weekly
- Run `npm run db:migration:status` to ensure no pending migrations in prod.
- Review storage usage growth; archive stale assets if necessary.
- Confirm PITR retention window (default 7 days) is intact.

### Quarterly
- Execute restore drill:
  1. Spin up temporary Supabase project (`clarivum-restore-test`).
  2. Apply latest backup snapshot + WAL replay.
  3. Run smoke queries ensuring core tables accessible.
  4. Document findings and update RPO/RTO log.
- Audit RLS policies; ensure no table exposed without policy.

## Migration Deployment Procedure
1. **Preparation**
   - Author SQL migration with forward and rollback scripts.
   - Update data contracts and coordinate with dependent teams.
   - Run migration locally against dev database (`npm run db:migrate -- --env dev`).
2. **Dry Run**
   - Apply migration to staging/preview environment.
   - Execute regression tests (integration, RLS).
3. **Production Rollout**
   - Schedule deployment window (prefer non-peak hours).
   - Run `npm run db:migrate -- --env prod`.
   - Monitor Grafana for latency spikes; run validation query checklist.
4. **Post-Deployment**
   - Update schema docs and ER diagrams.
   - Notify stakeholders in `#clarivum-data`.

## Backup & Restore
- Automatic daily backups enabled; PITR window 7 days.
- Manual snapshot: `supabase db dump --project-ref <ref>`.
- Restore workflow (prod incident):
  1. Pause writes via feature flag or maintenance page.
  2. Open Supabase support ticket to initiate restore to point-in-time (`timestamp`).
  3. Verify restored data in read-only mode; once validated, re-enable writes.
  4. Post incident report with root cause and data loss assessment.

## Incident Response
### Availability / Latency Degradation
- Confirm issue via Grafana metrics (connections, CPU).
- Check Supabase status page; if platform outage, notify stakeholders and enable read-only mode in app.
- If query hotspot:
  - Identify slow query via `pg_stat_statements`.
  - Add index or rollback recent migration causing load.
  - Coordinate with engineering to throttle traffic if necessary.

### RLS Misconfiguration
- Symptom: unauthorized access errors or data leakage.
- Steps:
  1. Audit affected table policies (`select * from pg_policies where tablename = '...'`).
  2. Apply fix migration or policy update.
  3. Regenerate JWT claims if auth scope changed.
  4. Document incident and preventive measures.

### Storage Incident
- For asset corruption or access failure, validate bucket policy and signed URL generation.
- Re-upload from backup if necessary; ensure lifecycle rules intact.

## Compliance & Access Control
- Enforce MFA on Supabase dashboard users; review quarterly.
- Log admin actions via Supabase audit logs; export monthly to compliance archive.
- Honor GDPR deletion requests by running anonymization scripts and logging completion.

## Escalation Matrix
- Level 1: Database steward on rotation.
- Level 2: Platform lead (schema/infra decisions).
- Level 3: CTO + Supabase support escalation (critical outages).
- Coordinate with legal if data exposure suspected.

## Maintenance
- Update runbook after schema architecture changes or new services integrate.
- Record changes in changelog with date and summary.

## Changelog
- 2025-10-26 — Initial runbook outlining migration, backup, and incident workflows.
