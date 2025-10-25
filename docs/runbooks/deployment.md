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
