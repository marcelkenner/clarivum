# src/app/api/analytics · AGENTS Guide

Fallback analytics APIs that proxy telemetry to Plausible (ADR-029). These handlers exist so Core Web Vitals continue to ingest when the client script is blocked by privacy tooling.

## Responsibilities

- Accept privacy-safe analytics payloads and relay them to Plausible using server credentials.
- Keep response bodies empty (`204`) unless there is a configuration problem so clients can use `navigator.sendBeacon`.
- Never expose Plausible keys to the browser; all configuration comes from process env (`PLAUSIBLE_API_KEY`, `PLAUSIBLE_DOMAIN`, optional `PLAUSIBLE_API_URL`).

## Development workflow

- Lint & types: `npm run lint:code && npm run typecheck`
- Focused tests: `npm run test -- src/app/api/analytics/events/__tests__/route.spec.ts`
- Health guardrail: `npm run analytics:health` (requires Plausible API access); fails when WebVitals ingestion pauses.
- Re-run `npm run ensure:agents` after adding or moving routes.

## Implementation notes

- Only accept JSON payloads; reject anything that does not match the typed schema in the nested `events` route.
- Use Context7 for Next.js App Router API docs (`context7__resolve-library-id('next.js')` → `get-library-docs` on “route handlers”).
- Log configuration problems at `warn` level (missing credentials) and delivery issues at `error`.
- Extend this surface with new analytics endpoints only when the event catalogue (ADR-029) is updated and reviewed.
