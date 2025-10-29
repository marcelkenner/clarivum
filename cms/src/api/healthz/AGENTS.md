# cms/src/api/healthz · AGENTS Guide

Purpose: serve the Strapi `/api/healthz` endpoint that backs CI/CD health checks (TSK-PLAT-022) and the ECS deployment probes defined in `infra/strapi`. Keep behaviour aligned with `docs/runbooks/deployment.md` and `docs/PRDs/requierments/strapi/setup.md`.

## Expectations

- Return `200` with `healthy: true` when core dependencies succeed, otherwise `503`. The JSON contract (`healthy`, `checks[]`, `timestamp`, `uptimeSeconds`, `environment`) is consumed by AWS health checks and the observability dashboards—treat it as stable.
- Always set `Cache-Control: no-store` to keep upstream caches from serving stale results.
- Extend `checks[]` when new dependencies are introduced (e.g., storage, external APIs). Accompany additions with Vitest coverage under `cms/tests/api/healthz`.
- Keep the handler idempotent and side-effect free; the route is polled continuously by ALB + CI.
- Reference Strapi v5 docs through Context7 (`/strapi/documentation`) before using new framework primitives.

## Local workflows

- Fast feedback: `npm run strapi:test -- --run tests/api/healthz/healthz-controller.test.ts`
- Full Strapi gate: `npm run strapi:ci` (lint → typecheck → test → build)
- Manual verification (after `npm run develop`): `curl http://localhost:1337/api/healthz`

## Checklist for changes

1. Update `controllers/healthz.ts` and adjust tests in `cms/tests/api/healthz`.
2. If new dependencies are added, document runbook updates under `docs/runbooks/deployment.md` and ensure ECS IAM/secrets changes are captured.
3. Run `npm run strapi:ci` before opening a PR.
