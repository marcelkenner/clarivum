# docs/observability · AGENTS Guide

Stores exported Grafana dashboards, alert rules, and any supporting docs for the telemetry stack (ADR-004).

## Expectations

- Keep JSON/YAML artifacts self-contained. Each dashboard should describe its datasource aliases (`clarivum-prometheus`, `clarivum-tempo`, etc.) and any templating variables.
- When you change metric/label names, update both the code and these artifacts in the same PR. Reference the owning task/ADR in the file header.
- Record import instructions (folder, labels, contact points) inside the file via comments or top-level description blocks so on-call engineers can sync Grafana quickly.
- Mirror changes in `docs/runbooks/observability-operations.md`—mention new panels, alerts, or contact routes.

## Workflow

1. Edit dashboards/alerts in Grafana Cloud.
2. Export JSON/YAML and drop them here (`dashboards/`, `alerts/`).
3. Run `npm run lint:docs` to ensure links stay valid.
4. Note the import steps + owner inside the file or PR description.

Always resolve Grafana/OTel questions via Context7 before adopting new plugins or datasources.
