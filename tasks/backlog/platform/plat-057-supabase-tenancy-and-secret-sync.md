---
id: TSK-PLAT-057
title: Apply Supabase Tenancy and Sync Secrets
status: backlog
area: platform
subarea: data-platform
owner: DevOps Lead
collaborators:
  - Backend Lead
  - Platform Engineer
effort: small
created_at: 2025-11-11
updated_at: 2025-11-11
links:
  - docs/PRDs/requierments/supabase-platform/feature-requirements.md
  - docs/adr/ADR-036-supabase-schema-v0.md
  - docs/runbooks/supabase-operations.md
  - docs/runbooks/secrets-management.md
  - TODO.md
context7:
  - /supabase/supabase
  - /hashicorp/terraform
tags:
  - supabase
  - infrastructure
  - guardrail
---

## Summary
Execute the Supabase Terraform apply for dev and prod using the slug-based config, then distribute the generated secrets across runtimes and validate connectivity so downstream teams can rely on the tenancy.

## Definition of Ready
- [x] Supabase organisation slug confirmed via `supabase orgs list`.
- [ ] PAT with project management scope available at apply time.
- [x] Terraform workspace initialised (`infra/supabase`).

## Definition of Done
- [ ] `terraform -chdir=infra/supabase plan` and `apply` executed for dev/prod with artefacts archived.
- [ ] AWS Secrets Manager entries verified for each environment.
- [ ] Supabase keys synced to Vercel, Lambda, and local `.env` with validation checklist complete.
- [ ] TODO entries for apply and secret sync closed or annotated with completion date.
- [ ] Runbook updated with apply timestamp + verification notes.

## Work Plan
- [ ] Export PAT, run Terraform plan/apply for dev.
- [ ] Repeat for prod (after change approval).
- [ ] Sync secrets to runtime environments and run connectivity smoke tests.
- [ ] Log completion in ops runbook + TODO tracker, notify stakeholders in `#clarivum-platform`.

## Risks & Mitigations
- PAT expiry mid-apply → generate fresh token and re-run.
- Secrets drift between environments → automate via scripts and double-check with smoke tests.
