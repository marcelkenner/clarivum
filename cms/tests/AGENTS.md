# cms/tests · AGENTS Guide

Strapi-specific test suites live here (Vitest). These guard configuration contracts, API controllers, and future plugins. Align coverage with the expectations in `cms/AGENTS.md` and `docs/runbooks/deployment.md`.

## Commands

- Run everything: `npm run strapi:test`
- Watch mode while developing: `npm run strapi:test -- --watch`
- Gate before merging: `npm run strapi:ci` (executes lint/typecheck/test/build)

## Patterns

- Keep test file paths mirrored to the source (`tests/api/<feature>` for controllers, `tests/config` for configuration helpers, etc.).
- Prefer dependency injection or light mocking with Vitest (`vi.fn()`). Avoid importing Strapi internals that would require booting the app.
- Update fixtures/helpers under `tests/__utils__` (create the folder if needed) so shared mocks stay consistent.
- Cover every behavioural change with a test. For health checks and configuration, assert status codes, cache headers, and error propagation.

## When adding suites

1. Create the directory structure and populate an `AGENTS.md` (run `npm run ensure:agents` afterward).
2. Document any new required environment variables in `cms/.env.example` and the relevant runbooks.
3. Run `npm run strapi:test` locally; CI will fail the PR if the suite is flaky or slow.
