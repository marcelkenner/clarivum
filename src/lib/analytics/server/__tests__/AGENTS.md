# src/lib/analytics/server/**tests** · AGENTS Guide

Vitest specs for Plausible server helpers. These tests simulate Plausible’s HTTP responses so we can verify retry/skip logic without hitting the network.

## Structure

- `plausible.spec.ts` covers: no API key (`skipped`), success, non-OK response (failed with captured body).
- Stub `global.fetch` with `vi.stubGlobal` and call `vi.unstubAllGlobals()` in `afterEach`.
- Reset `process.env` to the original snapshot before/after each test to avoid cross-suite leakage.

## Commands

- Run suite: `npm run test -- src/lib/analytics/server/__tests__/plausible.spec.ts`
- Pair with route tests when updating request/response types.

## Tips

- Assert on headers (`Authorization`, `content-type`, `user-agent`) and parse the JSON body to verify payload shape.
- When Plausible adds new fields, extend the helper first, then update these tests to cover the change.
