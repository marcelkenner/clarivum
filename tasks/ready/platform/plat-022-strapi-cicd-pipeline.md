---
id: TSK-PLAT-022
title: Implement Strapi CI/CD Pipeline
status: ready
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - Editorial Engineering
  - QA Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
  - docs/checklists/pull-request.md
context7:
  - /strapi/documentation
  - /github/actions
  - /hashicorp/terraform
tags:
  - cicd
  - automation
  - governance
---

## Summary
Build GitHub Actions workflows that lint, type-check, test, build, and deploy the Strapi service to dev and prod ECS clusters. Codify migration execution, blue/green rollout, and smoke tests so every release follows the requirements outlined in the Strapi setup PRD.

## Definition of Ready
- [x] Container registry access and IAM permissions confirmed with platform security (GitHub OIDC role granted least-privilege: `ecr:*Image*`, `ecs:Describe*`, `ecs:RegisterTaskDefinition`, `ecs:UpdateService`, `iam:PassRole` for task role, `secretsmanager:GetSecretValue`; conditioned per cluster).
- [x] Migration + seed tooling defined (Strapi Transfer drives structure/content promotion; idempotent custom seeds for dev/demo data; migrations executed as pre-deploy job with backout plan).
- [x] Smoke test endpoints and runbooks documented by Editorial Engineering (health `/_health` checks DB + storage, `/admin` accessibility, sample content GET, webhook endpoint response; Playwright headless checks post-deploy with rollback trigger).
- [x] Branch/release naming conventions finalized with product operations (trunk-based branches `feat/*`, releases `release/*`, tags `cms-vX.Y.Z`, hotfixes `hotfix/*`).

## Definition of Done
- [ ] CI pipeline executes linting, schema validation, and unit tests on pull requests with blocking status.
- [ ] Build stage produces versioned container images pushed to ECR with provenance metadata.
- [ ] Deploy workflow updates ECS services, runs migrations, performs health checks, and triggers frontend revalidation webhooks.
- [ ] Secrets pulled from AWS Secrets Manager during deployment; no plaintext secrets committed.
- [ ] Monitoring hooks emit deployment events to observability stack; rollback guidance added to deployment runbook.
- [ ] Follow-up tasks logged for canary rollouts, load testing, or test suite expansion.
