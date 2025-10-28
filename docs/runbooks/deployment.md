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
   - The job does not build production artifacts; Vercel handles build/promote after CI passes.
2. On success, artifacts are promoted to **Vercel preview** and integration smoke tests run against the preview URL.
3. On manual approval (release captain), the pipeline promotes the build to the persistent **dev** environment:
   - Run database migrations via Supabase CLI.
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
     - `supabase db push` to apply migrations.
     - Vercel production deployment.
     - Lambda job package deployment via Terraform Cloud run.
3. **Post-deploy verification (within 15 minutes):**
   - Validate core journeys (home → vertical start → CTA) using scripted Playwright smoke.
   - Confirm no new alerts in Grafana; check error rate < 0.5% and p95 latency within budget.
   - Update release ticket with verification results.

### Strapi ECS deploys (TSK-PLAT-020)

Strapi infrastructure lives in Terraform under `infra/strapi`. Follow this sequence whenever updating container images, scaling policies, or infrastructure modules:

#### GitHub Actions pipeline (TSK-PLAT-022)

- Workflow: `.github/workflows/strapi-ci-cd.yml`
  - **PRs (`cms/**`, `infra/strapi/**`)** – run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` inside `cms/`.
  - **Push to `main`** – build `cms/Dockerfile`, push the image to ECR (`${STRAPI_ECR_REGISTRY}/${STRAPI_ECR_REPOSITORY}:${GITHUB_SHA::12}`), retag `:dev`, run optional migrations, update the dev ECS service, wait for stability, and invoke the configured health check + revalidation webhook.
  - **Manual deploy (`workflow_dispatch`)** – supply:
    - `environment` (`dev` | `prod`)
    - `image_tag` (immutable tag/sha to promote)
    - `run_migrations` (default `true`)
    - `promote_only` (`true` skips ECS rollout; retags image alias only)
    - Workflow assumes `AWS_STRAPI_DEPLOY_ROLE_ARN` secret (OIDC) and repository variables `STRAPI_AWS_REGION`, `STRAPI_ECR_REGISTRY`, `STRAPI_ECR_REPOSITORY`.
- **Quality guardrails:** The freshly scaffolded Strapi workspace provides placeholder `npm run lint` and `npm test` commands (simple pass-through scripts) to satisfy automation while real linters/tests are wired. Replace them with ESLint/Vitest (or equivalent) suites as content logic lands.
- GitHub environments:
  - `strapi-dev` / `strapi-prod` **variables**: `STRAPI_CLUSTER_ARN`, `STRAPI_SERVICE_NAME`, optional `STRAPI_HEALTHCHECK_URL`, `STRAPI_REVALIDATE_URL`, `STRAPI_MIGRATION_COMMAND`.
  - `strapi-dev` / `strapi-prod` **secrets**: `STRAPI_REVALIDATE_SECRET` (bearer token), optional `STRAPI_MIGRATION_COMMAND` if it relies on sensitive values.
- Repository variables (Settings → Actions → Variables) required by every run:
  - `STRAPI_AWS_REGION`
  - `STRAPI_ECR_REGISTRY`
  - `STRAPI_ECR_REPOSITORY`
- Validation steps after configuring secrets/variables:
  1. Open a PR that touches `cms/**` to observe the quality gate succeed.
  2. Push a commit to `main` (or a protected test branch) to confirm the image build + dev ECS rollout.
  3. Trigger the manual workflow for both `strapi-dev` and `strapi-prod` to verify promotion + health check behaviour.
- Migration hook:
  - Preferred approach is a one-off ECS task (`aws ecs run-task ... --overrides '{"containerOverrides":[{"name":"strapi","command":["npm","run","migrate"]}]}'`) defined in `STRAPI_MIGRATION_COMMAND`. If unset, the workflow falls back to `cms/scripts/predeploy.sh` when present. Keep commands idempotent and add the backout plan to this runbook.
- Health check webhook:
  - `STRAPI_HEALTHCHECK_URL` should point to `https://cms-<env>.<domain>/_health` once ALB DNS is live. The workflow retries 6× (10 s backoff) before failing.
- Frontend revalidation:
  - Set `STRAPI_REVALIDATE_URL` to the internal proxy (e.g., `https://app.<env>.clarivum.com/api/revalidate?scope=strapi`) and `STRAPI_REVALIDATE_SECRET` to the shared bearer token managed alongside other observability secrets.

1. **Plan:** `terraform -chdir=infra/strapi init` (supply backend config), select the workspace (`dev` or `prod`), then run `terraform -chdir=infra/strapi plan -var-file=env/<env>.tfvars`. Attaching the plan output to the PR keeps reviewers in sync. Always include the `-var-file` flag—without it Terraform will prompt interactively for every required variable (region, subnets, ACM cert, etc.).
2. **Promote image:** Push the new container image to ECR with immutable tag (`strapi:<git-sha>`). Update the corresponding `container_image` in the environment tfvars or promote by retagging (`staging` → `prod`).
3. **Apply dev:** On approval, run `terraform -chdir=infra/strapi apply -var-file=env/dev.tfvars`. Observe ECS service deployment in the console; tasks should pass health check `/api/healthz` within 60 seconds.
4. **Blue/green cutover:** Once dev is healthy, promote the same image/tag to production and run `terraform -chdir=infra/strapi apply -var-file=env/prod.tfvars`. ALB target response time must stay `< 800ms` and target 5xx alarms remain green.
5. **Verification:** Validate Strapi admin login, asset upload to S3, and Next.js revalidation webhook receipts. Monitor CloudWatch alarms `strapi-<env>-target-response-latency` and `strapi-<env>-target-5xx` plus ECS service events.
6. **Rollback:** If deployment fails, update the `container_image` var to the previous digest and re-run `terraform apply`. The ECS service will drain unhealthy tasks and restore the last known good revision. Restore secrets or configuration by rotating the underlying Secrets Manager entries if drift is detected.

Incident alerts for Strapi route to the `clarivum-oncall` SNS topic; acknowledge in `#clarivum-oncall` and follow the Sisu Debugging protocol.

### Strapi data foundation (TSK-PLAT-021)

Use this procedure when modifying Strapi database or media storage infrastructure. All changes live in `infra/strapi/main.tf`; never hand-create RDS instances or buckets.

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
   - Revert database migrations using Supabase PITR to the pre-deploy timestamp (document exact time).
   - Redeploy the previous Vercel build.
   - Disable any new Flagsmith flags introduced in the failed release.
3. Announce rollback in `#clarivum-oncall`; start an incident postmortem if error budget impact > 10%.

## Change freeze policy

- If monthly error budget burn > 75%, freeze feature deployments until a recovery plan is signed off.
- Only P0 security fixes and reliability remediations may ship during a freeze; follow approval path documented above.

Keep this runbook updated as pipeline tooling evolves. Changes to the process require approval from the engineering lead and product owner.
