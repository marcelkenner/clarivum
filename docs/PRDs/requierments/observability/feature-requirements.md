# Feature Requirements — Observability Stack (OpenTelemetry + Grafana OSS)

> **Canonical decision:** `docs/adr/ADR-004-observability-stack.md` defines the observability platform and integrations.

## Objective
- Instrument Clarivum services with OpenTelemetry and route telemetry to the Grafana observability stack (Tempo, Loki, Prometheus) to monitor user journeys, infrastructure, and business SLOs.
- Provide actionable dashboards and alerts tied to error budget policy and compliance needs.

## Target Outcomes
- Business: detect funnel degradation within minutes and prevent unnoticed revenue-impacting issues.
- Experience: ensure on-call responders receive high-signal alerts with contextual traces and logs, reducing MTTR below 30 minutes.

## Primary Users & Segments
- Internal: engineering, SRE/on-call, product analysts monitoring performance.
- Segmentation: environments (preview, staging, production), vertical tags (`skin`, `fuel`, `habits`), user roles (anonymous vs authenticated).

## Experience Principles
- Follow consistent span naming and attribute conventions so dashboards stay legible.
- Avoid alert fatigue: tie alerts to SLO burn rates and user-impact thresholds.
- Keep instrumentations lightweight; defer exporting heavy payloads to background tasks when possible.

## Functional Requirements
- FR1 — Integrate OpenTelemetry SDK in Next.js (server and client), background jobs, and future services with shared config package.
- FR2 — Export traces to Grafana Tempo, metrics to Prometheus, logs to Loki via OTLP/HTTP with batching and retry policies.
- FR3 — Define baseline dashboards: Core Web Vitals, checkout funnel, subscription lifecycle, API latency/error rates, feature flag evaluation health.
- FR4 — Implement alerting for SLO breaches, elevated error rates, auth failures, and data pipeline gaps, routed to PagerDuty and Slack.
- FR5 — Provide synthetic monitoring coverage (Grafana Synthetic Monitoring or Checkly) for hero funnels (home → ebook checkout, diagnostic completion).
- FR6 — Sanitize sensitive data before exporting (PII scrubbing middleware).
- FR7 — Document tracing instrumentation patterns for custom business events (diagnostic outcomes, coupon redemptions).

## Content & Data Inputs
- Span attributes referencing user/session IDs (hashed), vertical, feature flag states, experiment variants.
- Metrics derived from Next.js runtime (requests, cache hits), Supabase (connection counts), and Flagsmith (latency).
- Log enrichment fields for correlation IDs and request context.

## Integrations & Dependencies
- Internal: frontend platform, Supabase, Flagsmith, PostHog ingestion, CI/CD for deploying collectors.
- External: Grafana Cloud tenants (per environment) or self-hosted stack, PagerDuty for incidents.

## Analytics & KPIs
- Observability KPIs: MTTR, alert acknowledgement time, dashboard adoption, sampling rate adherence, and logging cost per GB.
- Track instrumentation coverage (% endpoints traced) and error budget consumption per service.

## Non-Functional Requirements
- Ensure exporter overhead <5% CPU/memory on serverless functions; sample accordingly.
- Retain traces for minimum 30 days, logs for 14 days (extend for compliance as needed).
- Collectors must handle bursts without dropping >1% of telemetry.

## Compliance & Access Control
- Enforce least privilege on Grafana roles (view vs edit vs admin).
- Store incident timelines and alert history for 12 months.
- Ensure telemetry data residency aligns with EU hosting requirements.

## Launch Readiness Checklist
- OpenTelemetry instrumentation merged with default config for all routes.
- Dashboards for core KPIs published and shared with stakeholders.
- Alert routing tested (PagerDuty + Slack) with mock incidents.
- Runbook updated covering sampling strategies, dashboard ownership, and escalation paths.

## Open Questions & Assumptions
- Evaluate need for distributed tracing on edge functions (pending usage).
- Decide whether to self-host collectors or rely on Grafana Cloud agents.
- Assume PostHog ingestion will provide complementary product analytics; ensure no duplicate instrumentation.
