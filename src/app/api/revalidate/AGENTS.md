# src/app/api/revalidate · AGENTS Guide

Server route powering Strapi-triggered ISR refreshes. It receives `POST` requests from the Strapi CI/CD workflow and validates the bearer token stored in AWS Secrets Manager (`STRAPI_REVALIDATE_SECRET_ARN`). Behaviour must track the contract in `docs/runbooks/deployment.md`.

## Expectations

- `POST` only; `GET` must return 405 with the `Allow: POST` header.
- Authorisation: the `Authorization` header must be `Bearer <secret>` and match `process.env.STRAPI_REVALIDATE_SECRET` (fallback `REVALIDATE_TOKEN`). Never relax this check—deployment automation relies on it.
- Accept scopes via `?scope=strapi&scope=...` (defined in `scopeRegistry`), and optional JSON body with `paths`, `tags`, `invalidateStatic`.
- Return `202` with `revalidated.paths` / `revalidated.tags` lists when at least one target is present; otherwise respond `400`.
- All responses must include `Cache-Control: no-store`.
- Extend `scopeRegistry` conservatively; document new scopes in `docs/runbooks/deployment.md` and ensure Strapi pipelines send matching scopes.

## Commands

- Unit tests: `npm run test -- src/app/api/revalidate/route.test.ts`
- Full Next.js guardrail: `npm run validate`
- Manual call (use a preview token): `curl -X POST http://localhost:3000/api/revalidate?scope=strapi -H "Authorization: Bearer $STRAPI_REVALIDATE_SECRET"`

## When editing

1. Update `route.ts` logic and ensure error handling remains deterministic.
2. Adjust `route.test.ts` to cover new branches (success, auth failure, bad payload, exceptions).
3. Keep token names (`STRAPI_REVALIDATE_SECRET`, `REVALIDATE_TOKEN`) in sync with the Strapi workflow and environment docs.
4. Coordinate with platform engineers before removing scopes or changing response shape—Strapi deployments and observability webhooks consume this API.
