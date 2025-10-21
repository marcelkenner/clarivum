# ADR-004: Observability Stack & Telemetry Standard
Date: 2025-10-21
Status: Accepted

## Context
- PTRD Section 9 mandates OpenTelemetry from day one, with SLO dashboards and golden signal alerting.
- We have distributed workloads (Vercel functions + AWS Lambda) that need consistent tracing, metrics, and logs.
- The team lacks the bandwidth to self-host a full observability stack but requires long-term retention for audits and performance tuning.

## Decision
- Standardize on **OpenTelemetry SDKs** across the Next.js application, Lambda workers, and any future services.
  - Use the OTel JS SDK with auto-instrumentation for HTTP and database calls; extend with manual spans for business-critical flows (lead capture, checkout, membership upgrades).
  - Define resource attributes: `service.name`, `deployment.environment`, `clarivum.vertical` when applicable.
- Send traces, metrics, and logs to **Grafana Cloud**:
  - Traces → Tempo, Metrics → Prometheus, Logs → Loki.
  - Provision separate tenants per environment (`preview`, `staging`, `production`) with cross-environment dashboards.
- Configure **Grafana Alerting** to back SLO error budgets:
  - Alerts route to PagerDuty (`clarivum-oncall`) and Slack (`#clarivum-alerts`).
  - Alert thresholds tie back to the error budget policy (50/75/100% burn).
- Instrument front-end Real User Monitoring (RUM) via Vercel Analytics + custom OTel Web SDK to capture Core Web Vitals segmented by vertical.

## Consequences
- **Pros:** Unified telemetry pipeline, vendor-managed availability, mature visualization and alerting, and adherence to OTel standards enabling future portability.
- **Cons:** Ongoing SaaS fees and potential vendor lock-in. Mitigation: keep exporters configurable; if costs rise, we can redirect exporters to self-hosted Tempo/Prometheus/Loki with minimal code changes.
- **Operational notes:** Ensure sensitive data is scrubbed before export (PII obfuscation middleware). Storage retention defaults to 30 days for logs and 13 months for metrics; adjust based on compliance needs.
- **Follow-ups:**
  - Document span naming conventions and sampling policies in `/docs/observability-playbook.md` (future work).
  - Implement synthetic monitoring (Checkly or Grafana Synthetic Monitoring) for key journeys before launch.
