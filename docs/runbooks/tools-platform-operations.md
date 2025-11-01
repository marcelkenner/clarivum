# Tools Platform Operations Runbook

> Covers calculator/service reliability expectations from `docs/PRDs/requierments/tools/*` (e.g., `timer_reaplikacji.md`) and associated ADRs (`ADR-019-frontend-platform.md`, `ADR-006-edge-cache-and-rate-limiting-platform.md`).

## Purpose
- Maintain uptime and performance of Clarivum interactive tools (UV index widget, timer reapplication calculator, etc.).
- Provide response steps for latency regressions, API failures, and feature flag toggles.

## Scope
- Next.js API routes under `/api/tools/*`.
- Edge functions and AWS ElastiCache Serverless for Redis caches for tool computations.
- Client components consuming ViewModels (ToolsViewModel, TimerComputeManager).

## Preconditions
- Feature flags defined for tool rollouts (e.g., `uv-widget-enabled`, `timer-localization-enabled`).
- Synthetic probes hitting critical endpoints every minute.
- Observability dashboards (`Tools Platform / Latency`, `Tools Platform / Errors`) active.
- Rate limiting configured via ElastiCache-backed token bucket (120 req/min/IP baseline) as defined in ADR-006.

## Tooling & References
- Plausible dashboards for engagement and error funnel tracking (per ADR-029).
- Synthetic probes configured via CloudWatch Synthetics or UptimeRobot (document probe URLs in Ops Hub).
- `npm run tools:smoke` — executes regression test suite.
- `redis-cli` tunneled via AWS Systems Manager or EC2 for direct ElastiCache inspection (`UV_WIDGET_CACHE_ENDPOINT` with TLS).
- Slack `#clarivum-tools` channel for coordination.

## Operational Checklist
### Daily
- Review Grafana latency panel (p50/p95) for each tool; investigate spikes.
- Check synthetic probes success rate (target 100%).
- Verify error logs (`service_name="tools-api"`) for increased validation failures.

### Weekly
- Run `npm run tools:smoke` against preview environment.
- Review cache hit rate >80%; if lower, inspect key strategy.
- Validate feature flags align with rollout plan; retire unused flags.

### Monthly
- Audit tool copy/localization; confirm translations up to date.
- Conduct accessibility spot check (keyboard navigation, screen reader hints).

## Incident Response
### API 5xx Spike
1. Confirm alert from Plausible (custom events drop or spike) or synthetic probe failure.
2. Check CloudWatch logs for stack trace.
3. Verify upstream dependencies (Wttr.in, local calculations) availability.
4. Actions:
   - Toggle fallback flag to disable external dependency if needed.
   - Serve cached result or local compute mode.
   - If deployment regression, rollback via `npm run deploy:rollback`.
5. Communicate status in `#clarivum-alerts` and `#clarivum-tools`.

### Latency Regression
- Inspect cache hit metrics via CloudWatch dashboards (`Clarivum/CacheService`, `AWS/ElastiCache`) and warm caches by running `npm run tools:prewarm`.
- Tune ElastiCache TTLs if hit rate drops or scale data usage limits when sustained load increases.
- For heavy computations, offload to background job and return async result to client.
- Update dashboards with findings and log post-mortem if SLO breached.

### Feature Flag Misconfiguration
- Revert flag to safe state (usually disabled for prod).
- Validate that default UI handles disabled state gracefully.
- Update feature flag inventory and runbook with new guardrails.

## Maintenance Windows
- Announce planned downtime in `#clarivum-tools` 24h ahead.
- Pause synthetic alerts or set maintenance window in the monitoring service you use (e.g., CloudWatch Synthetics, UptimeRobot).
- After deployment, run smoke tests and re-enable alerts.

## Wttr.in Integration Notes
- Base endpoint: `https://wttr.in/{location}?format=j1&lang=<pl|en>&num_of_days=1`. Accept latitude/longitude pairs (e.g., `52.2297,21.0122`) or a city name (`Warsaw`). The JSON payload exposes `current_condition[].uvIndex`, `weather[0].uvIndex`, and hourly `uvIndex` values used to derive `uv_now` and `uv_max_today`.
- Requests must forward `Accept-Language` (`pl` or `en`) and a descriptive `User-Agent` (`clarivum-uv-widget/1.0`) per wttr.in guidance. The Node runtime enforces a 4.5 s timeout; override the upstream host via `WTTR_BASE_URL` during incidents.
- Cache policy: 5 minute TTL backed by ElastiCache Serverless (`UV_WIDGET_CACHE_ENDPOINT` with TLS). Keys follow `<lang>:geo:<lat>:<lon>` (rounded to 2 decimals) or `<lang>:city:<query>` and record hit/miss/stale metrics via OpenTelemetry (`clarivum.tools.uv_widget.cache.*`). The prod environment uses the shared serverless cache `platform-prod-cache` (see infra README for endpoints).
- Rate limiting: default 30 req/min per hashed client IP using Lua scripts executed against the shared Redis connection (`UV_WIDGET_RATE_LIMIT_MODE=redis`). Metrics emit under `clarivum.tools.uv_widget.rate_limit.*`. Enable fleet-wide throttling with `UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN` when marketing pushes run; alerts must cover both scopes.
- Enable/disable the handler with `UV_WIDGET_SERVICE_ENABLED` (falls back to `true`). Set `UV_WIDGET_FETCH_ATTEMPTS` (default `2`) when you need extra resilience against transient wttr.in hiccups; review metrics after any change.
- Failover knobs: set `UV_WIDGET_CACHE_MODE=memory` to bypass the shared Redis cache, `UV_WIDGET_CACHE_ALLOW_STALE=false` to disable stale replays, and `UV_WIDGET_RATE_LIMIT_MODE=memory` for maintenance windows. All modes serve stale-but-safe payloads when upstreams fail. Prod caches run over TLS on ElastiCache Serverless; ensure the corresponding env vars (`UV_WIDGET_CACHE_ENDPOINT`, `UV_WIDGET_CACHE_PORT`, `UV_WIDGET_CACHE_USE_TLS`, `UV_WIDGET_RATE_LIMIT_MODE=redis`) are set before toggling modes.
- Copy sourcing: Risk copy, CTA metadata, and fallback banners hydrate from the Strapi collection `tools-uv-widget`. Provide `STRAPI_API_URL` (or `STRAPI_BASE_URL`) plus a read-only delivery token via `STRAPI_TOOLS_UV_WIDGET_TOKEN` (fallback `STRAPI_DELIVERY_API_TOKEN`). Payloads are cached in-process for 5 minutes per locale; if Strapi is unavailable the route falls back to the baked copy documented in ADR-038.
- Debug tip: `curl 'https://wttr.in/52.2297,21.0122?format=j1&lang=pl'` (respect cadence) and compare the `uvIndex` fields with `/api/tools/uv-widget` output.

## Observability Metrics
- Emit Plausible custom events (`uv_widget_load`, `uv_widget_refresh`, `uv_widget_error`) with properties for consent, fallback usage, and location slug.
- Server-side guardrails send `uv_widget_load`, `uv_widget_error`, and `uv_widget_rate_limited` events even when the client script is blocked; confirm Plausible dashboards dedupe these with front-end signals.
- Track ElastiCache connection latency, rate-limit counters, and cache hit ratio via scheduled Kaizen reviews (CloudWatch dashboards + custom OTEL metrics).
- Business metrics: conversion from tool usage to mission start (tracked separately).
- Monitor `feature_flag_evaluations_total` specific to tools for performance.

## Security & Compliance
- Enforce rate limiting and input validation; log suspicious patterns.
- Ensure privacy requirements (no storing sensitive inputs) observed.
- Update legal copy if tool logic affects disclaimers.

## Escalation Matrix
- Level 1: Tools platform engineer on rotation.
- Level 2: Frontend lead (UI regressions, component issues).
- Level 3: Platform lead (infrastructure or cache failures).
- Notify marketing when tool downtime >15 minutes (impacts campaigns).

## Maintenance
- Review runbook after launching new tool vertical.
- Keep feature flag references current; remove retired flags from documentation.

## Changelog
- 2025-10-26 — Initial release supporting UV widget and timer reapplication missions.
- 2025-11-01 — Captured prod ElastiCache deployment (`platform-prod-cache`) and Lambda environment wiring.
- 2025-11-08 — Updated caching section for AWS ElastiCache Serverless and new operational checks.
