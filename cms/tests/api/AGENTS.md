# cms/tests/api · AGENTS Guide

Houses controller/service tests for Strapi APIs. Current coverage focuses on `/api/healthz`; expand here as more CMS endpoints ship.

## Expectations

- One spec per controller/service (e.g., `healthz-controller.test.ts`). Co-locate helpers with the spec or lift them into `tests/__utils__` when reused.
- Tests should stub Strapi context objects (`ctx.strapi`, `ctx.set`, etc.) with Vitest mocks—never boot the full application.
- Assert HTTP semantics (status codes, headers, response payload) because deployment guardrails rely on them.

## Commands

- Single spec: `npm run strapi:test -- --run tests/api/<file>.test.ts`
- All API specs: `npm run strapi:test -- --run tests/api`

## When adding endpoints

1. Implement the controller/service under `cms/src/api/<feature>`.
2. Create `<feature>-controller.test.ts` (or similar) here with mocks covering success and failure paths.
3. Update documentation (`docs/runbooks/deployment.md`, feature PRDs) if the API contract is externally visible.
