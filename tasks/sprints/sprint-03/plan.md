---
id: sprint-03
title: Sprint 03 Plan
status: planned
start: 2025-12-01
end: 2025-12-12
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/PRDs/requierments/strapi/feature-requirements.md
  - docs/adr/ADR-010-content-management-platform.md
---

# Sprint 03 Plan (Weeks 5–6)

- **Window:** 2025-12-01 → 2025-12-12  
- **Sprint Goal:** Launch Strapi content platform infrastructure (ECS/RDS/S3), CI/CD automation, and core CMS workflow so editors can author and publish into Clarivum safely.
- **Theme:** “CMS foundation” — make Strapi production-ready with automated deployments and governance.
- **Owners:** DevOps Lead, Content Platform Lead, Platform Tech Lead  
- **Slack check-ins:** `#clarivum-platform`, `#clarivum-dev`, `#clarivum-content`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/plat-020-strapi-ecs-infrastructure.md`](../../backlog/platform/plat-020-strapi-ecs-infrastructure.md) | Backlog → Ready → In-progress | Terraform ECS services, ALB, IAM, observability |
| [`tasks/backlog/platform/plat-021-strapi-data-foundation.md`](../../backlog/platform/plat-021-strapi-data-foundation.md) | Backlog → Ready → In-progress | Provision RDS + S3 with backups, policies |
| [`tasks/backlog/platform/plat-022-strapi-cicd-pipeline.md`](../../backlog/platform/plat-022-strapi-cicd-pipeline.md) | Backlog → Ready → In-progress | GitHub Actions pipeline, migrations, deploy automation |
| [`tasks/backlog/shared/shared-003-strapi-platform-rollout.md`](../../backlog/shared/shared-003-strapi-platform-rollout.md) | Backlog → Ready → In-progress | Configure Strapi models, plugins, workflows, training |

### Stretch (if scope stabilizes early)

- [`tasks/backlog/platform/plat-016-meilisearch-service.md`](../../backlog/platform/plat-016-meilisearch-service.md) — begin search indexing plumbing if webhooks land smoothly.
- [`tasks/backlog/shared/shared-005-glossary-platform.md`](../../backlog/shared/shared-005-glossary-platform.md) — kick off glossary tooling in Strapi if editorial bandwidth allows.

## Definition of Success

- Dev/prod Strapi ECS services running behind ALB with autoscaling, secrets via AWS Secrets Manager, and alarms feeding incident channels.
- RDS + S3 provisioned with PITR, lifecycle policies, encryption, and documented backup/restore drill.
- CI/CD pipeline builds container images, runs schema validation/tests, executes migrations, and deploys blue/green releases with health verification.
- Editorial workflow operational: roles/permissions configured, core content types created, webhooks triggering Next.js revalidation and analytics integrations; runbook + training recorded.
- All tasks moved to `done/` with Kaizen guardrail entries (e.g., automated schema diffs, backup alerts).

## Dependencies & Prep Work

- Finalize DoR checkboxes: networking conventions, secrets catalog, schema design, permissions matrix (due 2025-11-26).
- Coordinate Terraform module reviews with platform/infra maintainers to avoid blocking approvals.
- Ensure Sprint 02 outputs (routing schema, Supabase types, SEO utilities) are available to integrate with Strapi webhooks and content contracts.
- Secure temporary sandbox credentials for Strapi plugins before sprint start.

## Risks & Mitigations

- **Terraform complexity / AWS quotas** → Run early module validation and quota checks; schedule platform pairing sessions.
- **Content model churn** → Hold weekly sync with editorial to lock schema; capture deltas in ADR addendum if changes emerge.
- **Deployment instability** → Start with dev environment, script rollback steps, and keep feature flag to gate CMS-sourced content.
- **Secrets sprawl** → Centralize via Secrets Manager; add lint checks to prevent plaintext secrets in repos.

## Key Dates

- **Sprint Planning:** 2025-12-01  
- **Infra dry run:** 2025-12-04 (deploy dev environment)  
- **Editorial training:** 2025-12-10 (recorded session)  
- **Demo & Retro:** 2025-12-12

Keep this plan updated as scope shifts; mirror critical decisions in ADR-010 follow-ups, runbooks, and daily Kaizen notes.
