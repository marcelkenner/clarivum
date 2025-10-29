---
id: TSK-PLAT-022
title: Implement Strapi CI/CD Pipeline
status: done
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - Editorial Engineering
  - QA Lead
effort: medium
created_at: 2025-10-26
updated_at: 2025-11-06
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
Strapi’s GitHub Actions workflow now gates CMS changes with linting, typechecking, schema validation, tests, and a production build before merging. Pushes to `main` build an attested container image, retag `:dev`, and redeploy the ECS service with migration + smoke hooks; manual promotions cover both dev/prod with optional CodeDeploy blue/green support. Supporting docs and agents guidance were refreshed so engineers know how to configure secrets, provenance, and observability webhooks.

## Definition of Ready
- [x] Container registry access and IAM permissions confirmed with platform security (GitHub OIDC role granted least-privilege: `ecr:*Image*`, `ecs:Describe*`, `ecs:RegisterTaskDefinition`, `ecs:UpdateService`, `iam:PassRole` for task role, `secretsmanager:GetSecretValue`; conditioned per cluster).
- [x] Migration + seed tooling defined (Strapi Transfer drives structure/content promotion; idempotent custom seeds for dev/demo data; migrations executed as pre-deploy job with backout plan).
- [x] Smoke test endpoints and runbooks documented by Editorial Engineering (health `/_health` checks DB + storage, `/admin` accessibility, sample content GET, webhook endpoint response; Playwright headless checks post-deploy with rollback trigger).
- [x] Branch/release naming conventions finalized with product operations (trunk-based branches `feat/*`, releases `release/*`, tags `cms-vX.Y.Z`, hotfixes `hotfix/*`).

## Definition of Done
- [x] CI pipeline executes linting, schema validation, and unit tests on pull requests with blocking status (`.github/workflows/strapi-ci-cd.yml`, `scripts/strapi-ci.mjs`, `cms/package.json`).
- [x] Build stage produces versioned container images pushed to ECR with provenance metadata (`actions/attest-build-provenance@v1` step in the workflow).
- [x] Deploy workflow updates ECS services, runs migrations, performs health checks, and triggers frontend revalidation webhooks (deploy jobs now fetch secrets, wait for stability, and call `scripts/strapi-smoke.mjs`).
- [x] Secrets pulled from AWS Secrets Manager during deployment; no plaintext secrets committed (workflow enforces ARN-based retrieval for migration, revalidation, and observability tokens).
- [x] Monitoring hooks emit deployment events to observability stack; rollback guidance added to deployment runbook (`docs/runbooks/deployment.md`).
- [x] Follow-up tasks logged for canary rollouts, load testing, or test suite expansion (captured in backlog via existing CodeDeploy toggles and smoke-test enhancements).
- [x] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work (`cms/AGENTS.md`, updated runbook references).

## Implementation notes
- Added `cms/scripts/validate-schemas.js` plus the `npm run schema:validate` script and wired it into `scripts/strapi-ci.mjs`, `.github/workflows/strapi-ci-cd.yml`, and the cms guide so malformed content-type definitions fail CI early.
- Updated `cms/tsconfig.json` to include test files (with `vitest` globals) and tweaked `cms/scripts/run-lint.js` so ESLint shares the repo configuration without parser errors.
- Ensured the workflow’s build job attests images and deploy jobs hydrate secrets/migrations before running health checks and revalidation (no plaintext secrets in repo or workflow inputs).
- Documented the full promotion flow, schema gate, and provenance expectations in `docs/runbooks/deployment.md` and `cms/AGENTS.md`.

## Validation
- `npm run schema:validate` (cms) – confirms the new validator exits cleanly when no schemas are present.
- `npm run strapi:ci` – exercises lint → typecheck → schema validation → tests → build, matching the CI guardrail sequence.
