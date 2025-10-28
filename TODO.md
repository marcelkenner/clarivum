# Clarivum TODOs

Centralized follow-up list for sprint guardrails and CI hygiene. Keep items concise and reference the source context so owners can respond quickly.

## Immediate Actions

1. **Branch protection:** Require the GitHub Actions check named `Validate, test, and smoke` on `main` so lint/typecheck/unit/smoke gates are enforced. (Source: TSK-PLAT-044 DoD)
2. **Slack webhook:** Populate/verify the `SLACK_WEBHOOK_CI` repository secret pointing to `#clarivum-platform` so Playwright failures alert the right channel. Document rotations in the deployment runbook. (Source: docs/runbooks/testing-stack.md)
3. **Task lint after tool install:** Once Node/npm are available in the local environment, run `npm run lint:tasks` (and ideally `npm run validate`) to confirm the board/documentation updates pass automation. (Source: follow-up from CI change)
4. **Metrics ingestion:** Extend the existing metrics job to read the new `ci-metrics.json` artifact and append duration/pass-fail data into `metrics/quality.json`. (Source: docs/QA/testing-strategy.md §Metrics & Reporting)
5. **Mission worker implementation:** Replace the placeholder in `backend/workers/otel-lambda-template.ts` (`// TODO: invoke mission business logic here`) with the actual mission event handler so the telemetry wrapper exercises real work. Link to the owning TSK/ADR when you wire it up.
6. **Environment secrets:** Populate the Grafana OTLP credentials and `NEXT_PUBLIC_OTEL_PROXY_URL` in each Vercel/Lambda environment so the new exporters can emit telemetry. Track completion per environment in `docs/runbooks/observability-operations.md`.
7. **Grafana assets:** Import `docs/observability/dashboards/baseline.json` and `docs/observability/alerts/baseline.yaml` into Grafana Cloud, wiring them to PagerDuty (`clarivum-oncall`) and `#clarivum-alerts`, then link the panels in the runbook.
8. **Manual spans & synthetic follow-up:** Coordinate with feature owners to add manual spans for the critical flows noted in TSK-PLAT-003 notes and open/track the synthetic monitoring guardrail task once owners are assigned.
9. **Flagsmith automation secrets:** Add the `FLAGSMITH_PROJECT_ID`, `FLAGSMITH_API_TOKEN`, and optional `FLAGSMITH_PROJECT_DASHBOARD_URL` repo secrets/variables so `.github/workflows/flags-stale.yml` can run. Reuse/verify `SLACK_WEBHOOK_CI` for the workflow step. (Source: TSK-PLAT-002 rollout)
10. **Workflow smoke test:** After wiring the secrets, trigger the “Flagsmith Stale Flag Audit” workflow via the Actions tab (`workflow_dispatch`) to confirm Slack + GitHub issue outputs before relying on the Monday schedule. (Source: TSK-PLAT-002 DoD)
11. **Homepage rebuild brief:** Replace the placeholder in `src/app/page.tsx` with the next Clarivum homepage once product finalizes copy/structure. Capture the new scope in `docs/PRDs/requierments/ascii_designs/home.md` and list guardrails/tests to restore.
12. **CMS feed readiness check:** Prep Strapi collections for hero wizard, plan summaries, and learning slots before the rebuild so marketing can adjust copy without redeploying. Note the mapping in the same PRD when finalized.
13. **Learning slot instrumentation plan:** Decide how `/library` entries will surface on the rebuilt homepage and queue the analytics/guardrail updates alongside the implementation.

## Nice-to-haves

- Add a short README section describing how `TODO.md` is maintained (e.g., link from `tasks/AGENTS.md`) if this list becomes long-term.
- Consider automating TODO capture via `npm run tasks:summary` so sprint health stays transparent.
