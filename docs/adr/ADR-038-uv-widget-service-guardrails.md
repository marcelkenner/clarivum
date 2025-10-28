# ADR-038: UV Widget Service Guardrails
Date: 2025-11-07
Status: Proposed

## Context
- Sprint 09 commits to launching the UV hero widget backed by wttr.in (`format=j1`) data, localized Strapi copy, and Plausible analytics loops (`docs/PRDs/requierments/tools/skin/widget_indeks_uv.md`).
- The initial API route prototype ships hard-coded copy, in-memory caching, and ad-hoc rate limiting that will not scale across concurrent Vercel instances.
- Editors require the ability to update risk messaging and fallback banners directly through Strapi, matching the workflow documented in ADR-010.
- Platform-wide guardrails dictate that caching and throttling rely on the shared Upstash layer (ADR-006) and that analytics flow exclusively through Plausible (ADR-029).
- We need a documented pattern that keeps the backend-for-frontend service compliant with uptime, localization, and observability expectations before the homepage launches the feature flag.

## Decision
- Source risk copy, fallback messaging, and CTA configuration from a Strapi collection (`tools.uv-widget`) exposed via read-only API tokens, caching results for 5 minutes.
- Replace the local cache and rate limiter with Upstash Redis + `@upstash/ratelimit`, enforcing a 5 minute payload cache (keyed by locale and geo roundings) and 30 req/min/IP throttling by default.
- Keep wttr.in as the weather provider, calling `https://wttr.in/{lat},{lon}?format=j1&lang=<locale>` with a 4.5 second timeout, retries disabled, and descriptive `User-Agent`.
- Emit Plausible events (`uv_widget_load`, `uv_widget_refresh`, `uv_widget_error`, `uv_widget_cta_click`) server-side with normalized properties for consent state, fallback reason, locale, and CTA identifiers.
- Instrument the route with OpenTelemetry spans and surface cache hit, upstream latency, and rate limit metrics via logs for Kaizen reviews; no Datadog/Grafana dependencies are introduced.
- Document operational steps, field mappings, and alert thresholds in `docs/runbooks/tools-platform-operations.md` and task out delivery in TSK-PLAT-047/048/049.

## Consequences
- Editors gain real-time control over localization and compliance copy without redeploys.
- Shared Redis guardrails ensure consistent caching/throttling across Vercel regions and simplify incident response.
- Analytics pipelines remain consolidated on Plausible, reducing monitoring complexity and aligning with ADR-029.
- Additional implementation work is required before launch (Strapi schema, Upstash integration, analytics dashboards), but the tasks are scoped and tracked.
- Future tools can reuse the same pattern (external source + Strapi + Upstash + Plausible) by extending this ADR, increasing consistency across the Tools platform.

## Related Tasks
- `tasks/backlog/platform/plat-047-uv-widget-strapi-copy.md`
- `tasks/backlog/platform/plat-048-uv-widget-upstash-cache.md`
- `tasks/backlog/platform/plat-049-uv-widget-analytics-guardrails.md`

## References
- `docs/PRDs/requierments/tools/skin/widget_indeks_uv.md`
- `docs/runbooks/tools-platform-operations.md`
- `docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md`
- `docs/adr/ADR-010-content-management-platform.md`
- `docs/adr/ADR-022-tools-and-calculators-platform.md`
- `docs/adr/ADR-029-plausible-analytics-platform.md`

## Diagrams
- [Architecture Overview](../diagrams/adr-038-uv-widget-service-guardrails/architecture-overview.mmd) — Frontend, API, wttr.in, and Strapi interactions powering the widget.
- [Data Lineage](../diagrams/adr-038-uv-widget-service-guardrails/data-lineage.mmd) — Flow from consent/geolocation through caching and response shaping.
- [Domain Sequence](../diagrams/adr-038-uv-widget-service-guardrails/uml-sequence.mmd) — Call sequence between ViewModel, manager, cache, wttr.in, and Strapi.
- [Process Flow](../diagrams/adr-038-uv-widget-service-guardrails/bpmn-flow.mmd) — BPMN covering consent handling, fallbacks, and cache refresh cadence.
