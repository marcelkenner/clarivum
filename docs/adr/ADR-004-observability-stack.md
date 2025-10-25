# ADR-004: Observability Stack & Telemetry Standard
Date: 2025-10-21
Status: Accepted

## Context
- PTRD Section 9 mandates OpenTelemetry from day one, with SLO dashboards and golden signal alerting.
- We have distributed workloads (Vercel functions + AWS Lambda) that need consistent tracing, metrics, and logs.
- The team lacks the bandwidth to self-host a full observability stack but requires long-term retention for audits and performance tuning.
- Detailed telemetry requirements live in `docs/PRDs/requierments/observability/feature-requirements.md`.

## Decision
- Standardize on **OpenTelemetry SDKs** across the Next.js application, Lambda workers, and any future services.
  - Use the OTel JS SDK with auto-instrumentation for HTTP and database calls; extend with manual spans for business-critical flows (lead capture, checkout, membership upgrades).
  - Define resource attributes: `service.name`, `deployment.environment`, `clarivum.vertical` when applicable.
- Send traces, metrics, and logs to **Grafana Cloud**:
  - Traces → Tempo, Metrics → Prometheus, Logs → Loki.
- Provision separate tenants per environment (`preview`, `dev`, `prod`) with cross-environment dashboards.
- Configure **Grafana Alerting** to back SLO error budgets:
  - Alerts route to PagerDuty (`clarivum-oncall`) and Slack (`#clarivum-alerts`).
  - Alert thresholds tie back to the error budget policy (50/75/100% burn).
- Instrument front-end Real User Monitoring (RUM) via Vercel Analytics + custom OTel Web SDK to capture Core Web Vitals segmented by vertical.

## Implementation Notes (2025-10-26)

- The Next.js runtime entrypoints `instrumentation.ts` and `instrumentation.node.ts` delegate to `observability/node-sdk.ts`, which bootstraps a single `NodeSDK` instance with OTLP exporters for traces, metrics, and logs. Services must extend these helpers instead of instantiating their own SDKs to keep resource attributes (`service.name`, `deployment.environment`, `clarivum.vertical`, `clarivum.surface`) consistent.
- `observability/config.ts` centralizes every telemetry environment variable (Grafana OTLP endpoints, sampler ratios, export intervals, credentials). Any new knob belongs here so we can document it once and fan it out to the server, workers, and proxy layers.
- Browser/RUM coverage is handled by `instrumentation.client.ts`, which wires `DocumentLoadInstrumentation` and `FetchInstrumentation` into a `WebTracerProvider`. Spans are exported to `/api/observability/v1/traces`, a server-side proxy that enriches headers and forwards payloads to Grafana Tempo without exposing credentials.
- Required environment variables: `GRAFANA_OTLP_USERNAME` + `GRAFANA_OTLP_PASSWORD` (or `GRAFANA_OTLP_BASIC_AUTH`), `OTEL_EXPORTER_OTLP_ENDPOINT` (overridable per signal), `OTEL_TRACE_RATIO`, `OTEL_METRIC_EXPORT_INTERVAL`, `NEXT_PUBLIC_OTEL_SERVICE_NAME`, and `NEXT_PUBLIC_OTEL_PROXY_URL`. These defaults live in `observability/config.ts` and must be overridden per environment during deployment.
- Background workers (Lambda, queue consumers) share the same helpers—wrapping handlers with the `withTelemetry` template ensures span context, log correlation, and queue-depth metrics flow into Grafana with identical labels.

## Diagrams
- [Architecture Overview](../diagrams/adr-004-observability-stack/architecture-overview.mmd) — Unified telemetry pipeline feeding Grafana Cloud Tempo, Prometheus, and Loki.
- [Data Lineage](../diagrams/adr-004-observability-stack/data-lineage.mmd) — Structure of spans, metrics, and log events with cross-correlation points.
- [UML Instrumentation](../diagrams/adr-004-observability-stack/uml-instrumentation.mmd) — Components initializing SDKs and handling exporter lifecycles.
- [BPMN Alerting Flow](../diagrams/adr-004-observability-stack/bpmn-alerting.mmd) — Error budget breach response from detection to review.

## Consequences
- **Pros:** Unified telemetry pipeline, vendor-managed availability, mature visualization and alerting, and adherence to OTel standards enabling future portability.
- **Cons:** Ongoing SaaS fees and potential vendor lock-in. Mitigation: keep exporters configurable; if costs rise, we can redirect exporters to self-hosted Tempo/Prometheus/Loki with minimal code changes.
- **Operational notes:** Ensure sensitive data is scrubbed before export (PII obfuscation middleware). Storage retention defaults to 30 days for logs and 13 months for metrics; adjust based on compliance needs.
- **Follow-ups:**
  - Document span naming conventions and sampling policies in `/docs/observability-playbook.md` (future work).
  - Implement synthetic monitoring (Checkly or Grafana Synthetic Monitoring) for key journeys before launch.
