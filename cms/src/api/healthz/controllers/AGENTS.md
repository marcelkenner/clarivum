# cms/src/api/healthz/controllers · AGENTS Guide

`healthz.ts` implements the Strapi controller used by the `/api/healthz` route. Keep logic small, deterministic, and covered by unit tests in `cms/tests/api/healthz/healthz-controller.test.ts`.

## Implementation notes

- Use the Strapi database connection (`ctx.strapi.db.connection.raw`) for liveness checks. Avoid importing migrations or ORM internals directly—stick to documented APIs (`/strapi/documentation` on Context7).
- Any new dependency check must return a `HealthCheckOutcome` with `component`, `healthy`, `durationMs`, and optional `error`. Add helper functions per dependency rather than expanding `status` inline.
- Responses must remain JSON serialisable without circular references; avoid attaching raw error objects.
- Keep the controller synchronous from the caller’s perspective (returning a plain object), and make sure every `await` has error handling that resolves to a `HealthCheckOutcome`.

## Testing

- Unit tests: `npm run strapi:test -- --run tests/api/healthz/healthz-controller.test.ts`
- Extend the Vitest suite whenever behaviour changes (e.g., new headers, additional checks). Use dependency injection/mocking—see existing helpers in the test file.

## Guardrails

- Do not add Strapi middleware configuration here; route wiring lives alongside `routes/healthz.ts`.
- Changes affecting response shape or status codes require an update to `docs/runbooks/deployment.md` and notification to the platform team (deployment health probes depend on this contract).
