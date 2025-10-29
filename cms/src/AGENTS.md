# cms/src · AGENTS Guide

**Context7:** Confirm Strapi project structure guidance with `/strapi/documentation/v5_2_2`.

## Layout
- `index.ts` hosts the global `register` and `bootstrap` hooks. Use them to wire plugin extensions, telemetry, cron jobs, or one-off startup logic aligned with ADR-010.
- `admin/` manages admin panel customization (see `cms/src/admin/AGENTS.md`).
- `api/` stores collection/single types plus their controllers, services, and routes (see `cms/src/api/AGENTS.md`).
- `extensions/` contains overrides for core/third-party plugins (see `cms/src/extensions/AGENTS.md`).

## Workflow
- Create or edit content-types with the admin builder or `npm run strapi generate content-type`, then commit the generated files under `api/`.
- Keep custom logic TypeScript-first. After schema changes, refresh typings with `npm run strapi ts:generate-types`.
- Centralize side effects in `index.ts` so lifecycle updates are traceable. Reference `docs/runbooks/observability-operations.md` when instrumenting telemetry.
- Use `npm run develop -- --watch-admin` during admin work so changes rebuild automatically; otherwise `npm run develop` suffices.

## Guardrails
- Add unit/integration tests when introducing custom controllers or services and wire them into `npm run test` once real suites exist.
- Document API changes in `docs/PRDs/requierments/strapi/feature-requirements.md` and ensure frontend consumers update their contracts.
- Record any production-impacting adjustments in `sisu-log/` with a seven-line note and a companion guardrail.
