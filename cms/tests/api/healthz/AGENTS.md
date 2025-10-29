# cms/tests/api/healthz · AGENTS Guide

Unit tests that pin the `/api/healthz` controller contract. They simulate Strapi’s context to verify status codes and JSON shape used by CI/CD health probes.

- `healthz-controller.test.ts` must cover both the “healthy” and “dependency failure” paths. Add additional cases when the controller introduces new checks (e.g., storage, third-party services).
- Use `createCtx` helpers to mock dependencies; keep new mocks minimal and deterministic.
- When changing controller behaviour, update expectations here and confirm the Strapi pipeline (`npm run strapi:ci`) still passes.
- Verify manually with `npm run strapi:test -- --run tests/api/healthz/healthz-controller.test.ts` before raising a PR.
