# Clarivum Strapi CMS

This workspace hosts the Strapi v5 application that powers Clarivum’s editorial tooling (see ADR-010). It is wired into `.github/workflows/strapi-ci-cd.yml`, so any changes under `cms/` participate in the dedicated CI/CD pipeline.

## Getting started

1. Ensure Node 20+ is active (`nvm use 20` or `nvm use 22`).
2. Install dependencies from the workspace root: `npm install` (or `npm ci` in CI).
3. Copy `.env.example` to `.env` (to be added) and provide the required Postgres / Supabase credentials.
4. Run `npm run develop` to start the Strapi admin with hot reload.

Refer to `cms/AGENTS.md` for the authoritative operational checklists, deployment notes, and guardrails.

## Scripts

| Command             | Purpose                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `npm run develop`   | Start the admin in watch mode (aliases: `npm run dev`).            |
| `npm run start`     | Serve the compiled admin without hot reload.                       |
| `npm run build`     | Compile the admin panel assets.                                    |
| `npm run typecheck` | Perform TypeScript checks (`tsc --noEmit`).                        |
| `npm run lint`      | Placeholder lint step. Replace with ESLint once rules are defined. |
| `npm run test`      | Placeholder test runner while suites are under construction.       |
| `npm run deploy`    | Hooks into the Strapi deploy CLI for future automation.            |

## CI/CD alignment

- Pull requests touching `cms/**` trigger `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` via the Strapi CI/CD workflow.
- Pushes to `main` build the Docker image from `cms/Dockerfile`, push to ECR, and redeploy the dev ECS service.
- Manual `workflow_dispatch` runs promote tagged images to `strapi-dev` or `strapi-prod`, respecting the environment secrets described in `cms/AGENTS.md`.

## GitHub configuration checklist

1. Repository variables (Settings → Secrets and variables → Actions → Variables):
   - `STRAPI_AWS_REGION`
   - `STRAPI_ECR_REGISTRY` (e.g., `123456789012.dkr.ecr.eu-central-1.amazonaws.com`)
   - `STRAPI_ECR_REPOSITORY` (e.g., `clarivum/strapi`)
2. Environment configuration (Settings → Environments → `strapi-dev` / `strapi-prod`):
   - Variables: `STRAPI_CLUSTER_ARN`, `STRAPI_SERVICE_NAME`, `STRAPI_HEALTHCHECK_URL`, `STRAPI_REVALIDATE_URL`, `STRAPI_DEPLOYMENT_WEBHOOK_URL`, optional `STRAPI_MIGRATION_COMMAND`
   - Secret reference variables: `STRAPI_REVALIDATE_SECRET_ARN`, `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN_ARN`, optional `STRAPI_MIGRATION_COMMAND_SECRET_ARN`
   - Secret: `AWS_STRAPI_DEPLOY_ROLE_ARN` (shared across environments). Store every other sensitive value in AWS Secrets Manager and point the ARNs above at those records so GitHub Actions only ever reads ephemeral credentials.
3. Validate automation:
   - Open a PR touching `cms/**` to watch the quality gate job complete.
   - Push to `main` (or simulate via a protected branch) to confirm the image build + ECS rollout path.
   - Trigger **Strapi CI/CD** manually (`workflow_dispatch`) for both `strapi-dev` and `strapi-prod` to ensure promotion paths respect the environment settings.

## Next steps

- Replace the placeholder lint/test scripts with real guardrails as Strapi code lands.
- Keep `.env.example` aligned with required runtime configuration (database, admin secrets, upload provider credentials).
- Introduce migrations / seeds under `cms/src` as schemas evolve.
