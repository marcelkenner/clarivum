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

## Nice-to-haves

- Add a short README section describing how `TODO.md` is maintained (e.g., link from `tasks/AGENTS.md`) if this list becomes long-term.
- Consider automating TODO capture via `npm run tasks:summary` so sprint health stays transparent.
