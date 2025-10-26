# src/app/[vertical] · AGENTS Guide

Dynamic segments under this directory power `/[vertical]`, `/[vertical]/[category]`, and `/[vertical]/[category]/[slug]` for Skin, Fuel, and Habits. Each page is a server component that receives params, validates them via the coordinator, and passes immutable ViewModels to the UI.

## Commands before review

- `npm run lint:code -- "src/app/[vertical]"` — validates route handlers, metadata functions, and shared layout imports.
- `npm run typecheck -- --incremental false` — ensures TS catches bad `params` refinements and breadcrumb helpers.
- `npm run validate` — required if you touch shared layout, sitemap, or content map utilities.
- (Optional) `npm run test` once ViewModel tests land; target suites under `tests/vertical-experience/`.

## Implementation guardrails

- Never access `params` directly inside views. Pages must call `createVerticalExperienceCoordinator()` and early-return `notFound()` when builders return `null`.
- Keep revalidation windows aligned with SEO runbook defaults (24h). Shorter windows require logging a guardrail task and notifying SEO in the Kaizen Minute.
- Breadcrumbs are generated via `buildBreadcrumbs` in `../_vertical-experience/viewmodel/VerticalViewModels`. Extend that helper instead of duplicating logic.
- When adding new route segments (e.g., `/recommendations`), update `src/app/sitemaps/_utils.ts`, `src/app/rss/route.ts`, and `src/lib/content-map.ts` so static params remain in sync.

## Handoff checklist

- Update relevant PRDs/ADRs if you expand taxonomy or change layout responsibilities.
- Mention the impacted sitemap or RSS handlers in your PR description and tasks entry.
- Run `npm run ensure:agents` when creating new vertical-specific folders (e.g., Skin-specific components) so they inherit these rules.
