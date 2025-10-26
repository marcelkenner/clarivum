# src/app/(marketing) · AGENTS Guide

The `(marketing)` route group owns `/`, `/ebooks`, `/narzedzia`, `/blog`, and future brand experiences. Pages are server components that compose ViewModels built by coordinators in `./_home/**` or neighboring modules.

## Required commands

- `npm run dev` — verify hot reload covers route-grouped layouts; confirm no client components sneak in without `"use client"`.
- `npm run lint:code -- "src/app/(marketing)"` — ESLint with module-boundary rules for this segment.
- `npm run typecheck -- --incremental false` — ensure server components, metadata exports, and route handlers stay type-safe after refactors.
- `npm run test` (once suite lands) — marketing smoke tests will live under `tests/marketing/`; run them before requesting review.

## Implementation notes

- Always build page data via a coordinator (e.g., `createHomeExperienceCoordinator`) to keep dependency injection intact. Never import managers or content maps directly inside components.
- Revalidate cadence defaults to 30 minutes for marketing routes (`export const revalidate = 60 * 30`). Adjust only with product + SEO sign-off, and update `docs/runbooks/seo-operations.md` if cadence changes.
- Metadata (title, description, Open Graph) must align with `docs/PRDs/clarivum_brand.md`. Keep TODO callouts referencing ASCII designs until copy is final.
- When introducing new marketing subroutes, add them to `src/app/sitemaps/pages.xml/route.ts` and the sitemap index.

## Review checklist

- Breadcrumbs, CTA labels, and placeholder copy point back to the canonical PRDs.
- Layouts keep files under 200 lines; extract shared blocks into `src/app/shared/components` when needed.
- After structural changes, regenerate agent docs via `npm run ensure:agents` so new directories inherit this guidance.
