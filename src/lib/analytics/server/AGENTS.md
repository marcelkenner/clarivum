# src/lib/analytics/server · AGENTS Guide

Server-side utilities for Plausible ingestion. They encapsulate credential handling and request formatting for the fallback analytics API.

## Core module

- `plausible.ts` exposes `forwardAnalyticsEventToPlausible`.
- Reads env vars: `PLAUSIBLE_API_KEY` (required), `PLAUSIBLE_DOMAIN`, optional `PLAUSIBLE_API_URL`.
- Falls back to `NEXT_PUBLIC_SITE_URL` to derive the domain if none is provided.
- Returns discriminated union `{status: "sent" | "skipped" | "failed"}`—callers must branch on this instead of throwing.

## Development workflow

- Unit tests: `npm run test -- src/lib/analytics/server/__tests__/plausible.spec.ts`
- Type safety: `npm run typecheck`
- Keep requests privacy-safe: never mutate payloads to include PII; only the event props defined in ADR-029.

## Implementation notes

- Use Context7 for Plausible HTTP API references (`context7__resolve-library-id('plausible/docs')`…).
- Set a descriptive `user-agent` when calling Plausible; update it if the service name changes.
- Guard against missing credentials early (return `skipped`) so upstream handlers can log and continue.
- When expanding to additional events, segregate payload mappers per event key to keep compile-time types tight.
