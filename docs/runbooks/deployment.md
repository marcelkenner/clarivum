# Deployment Runbook

This runbook defines the process for promoting changes from trunk to production while staying within Clarivum’s reliability and performance guardrails.

## Preconditions

- Pull requests merge only when the PR checklist in `docs/checklists/pull-request.md` is complete.
- `main` is always deployable; feature work ships behind Flagsmith flags when incomplete.
- Dev environment mirrors production configuration (feature flags, environment variables, database migrations).
- SLO dashboards (Grafana) show error budget burn < 50% and no Sev-1 incidents are open.

## CI/CD pipeline overview

1. **GitHub Actions (`ci.yml` – “Validate, test, and smoke” job):**
   - Installs deps via `npm ci --ignore-scripts`, runs `npm run ensure:agents`, installs Playwright browsers (`PLAYWRIGHT_BROWSERS_PATH=0`).
   - Executes `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run test -- --coverage`.
   - Runs `npm run test:e2e:smoke`, uploads `vitest-coverage`, `playwright-report`, and `ci-metrics` artifacts, and posts Slack + PR notifications when smoke fails.
   - The job does not build production artifacts; the deploy workflow builds/pushes containers and updates ECS after CI passes.
2. On success, GitHub Actions builds the preview image, launches a temporary ECS Fargate service in the dev account, and runs integration smoke tests against the preview URL.
3. On manual approval (release captain), the pipeline promotes the build to the persistent **dev** environment:
   - Run Aurora migrations via the migration runner (`database/migrations` applied through GitHub Actions using `psql` + `migrate.ts`).
   - Execute dev smoke test suite + synthetic SLO probes (Checkly).
4. Production deployment is triggered via a protected GitHub Actions workflow (`deploy-production.yml`) requiring approvals from:
   - Release captain (engineering).
   - Product owner for the impacted vertical.

## Scheduled guardrails

- `.github/workflows/flags-stale.yml` (Node 20) runs every Monday at 09:00 UTC and on-demand to execute `npm run flags:stale`. The workflow requires `FLAGSMITH_PROJECT_ID`, `FLAGSMITH_API_TOKEN`, and `SLACK_WEBHOOK_CI` secrets plus the default `GITHUB_TOKEN`. It refreshes `metrics/feature-flags/stale-report.json`, posts to `#clarivum-platform`, and creates `[flags] Sunset overdue` issues so flag cleanup tasks are always tracked.

## Deployment steps

1. **Kick off release:**
   - Confirm the candidate commit on `main`.
   - Create a release ticket capturing changes, feature flags affected, and rollback plan.
2. **Run `Deploy to Production` workflow:**
   - Provide the commit SHA and changelog summary.
   - Workflow executes:
     - Pre-deploy health checks (Grafana SLO API call, Flagsmith API availability).
     - Run Aurora migrations (apply pending SQL under `database/migrations`).
     - ECS Fargate production deployment (update service/task definition, invalidate CloudFront).
     - Lambda job package deployment via Terraform Cloud run.
3. **Post-deploy verification (within 15 minutes):**
   - Validate core journeys (home → vertical start → CTA) using scripted Playwright smoke.
   - Confirm no new alerts in Grafana; check error rate < 0.5% and p95 latency within budget.
   - Update release ticket with verification results.

### Strapi ECS deploys (TSK-PLAT-020)

Strapi infrastructure lives in Terraform under `infra/strapi`. Follow this sequence whenever updating container images, scaling policies, or infrastructure modules:

#### GitHub Actions pipeline (TSK-PLAT-022)

- Workflow: `.github/workflows/strapi-ci-cd.yml`
  - **PRs (`cms/**`, `infra/strapi/**`)** – run `npm run lint`, `npm run typecheck`, `npm run schema:validate`, `npm test`, and `npm run build` inside `cms/`.
  - **Push to `main`** – build `cms/Dockerfile`, push the image to ECR (`${STRAPI_ECR_REGISTRY}/${STRAPI_ECR_REPOSITORY}:${GITHUB_SHA::12}`), retag `:dev`, run optional migrations, update the dev ECS service (or trigger CodeDeploy blue/green if configured), wait for stability, and invoke health + revalidation hooks.
  - After every rollout the workflow executes `scripts/strapi-smoke.mjs` to hit the configured smoke URLs (defaults to `/api/healthz`) and fail fast on regressions.
  - Build artefacts are attested via `actions/attest-build-provenance@v1` before deployment so downstream consumers can verify the pushed digest.
  - **Manual deploy (`workflow_dispatch`)** – supply:
    - `environment` (`dev` | `prod`)
    - `image_tag` (immutable tag/sha to promote)
    - `run_migrations` (default `true`)
    - `promote_only` (`true` skips ECS rollout; retags image alias only)
    - Workflow assumes `AWS_STRAPI_DEPLOY_ROLE_ARN` secret (OIDC) and repository variables `STRAPI_AWS_REGION`, `STRAPI_ECR_REGISTRY`, `STRAPI_ECR_REPOSITORY`.
  - **Optional blue/green rollouts** – provide `STRAPI_CODEDEPLOY_APPLICATION`, `STRAPI_CODEDEPLOY_DEPLOYMENT_GROUP`, and `STRAPI_TASK_DEFINITION_FAMILY` in the GitHub environment (plus optional `STRAPI_CONTAINER_NAME` / `STRAPI_CONTAINER_PORT`). When present, the workflow registers a new task definition revision with the fresh image, creates an AWS CodeDeploy deployment, and waits for the deployment to succeed before running post-deploy checks.
- **Quality guardrails:** `cms/scripts/run-lint.js`, `cms/scripts/run-tests.js`, and `cms/scripts/validate-schemas.js` wrap the repo-level ESLint/Vitest/JSON tooling so Strapi code and content-type definitions fail fast when they drift. Keep those helpers aligned with repository-wide config changes.
- Local dry-run: `npm run strapi:ci` mirrors the workflow’s lint → typecheck → schema validation → test → build sequence with generated SQLite + secret defaults, so CMS changes are reproducible without AWS credentials.
- GitHub environments:
  - `strapi-dev` / `strapi-prod` **variables**: `STRAPI_CLUSTER_ARN`, `STRAPI_SERVICE_NAME`, optional `STRAPI_HEALTHCHECK_URL`, `STRAPI_REVALIDATE_URL`, `STRAPI_MIGRATION_COMMAND`, `STRAPI_SMOKE_TEST_URLS`.
  - Optional blue/green variables: `STRAPI_CODEDEPLOY_APPLICATION`, `STRAPI_CODEDEPLOY_DEPLOYMENT_GROUP`, `STRAPI_TASK_DEFINITION_FAMILY`, plus optional overrides `STRAPI_CONTAINER_NAME`, `STRAPI_CONTAINER_PORT`.
  - `strapi-dev` / `strapi-prod` **variables** (observability): `STRAPI_DEPLOYMENT_WEBHOOK_URL` pointing to `https://app.<env>.clarivum.com/api/observability/v1/deployments`.
  - `strapi-dev` / `strapi-prod` **secret reference variables**: `STRAPI_REVALIDATE_SECRET_ARN`, `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN_ARN`, optional `STRAPI_MIGRATION_COMMAND_SECRET_ARN` when migration commands carry credentials. These ARNs must point at Secrets Manager entries (`clarivum/strapi/<env>/*`) so GitHub never stores the plaintext tokens.
- Repository variables (Settings → Actions → Variables) required by every run:
  - `STRAPI_AWS_REGION`
  - `STRAPI_ECR_REGISTRY`
  - `STRAPI_ECR_REPOSITORY`
- Secrets handling:
  - Store Strapi deployment tokens, revalidation tokens, and migration credentials in AWS Secrets Manager (`clarivum/strapi/<env>/*`). The GitHub Actions jobs assume `AWS_STRAPI_DEPLOY_ROLE_ARN`, resolve the ARNs provided via `STRAPI_REVALIDATE_SECRET_ARN` / `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN_ARN` / `STRAPI_MIGRATION_COMMAND_SECRET_ARN`, and hydrate environment variables just-in-time.
- Next.js environments (`preview`, `dev`, `prod`) must define `OBSERVABILITY_DEPLOYMENT_SECRET`; the Strapi workflow fetches the matching deployment token from Secrets Manager via `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN_ARN` before emitting deployment spans.
- Validation steps after configuring secrets/variables:
  1. Open a PR that touches `cms/**` to observe the quality gate succeed.
  2. Push a commit to `main` (or a protected test branch) to confirm the image build + dev ECS rollout.
  3. Trigger the manual workflow for both `strapi-dev` and `strapi-prod` to verify promotion + health check behaviour.
- Migration hook:
  - Preferred approach is a one-off ECS task (`aws ecs run-task ... --overrides '{"containerOverrides":[{"name":"strapi","command":["npm","run","migrate"]}]}'`) defined in `STRAPI_MIGRATION_COMMAND`. If unset, the workflow falls back to `cms/scripts/predeploy.sh` when present. Keep commands idempotent and add the backout plan to this runbook.
- Health check webhook:
  - Strapi exposes an unauthenticated `GET /api/healthz` endpoint that pings the database and reports uptime. Point the ALB `health_check_path` (Terraform default) and `STRAPI_HEALTHCHECK_URL` to `https://cms-<env>.<domain>/api/healthz`. The workflow retries 6× (10 s backoff) before failing.
- Frontend revalidation:
- Next.js ships a protected proxy at `POST /api/revalidate` that accepts Bearer-authenticated payloads with `paths`, `tags`, and optional `scope=strapi`. The default scope revalidates `/` and `/library`; extend `scopeRegistry` in `src/app/api/revalidate/route.ts` as more Strapi-driven pages arrive. Set `STRAPI_REVALIDATE_URL` to this endpoint (e.g., `https://app.<env>.clarivum.com/api/revalidate?scope=strapi`) and place the shared token in AWS Secrets Manager. Reference it from the workflow via `STRAPI_REVALIDATE_SECRET_ARN`. The route now reads `STRAPI_REVALIDATE_SECRET` first and falls back to `REVALIDATE_TOKEN` so older automation keeps working—update both secrets together when rotating credentials.
- Observability event hook:
  - `STRAPI_DEPLOYMENT_WEBHOOK_URL` calls the Next.js deployment webhook. The workflow posts `{service, environment, status, version, sha, image, metadata}` to `/api/observability/v1/deployments` so Grafana dashboards see deployment activity.
  - Store the bearer token for that endpoint in Secrets Manager and surface it to GitHub Actions through `STRAPI_DEPLOYMENT_WEBHOOK_TOKEN_ARN`; the underlying value must equal `OBSERVABILITY_DEPLOYMENT_SECRET` in the target environment.
  - Verify events land by checking the `Deployment Timeline` panel in Grafana after each rollout; missing data indicates bad credentials or networking.

1. **Plan:** `terraform -chdir=infra/strapi init` (supply backend config), select the workspace (`dev` or `prod`), then run `terraform -chdir=infra/strapi plan -var-file=env/<env>.tfvars`. Attaching the plan output to the PR keeps reviewers in sync. Always include the `-var-file` flag—without it Terraform will prompt interactively for every required variable (region, subnets, ACM cert, etc.).
2. **Promote image:** Push the new container image to ECR with immutable tag (`strapi:<git-sha>`). Update the corresponding `container_image` in the environment tfvars or promote by retagging (`staging` → `prod`).
3. **Apply dev:** On approval, run `terraform -chdir=infra/strapi apply -var-file=env/dev.tfvars`. Observe ECS service deployment in the console; tasks should pass health check `/api/healthz` within 60 seconds.
4. **Blue/green cutover:** Once dev is healthy, promote the same image/tag to production and run `terraform -chdir=infra/strapi apply -var-file=env/prod.tfvars`. ALB target response time must stay `< 800ms` and target 5xx alarms remain green.
5. **Verification:** Validate Strapi admin login, asset upload to S3, and Next.js revalidation webhook receipts. Monitor CloudWatch alarms `strapi-<env>-target-response-latency` and `strapi-<env>-target-5xx` plus ECS service events.
6. **Rollback:** If deployment fails, update the `container_image` var to the previous digest and re-run `terraform apply`. The ECS service will drain unhealthy tasks and restore the last known good revision. Restore secrets or configuration by rotating the underlying Secrets Manager entries if drift is detected.

Incident alerts for Strapi route to the `clarivum-oncall` SNS topic; acknowledge in `#clarivum-oncall` and follow the Sisu Debugging protocol.

### Strapi data foundation (TSK-PLAT-021)

Use this procedure when modifying Strapi database or media storage infrastructure. All changes live in `infra/strapi/main.tf`; never hand-create RDS instances or buckets.

#### AWS S3 bucket responsibilities
- `clarivum-strapi-<env>-media-public` — Hosts editorial and marketing assets (images, hero media) published through Strapi. Objects remain private at rest (SSE-KMS) and are surfaced to end users via the CDN/Next.js image proxy; never expose raw bucket URLs.
- `clarivum-strapi-<env>-media-private` — Stores mission evidence uploads, watermarked ebook deliverables, and other gated assets. Access always flows through signed URLs issued by Strapi plugins or Next.js API routes so entitlement checks remain server-side.
- `clarivum-tf-state-<account>` + DynamoDB table `clarivum-tf-locks` — Provide Terraform remote state and state locking for all infrastructure applies. Do not repurpose these buckets for application data.
- Optional ALB access-log bucket — When compliance requires (`access_logs_bucket` variable), the Strapi ALB publishes request logs to the designated bucket prefix for retention analysis.
   - Ops Hub backup job (`npm run ops:audit:backup`) writes monthly snapshots of the Aurora `ops_audit` schema to the compliance archive bucket. Coordinate rotations with the Ops Hub runbook so IAM access and retention windows stay documented.
   - **Why keep Strapi media on AWS** — Strapi, Terraform, and the associated IAM/KMS policies all execute inside AWS. Parking media/state in native S3 keeps latency low, lets us enforce bucket policy/lifecycle controls through infrastructure-as-code, and avoids coupling Strapi deployments to third-party storage limits. Application-facing assets also live in S3 with access governed by Postgres entitlements.

1. **Plan the change:**
   - Update Terraform variables as needed (`db_*` settings or `database_subnet_ids`).
   - Run `terraform -chdir=infra/strapi plan -var-file=env/<env>.tfvars`. Confirm the plan shows intended updates to:
     - `aws_db_instance.strapi`
     - `aws_db_subnet_group.strapi`
     - `aws_s3_bucket.media_public` / `aws_s3_bucket.media_private`
     - Secrets `clarivum/strapi/<env>/database-*`
2. **Apply dev:** `terraform -chdir=infra/strapi apply -var-file=env/dev.tfvars`.
   - Verify the dev database status is `available`, multi-AZ is `yes`, and Enhanced Monitoring reports within CloudWatch (`CWAgent` namespace).
   - Upload a media asset via Strapi; confirm it lands in `clarivum-strapi-dev-media-public` and the object is encrypted with SSE-KMS (`aws/s3` key).
3. **Run restore drill (quarterly or after significant change):**
   - Create a snapshot (`aws rds create-db-snapshot --db-instance-identifier strapi-dev-db`).
   - Restore to temp instance (`terraform apply` will not manage the temp restore; use CLI) and run smoke queries from Bastion.
   - Document results in the incident runbook (see “Strapi PITR drill” section) and update the drill date in `infra/strapi/AGENTS.md`.
4. **Promote to prod:** After dev validation, repeat `terraform apply` with `env/prod.tfvars`.
   - Ensure production S3 buckets `clarivum-strapi-prod-media-public` and `clarivum-strapi-prod-media-private` continue to deny non-TLS traffic and that lifecycle rules keep versioned objects (`Transition → INTELLIGENT_TIERING after 180 days`).
   - Confirm Secrets Manager entries `clarivum/strapi/prod/database-password` and `clarivum/strapi/prod/database-url` rotate as part of the apply.
5. **Post-change checklist:**
   - Update the release ticket with snapshot ID used for validation.
   - Record any follow-up tasks (cost review, cross-region copy, data masking) in `tasks/backlog/platform`.

Rollback: restore from the most recent automated snapshot (`terraform apply` with reverted changes) or run `aws rds restore-db-instance-to-point-in-time` using the last known timestamp, then re-point Secrets Manager (`database-url`) to the restored endpoint before switching traffic.

## Rollback procedure

1. Trigger the `Rollback Production` workflow with the last known good deployment ID.
2. Workflow steps:
   - Revert database migrations using Aurora PITR to the pre-deploy timestamp (document exact time).
   - Redeploy the previous ECS task definition / container image.
   - Disable any new Flagsmith flags introduced in the failed release.
3. Announce rollback in `#clarivum-oncall`; start an incident postmortem if error budget impact > 10%.

## Change freeze policy

- If monthly error budget burn > 75%, freeze feature deployments until a recovery plan is signed off.
- Only P0 security fixes and reliability remediations may ship during a freeze; follow approval path documented above.

Keep this runbook updated as pipeline tooling evolves. Changes to the process require approval from the engineering lead and product owner.
