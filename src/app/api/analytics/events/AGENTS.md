# src/app/api/analytics/events · AGENTS Guide

`POST /api/analytics/events` validates `WebVitalsMetric` payloads and proxies them to Plausible. Treat this route as an ingestion fallback: it must stay fast, side-effect free, and privacy-aware.

## Payload contract

- Body shape matches `AnalyticsEventRequest<"WebVitalsMetric">` from `src/lib/analytics/dispatch.ts`.
- Required fields: `name === "WebVitalsMetric"`, `props.id`, `props.name`, `props.value`, `props.navigationType`.
- Optional fields: `url`, `referrer`, `timestamp`. Reject any additional unexpected types.
- Update the guards and Vitest fixtures whenever the analytics event schema changes (ADR-029).

## Local workflow

- Focused tests: `npm run test -- src/app/api/analytics/events/__tests__/route.spec.ts`
- Manual smoke: `curl -X POST http://localhost:3000/api/analytics/events -d '{...}' -H "content-type: application/json"` (ensure `PLAUSIBLE_API_KEY` is set or expect a 202 “skipped”).
- Run `npm run typecheck` after edits; the route relies on structural typing.

## Operational guardrails

- Missing credentials should return `202` (skipped) so clients can proceed without retries; CI/ops will pick it up via `npm run analytics:health`.
- Hard failures (Plausible down, malformed payload) must log through `console.error` and return `5xx`.
- If more events are added, expand the handler conservatively—prefer dedicated modules per event type rather than large conditionals.
