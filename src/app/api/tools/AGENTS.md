# Tools API · AGENTS Guide

- Endpoints under this directory expose the server-side surface for Clarivum calculators and widgets (`/api/tools/*`). Keep contracts aligned with `docs/PRDs/requierments/tools/**` and update the owning runbooks when behavior changes.
- Validate query params and request bodies before calling downstream services; prefer lightweight schema helpers until the shared zod package lands.
- Enforce caching and rate limiting per ADR-006. Default to a 5 minute TTL for external weather/data lookups and throttle abusive origins.
- Instrument every handler with OpenTelemetry spans (`clarivum.api.tools`) and structured logs so Ops Hub dashboards stay accurate.
- Add or update guardrails (tests, monitors, alerts) with each change. Record new checks in the Kaizen log (`#kaizen-minute`) and append incident learnings to `sisu-log/`.
