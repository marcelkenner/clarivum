# ADR-016: CI/CD Platform & Quality Gates
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum must ship through a trunk-based workflow with feature flags and frequent preview deploys.
- Quality safeguards (PTRD Section 8, work-intake policy) depend on automated validation before code reaches `main`.
- Teams need a single automation stack that integrates with AWS (ECR/ECS/CloudFront/Aurora), Flagsmith, and Terraform without bespoke tooling per squad.
- GitHub Actions is already the organization standard; engineers are familiar with it and secrets management can piggyback on existing OIDC patterns.
- Requirements for CI/CD behaviour live in `docs/PRDs/first_steps.md` Section 8 and the tooling overview in `docs/PRDs/technology-stack-catalog.md`.

## Decision
- Use **GitHub Actions** as the CI/CD orchestrator for the monorepo.
  - Pipelines trigger on pull requests, pushes to `main`, and scheduled jobs (nightly audits).
  - Workflows run on GitHub-hosted Ubuntu runners with caching for Node, Playwright, and Terraform downloads.
- Enforce the following required checks before merging:
  - `npm run lint:code`, `npm run lint:tasks`, `npm run typecheck`, `npm run test` (Vitest), `npm run test:e2e -- --project smoke`, `npm run format:check`.
  - Terraform plan validation for infrastructure changes and Playwright smoke suite for previews.
  - Conventional commit linting to keep history actionable.
- Integrate with AWS for preview and production deployments:
  - The CI pipeline builds container images, pushes them to ECR, and provisions or updates preview ECS services (mapped to dev CloudFront distributions) per pull request.
  - Production deploys remain gated on `main` merges after all checks pass, promoting the image to the prod ECS service via blue/green rollout.
- Secrets and environment management:
- Use GitHub OIDC to assume short-lived AWS roles (ECR push, ECS deploy, Secrets Manager reads) and retrieve scoped Flagsmith tokens on demand.
  - Store ancillary secrets (Slack webhooks, Flagsmith tokens) in GitHub Encrypted Secrets with rotation tracked in the security runbook.
- Observability:
  - Emit workflow metrics to Grafana via GitHub Actions export; alert on failure rate or runtime regressions.
  - Log deployment metadata to Plausible Analytics for funnel correlations (via custom events API).

## Diagrams
- [Architecture Overview](../diagrams/adr-016-ci-cd-platform/architecture-overview.mmd) — GitHub Actions workflows, integration checks, and deployment targets.
- [Data Lineage](../diagrams/adr-016-ci-cd-platform/data-lineage.mmd) — Workflow runs, check results, and deployment records.
- [UML Automation Components](../diagrams/adr-016-ci-cd-platform/uml-automation.mmd) — Coordinator, job runner, secret provider, and notification publisher.
- [BPMN Release Flow](../diagrams/adr-016-ci-cd-platform/bpmn-release.mmd) — Pull request gating through production deployment and monitoring.

## Consequences
- **Benefits:** Consistent automation across teams, transparent gating, native integration with GitHub reviews and AWS-hosted previews.
- **Trade-offs:** Runner minutes increase; mitigate with caching, matrix pruning, and nightly cleanups.
- **Follow-ups:**
  - Add staggered release workflows (canary vs full) once feature rollout volume increases.
  - Extend artifacts and notifications to include QA videos/traces.
  - Periodically reassess runner strategy (self-hosted vs GitHub) based on cost and parallelism demands.
