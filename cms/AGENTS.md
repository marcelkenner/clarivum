# Strapi CMS · AGENTS Guide

**Context7:** Always resolve Strapi questions via Context7 (`context7__resolve-library-id` → `context7__get-library-docs`, e.g., `/strapi/documentation`, `/strapi/strapi`). This workspace houses the self-hosted Strapi application that powers Clarivum content workflows (ADR-010).

## Local development

- Install dependencies: `npm install` (Node 20 LTS minimum). Keep the generated `package-lock.json` committed so CI caching stays effective.
- Start the admin: `npm run develop` (hot reload with SQLite or your local Postgres target).
- Lint / typecheck: `npm run lint` and `npm run typecheck` (pipeline blocks PRs if these fail).
- Unit / integration tests: `npm test` (wire new suites as content logic lands).
- Build production bundle: `NODE_ENV=production npm run build`.
- Preview production start: `NODE_ENV=production npm run start`.

### Environment

The application expects configuration through environment variables (see `config/*` and `docs/PRDs/requierments/strapi/setup.md`). Do not commit secrets. To mirror ECS behaviour locally, export:

- `DATABASE_URL` (Postgres connection string) or discrete `DATABASE_*` keys.
- `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`.
- Upload provider credentials (`AWS_*`).

Use `.env.example` to document required variables; keep actual values in 1Password / AWS Secrets Manager per ADR-007.

## CI/CD expectations

- The GitHub Actions workflow `.github/workflows/strapi-ci-cd.yml` runs lint → typecheck → tests → build on every PR touching `cms/**` or `infra/strapi/**`.
- Pushes to `main` build a container via `cms/Dockerfile`, push it to ECR, retag `:dev`, and redeploy the dev ECS service. Manual `workflow_dispatch` runs promote deployments for `dev`/`prod`.
- Configure GitHub repository variables:
  - `STRAPI_AWS_REGION`
  - `STRAPI_ECR_REGISTRY` (e.g., `123456789012.dkr.ecr.eu-central-1.amazonaws.com`)
  - `STRAPI_ECR_REPOSITORY` (e.g., `clarivum/strapi`)
- Configure secrets:
  - `AWS_STRAPI_DEPLOY_ROLE_ARN` (IAM role with `ecr:*Image*`, `ecs:Describe*`, `ecs:UpdateService`, `iam:PassRole`, `secretsmanager:GetSecretValue`).
- Configure GitHub environments `strapi-dev` / `strapi-prod` with variables/secrets:
  - `STRAPI_CLUSTER_ARN`, `STRAPI_SERVICE_NAME`
  - `STRAPI_HEALTHCHECK_URL`
  - `STRAPI_REVALIDATE_URL`
  - `STRAPI_DEPLOYMENT_WEBHOOK_URL` (Next.js deployment telemetry endpoint)
  - Secret `STRAPI_REVALIDATE_SECRET`
  - Secret `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN` (matches `OBSERVABILITY_DEPLOYMENT_SECRET` in the target Next.js environment)
  - Optional `STRAPI_MIGRATION_COMMAND` (shell command that runs migrations/seeds, e.g., `aws ecs run-task ...`).
  - Optional `STRAPI_DEPLOY_SUBNETS`, `STRAPI_DEPLOY_SECURITY_GROUPS` if migration helpers rely on them.

The workflow skips automatically when `cms/package.json` is absent, so add the Strapi project before expecting builds to succeed.

## Docker image

- `cms/Dockerfile` builds a production-ready Strapi image (multi-stage, Node 20 slim). Update it if build tooling changes (e.g., Yarn, pnpm).
- Keep `cms/.dockerignore` aligned so Docker contexts stay small (`node_modules`, build outputs, Playwright artifacts, etc.).
- When adding native dependencies (Sharp, LibreOffice, etc.), extend the build stage and document OS packages in this file and ADR-010.

## Guardrails

- Schema changes must ship through code (never via direct admin edits) and follow the migration plan in `docs/PRDs/requierments/strapi/setup.md`.
- Add Playwright smoke coverage (`e2e/cms-smoke.spec.ts`) when new admin flows arrive.
- Emit deployment events to the Observability stack via the shared `observability/node-sdk.ts` helpers or shell scripts that call the telemetry proxy. Update `docs/runbooks/deployment.md` whenever behaviour changes.

Update this guide whenever tooling, scripts, or CI/CD expectations evolve. Run `npm run ensure:agents` after restructuring subdirectories so new folders inherit the correct guidance.
