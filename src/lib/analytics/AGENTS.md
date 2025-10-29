# src/lib/analytics · AGENTS Guide

This module owns the frontend analytics shims that will be replaced by the full `@clarivum/analytics` toolkit (ADR-029) once TSK-PLAT-005/TSK-SEO-001 land. Keep the code lightweight, typed, and privacy-safe.

## Responsibilities

- Define typed client helpers for Plausible until the shared package ships. Every helper must enforce the event catalogue in ADR-029 and stay free of PII.
- Centralize event names here—page/view code should import helpers instead of calling `window.plausible` directly.
- When the Plausible script is unavailable (ad-blockers, preview environments), fall back to the `/api/analytics/events` route so Web Vitals continue to ingest. Guard the server handler with proper logging and keep it side-effect free.
- Guard against missing Plausible script in development by logging to the console only when `NODE_ENV !== "production"`.

## Development workflow

- Lint + type-check: `npm run lint:code && npm run typecheck`
- Targeted tests (Vitest): `npx vitest run tests/home/HomeExperienceManager.test.ts`
- Full suite (before PR): `npm run validate`
- Verify Plausible ingestion: `npm run analytics:health` (requires Plausible API access). Script fails if Web Vitals metrics have not landed in six hours.
- Run `npm run ensure:agents` after adding folders or moving files so agent docs stay in sync.

## Adding or changing events

1. Update `AnalyticsEventMap` in `dispatch.ts` with the new event and typed payload.
2. Extend unit tests (under `tests/home/` or a new module) so the view models using the event keep coverage.
3. Reflect the event in ADR-029’s catalogue and cite the change in the PR description.
4. Verify Plausible governance expectations in `docs/runbooks/analytics-qa.md` and `docs/runbooks/seo-homepage-metadata-kickoff.md`.

## Context7 references

- Next.js metadata & client APIs: resolve `/vercel/next.js` then fetch docs for “metadata API” or “image-response” as needed.
- Plausible SDK behaviour: use `/plausible/docs` for event contract and self-hosting guidance.

Before merging, ensure the helpers remain tree-shakeable, avoid global side effects, and align with privacy requirements in ADR-028. Use feature flags (Flagsmith) rather than conditional imports when gating instrumentation.
