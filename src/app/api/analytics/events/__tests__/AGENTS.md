# src/app/api/analytics/events/**tests** · AGENTS Guide

Vitest coverage for the analytics fallback route. These specs act as executable documentation—keep them fast and deterministic.

## Expectations

- Cover the three primary outcomes: invalid payload (`400`), missing credentials (`202` skip), and successful relay (`204`).
- Stub `global.fetch` with `vi.stubGlobal` and reset in `afterEach`; leaking stubs will break other suites.
- Snapshot logging is unnecessary—assert on HTTP status and that `fetch` receives the right URL/headers.

## Commands

- Run isolated suite: `npm run test -- src/app/api/analytics/events/__tests__/route.spec.ts`
- Combine with server helper tests when touching shared utilities: `npm run test -- src/lib/analytics/server/__tests__/plausible.spec.ts src/app/api/analytics/events/__tests__/route.spec.ts`

## References

- Use Context7 (`/vercel/next.js`) for route handler API surface.
- Align assertions with the Plausible helper behaviour in `src/lib/analytics/server/plausible.ts`.
