# backend/workers · AGENTS Guide

Instrumented Lambda/SQS workers live here. Every handler should start from `otel-lambda-template.ts` so tracing/metrics/logging stay consistent with ADR-004 and the Grafana dashboards under `docs/observability/`.

## Workflow

1. Copy `otel-lambda-template.ts`, rename the file to match your worker, and replace the `// TODO` section with the real business logic.
2. Keep the `withTelemetry` wrapper: it emits spans, records queue depth metrics, and pushes structured logs with trace context. Only add new meters/histograms if dashboards require them; otherwise reuse the provided instruments.
3. Declare payload schemas (Zod) either next to the handler or under `backend/lib/`. Validate before touching downstream services.
4. Export a single `handler` compatible with AWS Lambda (`(event: SQSEvent, context: Context) => Promise<void>`). Ensure idempotency and set `visibilityTimeout`/`batchSize` via IaC.
5. Update `docs/runbooks/observability-operations.md` and the owning task when you change metric names or attributes so dashboards stay accurate.

## Commands

- `npm run lint:code` – verifies imports, telemetry helpers, and structure.
- `npm run typecheck` – ensures the handler satisfies the Lambda types and env augmentations in `types/process-env.d.ts`.
- `npm run test` – add Vitest coverage for your worker logic (mock the telemetry helpers).

## Review checklist

- [ ] Handler created from the latest template and still wraps logic with `withTelemetry`.
- [ ] Payload schema validated before side effects; idempotency enforced.
- [ ] Structured logs only contain identifiers (no secrets/PII).
- [ ] Relevant docs/runbooks/tasks updated with new queue names, metrics, or alert expectations.
