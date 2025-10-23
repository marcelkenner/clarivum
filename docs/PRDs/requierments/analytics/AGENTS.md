# docs/PRDs/requierments/analytics · AGENTS Guide

## Scope
- Owns instrumentation and reporting requirements for Plausible Analytics (sole provider), including funnel dashboards and anomaly alerts.
- Captures cross-vertical telemetry rules that every surface (homepage, tools, ebooks, subscriptions) must reuse.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/diagnostics/feature-requirements.md`, and `docs/PRDs/requierments/frontend-platform/feature-requirements.md` for event sources.
- ADRs covering Flagsmith (`docs/adr/ADR-005-feature-flags.md`) and observability strategy; pull Context7 docs for SDK usage before changing integrations.

## Execution Guardrails
- Maintain a canonical event schema: document naming, properties, and consent requirements before shipping changes.
- Budget client overhead (<10 ms) by lazy-loading analytics bundles and caching flag payloads; validate against Web Vitals in the dev environment.
- Ensure exports and dashboards mask PII unless analyst roles explicitly require access; reflect decisions in change logs.
- Keep anomaly detection thresholds and alert routing in sync with `docs/policies/error-budget-policy.md`.

## Handoff Checklist
- Update the event dictionary and instrumentation changelog, then alert affected feature owners.
- Verify opt-in flows, consent banners, and privacy notices reference any new tracking.
- Confirm dashboards or alerts tied to new events exist before closing the task; link them in the requirement notes.
