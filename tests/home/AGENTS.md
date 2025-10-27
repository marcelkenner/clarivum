# tests/home · AGENTS Guide

This lane holds Vitest coverage for the marketing homepage (TSK-FE-005) and related coordinators. Keep tests small, deterministic, and aligned with the ASCII designs + ADR-029 analytics requirements.

## Running tests

- Single file during development: `npx vitest run tests/home/HomeExperienceManager.test.ts`
- Watch mode while iterating: `npx vitest --watch tests/home`
- Full regression prior to PR: `npm run test` (covers all suites)
- Always follow with `npm run typecheck` to ensure view model updates are reflected in types.

## Authoring guidelines

- Focus on behaviour, not implementation details—assert against the coordinator-generated view model to catch copy drift.
- When analytics events are involved, spy on `dispatchAnalyticsEvent` instead of touching `window.plausible`.
- Update tests whenever `HomeLandingViewModel` changes; the contract lives in `src/app/(marketing)/_home/viewmodel/HomeViewModel.ts`.
- Prefer data-driven assertions (`forEach` over repeated `expect` blocks) to keep coverage expandable as new pillars/goals appear.

## Tooling notes

- Mock Next.js modules (e.g., `next/image`) in each file to avoid global state leaks.
- Use `vi.useFakeTimers()` sparingly; the hero wizard already handles async via `setTimeout`, so favour waiting on DOM updates.
- Keep fixtures in sync with ADR-037 responsive design guidance so layout assumptions stay accurate.

If new homepage suites emerge, expand this guide with their specific conventions and add links to any supporting runbooks or PRDs. Always resolve library questions through Context7 (`context7__resolve-library-id` → `/vercel/next.js` docs) to stay aligned with the current Next.js contract.
