# Observability Operations Runbook

> Aligns with `docs/adr/ADR-004-observability-stack.md` and `docs/PRDs/requierments/observability/feature-requirements.md`.

## Purpose
- Maintain healthy telemetry pipelines (traces, metrics, logs) for Clarivum services.
- Provide on-call responders with playbooks for alert triage, sampling adjustments, and dashboard upkeep.

## Scope
- Next.js app, background workers, Strapi webhooks, and mission services instrumented with OpenTelemetry.
- Grafana Cloud tenants (preview, dev, prod) including Tempo, Prometheus, Loki, and Synthetic Monitoring.

## Preconditions
- OpenTelemetry config package published (`packages/ot-sdk`).
- Grafana API keys stored in Secrets Manager per environment.
- PagerDuty service `clarivum-oncall` connected to Grafana alerting.
- Dashboards tagged `core-kpis`, `checkout`, `missions`, `feature-flags`.

## Tooling & References
- Grafana Cloud UI (`https://clarivum.grafana.net`).
- PagerDuty (`https://clarivum.pagerduty.com`) — alert acknowledgements.
- Synthetic monitoring probes configured in Grafana SM.
- `npm run telemetry:lint` — verifies instrumentation conventions.
- Loki search helpers: `service_name`, `deployment_environment`, `clarivum_vertical`.
- Next.js OTLP proxy: `POST /api/observability/v1/traces` forwards browser spans to Grafana with secrets stored server-side.
- Lambda worker template: `backend/workers/otel-lambda-template.ts` shows the canonical span/metric/log helpers for queue consumers.

## Daily Operational Checklist
- [ ] Review Grafana alert summary for overnight incidents; ensure acknowledgements closed.
- [ ] Scan `Telemetry Export Errors` dashboard for exporter failures >0.5%.
- [ ] Validate synthetic checks (checkout, mission unlock) status green.
- [ ] Confirm sampling rate logs (OTEL SAMPLING) within target (prod 20% traces).
- [ ] Post daily status in `#clarivum-observability` if anomalies detected.

## Alert Handling Playbook
1. **Acknowledge** PagerDuty alert within 5 minutes.
2. **Identify** service and environment via alert labels (`service.name`, `deployment.environment`).
3. **Inspect**:
   - Traces: Tempo search with incident correlation ID.
   - Metrics: relevant dashboard panel (latency/error rates).
   - Logs: Loki query `service_name="<service>" | pattern`.
4. **Diagnose** root cause; if due to dependency outage, coordinate with respective runbook (e.g., payments).
5. **Mitigate** via rollout revert, feature flag fallback, or scaling adjustment.
6. **Communicate** status and ETA in `#clarivum-alerts`; update incident timeline.
7. **Resolve** alert and verify metrics return to baseline.
8. **Document** follow-up actions in incident review template; link dashboards for context.

## Sampling & Retention Adjustments
- Default sampling: preview 100%, dev 50%, prod 20%.
- To increase sampling:
  1. Update environment variable `OTEL_TRACE_RATIO`.
  2. Redeploy affected service.
  3. Monitor exporter CPU/memory 15 minutes to ensure <5% overhead.
- Retention changes require Grafana admin approval; open ops request with rationale (compliance, incident investigation).

## Dashboard Lifecycle
- Each dashboard has named owner; update `Dashboard Ownership` sheet after changes.
- When new feature launches (e.g., mission coupons), add panels for latency, success rate, error volumes.
- Validate queries in preview environment before promoting to prod.
- Archive unused dashboards quarterly; export JSON backup to `docs/observability/dashboards`.

## Telemetry Pipeline Incidents
### Exporter Failure
- Symptom: spikes in `otel_exporter_failure_total`.
- Steps:
  1. Check networking (Secrets Manager credentials, endpoint availability).
  2. Retry exporter process or redeploy service.
  3. If Grafana outage, switch to local backup endpoint (secondary OTLP URL).
  4. Backfill missing metrics by re-running job or reconstructing from logs if needed.

### Synthetic Check Failure
- Confirm target endpoint availability manually (`curl` from runner).
- If application issue, follow respective feature runbook.
- If monitor misconfigured, update probe payload and redeploy synthetic check.

## Compliance & Security
- Ensure PII scrubbing middleware active; audit monthly.
- Rotate Grafana API keys every 90 days; record in Secrets rotation log.
- Store incident timelines for 12 months in compliance archive.

## Baseline Instrumentation (2025-10-25)
- Next.js automatically loads `instrumentation.ts`/`instrumentation.node.ts` to start the shared OpenTelemetry `NodeSDK`, emit resource attributes (service name, deployment environment, clarivum.vertical), and export traces/metrics/logs to Grafana Tempo/Prometheus/Loki via OTLP HTTP.
- Browser traces are collected via `instrumentation.client.ts` (DocumentLoad + Fetch instrumentation) and relayed through `/api/observability/v1/traces`, so Grafana credentials never reach the client.
- AWS Lambda + background workers must wrap handlers with `withTelemetry` from `backend/workers/otel-lambda-template.ts` to ensure queue depth metrics and span context are emitted consistently.
- Environment variables: `GRAFANA_OTLP_USERNAME`, `GRAFANA_OTLP_PASSWORD`, `OTEL_TRACE_RATIO`, `OTEL_EXPORTER_OTLP_ENDPOINT`, and `NEXT_PUBLIC_OTEL_PROXY_URL` must be set per environment; see `docs/observability/dashboards/baseline.json` for expected labels.

## Knowledge Share
- Session: **2025-10-28 09:00 EET** (`Clarivum Observability Baseline Walkthrough`) — platform + frontend teams; recording stored in `knowledge/2025-10-28-otel-baseline.mp4`.
- Agenda: demo new dashboards, review PagerDuty alert wiring (`docs/observability/alerts/baseline.yaml`), walkthrough lambda template adoption plan, assign owners for manual span coverage.

## Escalation Matrix
- Level 1: On-call SRE / Observability Champion.
- Level 2: Platform lead (infrastructure decisions, sampling changes).
- Level 3: CTO for vendor escalations or prolonged outages.
- Notify product owner if alert impacts active campaign or KPI dashboards.

## Maintenance
- Quarterly review to align with ADR updates or new telemetry sources.
- Update cross-links when dashboards or services renamed.
- Log runbook revisions in changelog section below.

## Changelog
- 2025-10-26 — Initial publication aligned with mission coupon launch.
