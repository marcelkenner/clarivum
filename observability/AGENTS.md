# observability · AGENTS Guide

Owns the reusable OpenTelemetry helpers that power the Next.js instrumentation entrypoints (`instrumentation.ts`, `instrumentation.node.ts`, `instrumentation.client.ts`) and any background workers. Changes here propagate to every service, so follow the guardrails below.

## Guardrails

- `observability/config.ts` is the authoritative source for OTLP endpoints, credentials, sampling, and resource attributes. Add new knobs there and document them in `docs/runbooks/observability-operations.md` + `docs/adr/ADR-004-observability-stack.md`.
- `observability/node-sdk.ts` must remain the only place we instantiate `NodeSDK`. Feature code should request telemetry via helpers (e.g., `ensureNodeSDK`, worker wrappers). Do not import `@opentelemetry/*` directly in routes or handlers.
- All browser instrumentation flows through `instrumentation.client.ts` and the `/api/observability/v1/traces` proxy. Keep secrets server-side; never emit Grafana credentials to the client bundle.
- Resolve library questions (OTLP exporters, instrumentations, context managers) via Context7 (`/opentelemetry/docs/js`, `/grafana/docs`) before upgrading dependencies.

## Common workflows

1. **Tuning exporters:** Update `readTelemetryConfig()` with the new endpoint or auth token, add validation if the variable is required, and mirror the change in the runbook + ADR. When basic auth is needed, rely on the helper’s `basicAuthToken` builder instead of re-encoding credentials elsewhere.
2. **Adjusting sampling:** Change `OTEL_TRACE_RATIO` defaults inside `config.ts`, note the expected environment-specific overrides, and coordinate with Platform before merging. Verify that `observability/node-sdk.ts` and the client instrumentation both pick up the same ratio.
3. **Adding instrumentations:** Extend `ensureNodeSDK` using `getNodeAutoInstrumentations` options or targeted packages. For client-side additions, register them in `instrumentation.client.ts` to keep bundle impact explicit.
4. **Proxy updates:** If `/api/observability/v1/traces` behavior changes (headers, rate limiting), update `instrumentation.client.ts` and document the behavior in `docs/runbooks/observability-operations.md`.

## Verification

- Run `npm run validate` after modifying this directory; it type-checks the helpers and ensures lint rules (no extraneous deps) still pass.
- Smoke-test locally with `npm run dev` and confirm the console logs show `[otel] NodeSDK started` once per process. Use Grafana Tempo’s live view to ensure traces export successfully end-to-end.
- Before merging, add or update a doc/runbook/ADR reference per TSK-PLAT-003 acceptance so on-call engineers can reproduce the configuration.
