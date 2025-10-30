---
id: TSK-PLAT-004
title: Stand Up CI/CD Quality Gates
status: backlog
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - Frontend Lead
  - Backend Lead
  - QA Lead
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-28
links:
  - docs/PRDs/first_steps.md#8
  - docs/runbooks/deployment.md
  - docs/role-guides/devops.md
  - docs/adr/ADR-016-ci-cd-platform.md
context7:
  - /websites/github_en_actions
  - /vercel/next.js
  - /websites/registry_terraform_io_providers_hashicorp_aws
tags:
  - ci-cd
  - automation
  - quality
---

## Summary
Deliver an initial GitHub Actions pipeline that enforces linting, type checks, unit tests, and preview deployments so every merge meets the PTRD Section 8 quality bar.

## Definition of Ready
- [x] Branch protections locked: require checks `lint`, `typecheck`, `unit`, `playwright-smoke`, `build`, `terraform-plan` (infra diffs), `seo-guardrail`, `changeset-version`, 2 reviewers, signed commits/DCO, no force pushes, Codeowners for `infra/**`, `apps/web/**`, `packages/config/**`.
- [x] CI tooling inventory chosen covering ESLint (flat), TypeScript `--noEmit`, Vitest (jsdom/node), Playwright smoke on preview, Terraform validate/plan, tflint, tfsec, `pnpm audit`, and weekly Snyk scan.
- [x] Secrets strategy documented: favor provider GitHub Apps; scoped tokens stored in GitHub Environments per env, long-lived service keys in AWS Secrets Manager injected via OIDC-assumed role.
- [x] Governance policy alignment complete—required checks and branch rules mapped to `docs/policies/repository-governance.md` expectations.

## Definition of Done
- [ ] GitHub Actions workflows created for lint/type-check/unit-test/build and pull-request gating.
- [ ] Preview deployments wired to Vercel with status reporting back to GitHub.
- [ ] Failing tests or lint rule violations block merges; branch protection updated to require reviews + status checks + conventional commit linting.
- [ ] CI documentation added to `docs/runbooks/deployment.md` and devops role guide.
- [ ] Monitoring for pipeline health (e.g., workflow duration, failure alerts) configured.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Coordinate with QA once Playwright smoke suite (TSK-QA-001) is automation-ready so it can slot into the pipeline without regressions.
