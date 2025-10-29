---
id: TSK-PLAT-058
title: Automate Supabase Schema Migration & Monitoring Guardrails
status: backlog
area: platform
subarea: data-platform
owner: Backend Lead
collaborators:
  - DevOps Lead
  - Analytics Lead
  - QA Lead
effort: medium
created_at: 2025-11-11
updated_at: 2025-11-11
links:
  - docs/PRDs/requierments/supabase-platform/feature-requirements.md
  - docs/runbooks/supabase-operations.md
  - docs/runbooks/deployment.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - TODO.md
context7:
  - /supabase/supabase
  - /hashicorp/terraform
  - /supabase/cli
tags:
  - supabase
  - migrations
  - observability
---

## Summary
Close the remaining DoD gap for Supabase tenancy by automating migration deployment and adding monitoring dashboards/alerts so schema changes are governed and observable.

## Definition of Ready
- [x] Base Supabase tenancy Terraform module completed (TSK-PLAT-012).
- [ ] Decision recorded on migration tooling (SQL scripts vs Drizzle or Supabase CLI pipeline).
- [x] Observability platform (Grafana) available for dashboards.

## Definition of Done
- [ ] CI job runs Supabase migrations against dev on PR and prod on merge (with approvals).
- [ ] Alerting/dashboards created for migration failures, slow queries, and backup drift, linked in runbooks.
- [ ] Runbooks updated with automated migration workflow and escalation paths.
- [ ] TODO entries for migration automation + monitoring close-out resolved.

## Work Plan
- [ ] Finalize migration tooling choice and document in ADR/DoR.
- [ ] Implement CI automation (Supabase CLI or custom scripts).
- [ ] Configure Grafana panels + alerts for Supabase metrics.
- [ ] Update runbooks and communicate new guardrails to engineering teams.

## Risks & Mitigations
- Automated migrations causing downtime → enforce dry runs, use transactional scripts, add rollback procedures.
- Alert fatigue from noisy dashboards → set sensible thresholds, test alerts before enabling.
