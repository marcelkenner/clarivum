# src/app/api/observability/v1/deployments · AGENTS Guide

Receives deployment lifecycle events from CI/CD workflows and forwards them to the shared observability stack via OpenTelemetry.

- Authenticate every request with the `Authorization: Bearer <token>` header. The token lives in `OBSERVABILITY_DEPLOYMENT_SECRET` (Next.js server environment only).
- Payloads must include `service`, `environment`, and `status` strings; optional fields (version, digest, image, workflowUrl, metadata) enrich the emitted span attributes.
- The handler emits an OpenTelemetry span (`observability.deployment.webhook`) using the global Node SDK. Do not instantiate new SDKs or exporters here—extend `observability/config.ts` if additional attributes are required.
- Update `docs/runbooks/deployment.md` and `docs/runbooks/observability-operations.md` whenever the contract or emitted attributes change so on-call engineers can trace deployment activity.
