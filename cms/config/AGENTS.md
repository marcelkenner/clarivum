# cms/config · AGENTS Guide

**Context7:** Validate every Strapi configuration option via the official docs (`/strapi/documentation/v5_2_2`) using `context7__resolve-library-id` → `context7__get-library-docs`.

## Responsibilities
- `admin.ts`, `api.ts`, `database.ts`, `middlewares.ts`, `plugins.ts`, and `server.ts` own the runtime contract for the Strapi app. Keep them aligned with ADR-010 and `docs/PRDs/requierments/strapi/setup.md`.
- Use the documented `env()` helper when reading secrets. Never access `process.env` directly or hard-code credentials.
- For environment-specific overrides, create `config/env/<environment>/*.ts` instead of branching logic inside the base files.

## Workflow
- Document new environment variables in `cms/.env.example`, then update `docs/runbooks/deployment.md` and (if telemetry-related) `docs/runbooks/observability-operations.md`.
- When toggling plugins or middlewares, ensure supporting code lives under `cms/src/extensions` so overrides stay versioned.
- Run `npm run develop` after edits to confirm the dev server boots, and `npm run build` before opening a PR so TypeScript emits cleanly.
- Coordinate database connection or CORS/security changes with `infra/strapi/AGENTS.md` and log any incident-driven adjustments in `sisu-log/`.

Update this guide whenever configuration structure or Strapi upgrade guidance changes.
