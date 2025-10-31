# src/app/api/sentry-example-api · AGENTS Guide

Sentry keeps this API route around as a quick smoke-test for backend instrumentation. It intentionally throws on every request so engineers can verify server-side error capture without touching production flows.

## Purpose & Behaviour

- The `dynamic = "force-dynamic"` export guarantees the route executes on every request; do not convert it to static or ISR.
- `SentryExampleAPIError` must be thrown in the `GET` handler—do not catch or swallow the error. Sentry uses the unhandled exception to exercise alerting.
- Return statements after the throw are dead code by design; keep them in place if you need to demonstrate payload shapes during workshops, but ensure the error path remains the default.

## When Updating

- Add temporary logging only while debugging and remove it before merging.
- If you tweak the error message, document the change in the PR so on-call engineers know what to expect in Sentry.
- Keep imports limited to the Next.js runtime and shared utilities; avoid application dependencies to reduce blast radius.

## Verification

- Run `npm run dev` and hit `GET /api/sentry-example-api` (browser or `curl`) to confirm a 500 surfaces in Sentry.
- After edits, run `npm run validate` to keep CI green.
- For Sentry configuration docs or SDK changes, pull authoritative guidance via Context7 (`context7__resolve-library-id "sentry nextjs"` then `context7__get-library-docs`).

## Guardrails

- Never expose secrets or environment details in the thrown error message.
- Keep the route behind any internal-only navigation—do not surface it to end users.
- If observability requirements change, mirror the update in `docs/runbooks/observability-operations.md`.
