# src/app/api/observability · AGENTS Guide

Contains proxy routes that forward telemetry payloads to Grafana Cloud.

## `/api/observability/v1/traces`

- Accepts OTLP/HTTP requests from the browser instrumentation and relays them to the configured Grafana endpoint.
- Never expose Grafana credentials via the response body or client bundle. Only read credentials from server-side env vars (`GRAFANA_OTLP_*`).
- Keep the handler minimal: validate headers, forward bytes, return 204 on success, bubble up error text if Grafana rejects the payload.
- If you add new proxy routes (metrics/logs), mirror this structure and update `docs/runbooks/observability-operations.md`.

## `/api/observability/v1/deployments`

- Called by CI/CD workflows after Strapi deployments. Authenticate with `Authorization: Bearer <OBSERVABILITY_DEPLOYMENT_SECRET>`.
- Required fields: `service`, `environment`, `status`. Optional metadata (version, digest, image, workflowUrl) is attached as span attributes for Grafana dashboards.
- The handler emits spans via the shared Node SDK—do not bootstrap additional SDK instances or leak Grafana credentials. Update `observability/config.ts` if you introduce new environment toggles.
- Record any contract or attribute changes in `docs/runbooks/deployment.md` and `docs/runbooks/observability-operations.md` so responders can trace deployments.

## Testing & tooling

- Run `npm run lint:code` and `npm run typecheck` after modifying a proxy route.
- Consider adding integration tests that mock `fetch` to assert error handling.

Coordinate changes with the platform team so dashboards and alert rules stay in sync with any new attributes.
