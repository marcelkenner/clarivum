# Aurora data helpers · AGENTS Guide

Use this directory for Aurora PostgreSQL client utilities and schema helpers. Types are generated into `database/types.ts`; re-export them from local modules so application code can import via `@/lib/aurora`.

## Connection Helpers

- `getAuroraPool("writer" | "reader")` supplies the shared `pg.Pool`. Rely on it instead of spawning pools per request—connection counts are capped by Aurora quotas.
- `createAuroraPool` exists for advanced cases (e.g., transactional jobs) but should remain rare; document any new usage in the PR.
- `withAuroraTransaction` wraps the happy-path transaction pattern (`BEGIN`/`COMMIT`/`ROLLBACK`). Use it whenever a multi-query change must be atomic.

## Environment Expectations

- `DATABASE_URL` – required writer DSN. Fetched from Secrets Manager in runtime deploys.
- `READ_DATABASE_URL` – optional reader DSN; falls back to `DATABASE_URL` if absent.
- `DATABASE_SSL`, `DATABASE_POOL_MAX`, `DATABASE_IDLE_TIMEOUT_MS`, `DATABASE_APPLICATION_NAME` – optional knobs mirrored in `docs/runbooks/aurora-operations.md`. Update the runbook if you introduce new tuning flags.
- For TLS guidance or connection pooling best practices, pull authoritative docs via Context7 (`context7__resolve-library-id "brianc/node-postgres"` → `context7__get-library-docs`).

## Schema Types

- Types re-exported from `database/types.ts` track the canonical Aurora schema. Regenerate them with `npm run db:types` after migrations; never edit the file by hand.
- Reference structs by importing from `@/lib/aurora` (e.g., `Tables<"content_items">`), keeping call sites decoupled from generator paths.

## Testing & Verification

- Add Vitest/Playwright coverage for new query helpers where feasible; integration tests should use seeded data or the existing pg-mem test harness if introduced.
- Run `npm run validate` after edits. If you touch migrations or type definitions, run the relevant suites (`npm run test`, `npm run db:migrate -- --env dev`) before requesting review.

## Guardrails

- Do not sprinkle raw connection strings or env reads throughout the app—route everything through this module.
- Keep logging redacted; never log SQL parameters that may include personal data.
- Coordinate breaking changes with ADR-001 (Primary Cloud & Database) and update `docs/runbooks/aurora-operations.md` plus any affected PRDs.
