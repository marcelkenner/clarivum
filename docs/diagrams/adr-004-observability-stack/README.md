# Observability Stack & Telemetry Standard Diagrams
- **ADR:** `docs/adr/ADR-004-observability-stack.md`
- **Last updated:** 2025-10-23
- **Owners:** Reliability Engineering

## Overview
These diagrams summarize the OpenTelemetry-based observability pipeline that feeds Grafana Cloud. They cover exporters, data schemas for traces/metrics/logs, the instrumentation classes teams depend on, and the alerting workflow tied to Clarivum’s error budget policy.

## Files
- `architecture-overview.mmd` — Telemetry ingestion path from applications to Grafana Cloud.
- `data-lineage.mmd` — Trace, metric, and log records with retention metadata.
- `uml-instrumentation.mmd` — Instrumentation components and exporters used by the platform.
- `bpmn-alerting.mmd` — Alert evaluation and incident response flow.
