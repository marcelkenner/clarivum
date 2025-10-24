# tests · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
Vitest powers Clarivum’s unit & component suite. Tests live under this directory so we can co-locate helpers that cut across feature areas.

## Commands

- Run the full suite: `npm run test`
- Watch mode while developing: `npm run test:watch`
- Coverage output: `npm run test:coverage` (writes reports to `coverage/`)

## Conventions

- Mirror source structure (e.g., `tests/app/**` for Next.js components, `tests/config/**` for runtime utilities).
- Use `vi.mock` inside tests for framework-specific modules such as `next/image`; add shared mocks to `tests/setupTests.ts`.
- Prefer Testing Library for component assertions and isolate pure utilities with direct function tests.

## Guardrails

- Keep sample fixtures minimal and deterministic; anything stateful belongs in Playwright smoke/regression suites.
- Update related docs (`AGENTS.md`, role guides) when introducing new helpers or patterns.
- Run `npm run lint:tasks` after touching task files to keep statuses and metadata consistent.
