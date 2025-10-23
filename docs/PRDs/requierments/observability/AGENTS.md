# docs/PRDs/requierments/observability · AGENTS Guide

## Scope
- Details the OpenTelemetry + Grafana observability stack covering traces, logs, metrics, dashboards, and alerts.
- Aligns telemetry requirements with product funnels, error budgets, and incident response expectations.

## Must Read
- `feature-requirements.md`, `docs/policies/error-budget-policy.md`, `docs/runbooks/incident-response.md`, `docs/runbooks/observability-operations.md`, and analytics PRD for shared KPIs.
- Reference OpenTelemetry and Grafana docs via Context7 before proposing instrumentation or exporter changes.

## Execution Guardrails
- Follow naming conventions for spans, metrics, and labels; document changes to avoid dashboard drift.
- Balance sampling and retention targets with budget—note trade-offs and seek approval when deviating.
- Ensure alerting routes (PagerDuty, Slack) match on-call schedules and include runbook links.
- Scrub PII before export; capture compliance considerations (data residency, retention) in requirements.

## Handoff Checklist
- Validate dashboards and alert policies in dev/preview environments; attach screenshots or links.
- Update runbooks and ownership tables when telemetry coverage changes.
- Notify dependent feature owners when observability requirements add instrumentation work to their backlog.
