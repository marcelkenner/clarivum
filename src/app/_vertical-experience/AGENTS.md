# src/app/\_vertical-experience · AGENTS Guide

This module provides the platform primitives consumed by all Skin/Fuel/Habits routes. Treat it as an internal package with strict layering.

## Commands before review

- `npm run lint:code -- "src/app/_vertical-experience"`
- `npm run typecheck -- --incremental false`
- `npm run test -- viewmodels` (or the future targeted script) once suites land

## Layering rules

- Coordinators (`coordinator/`) may depend on managers; viewmodels and views cannot. Pages must instantiate coordinators via `createVerticalExperienceCoordinator()` to allow dependency injection in tests.
- `ContentLibrary` is the single abstraction for taxonomy data. When swapping in Strapi/Supabase loaders, extend `createContentLibrary()` and keep method signatures backwards-compatible.
- View components consume serialized ViewModels only. No `params`, global state, or data fetching in `view/`.
- Breadcrumb builders and public helpers live in `viewmodel/`. Update tests + docs if you change their contracts.

## When routes or content change

- Update `src/lib/content-map.ts`, sitemap helpers, and RSS route together.
- Log follow-up work (e.g., new loaders, caching plans) in the `tasks/` board and mention it in PR descriptions.
- Refresh docs: `README.md` (App Router section), `docs/adr/ADR-019-frontend-platform.md`, and `docs/runbooks/seo-operations.md` if the change affects indexing or metadata cadence.
