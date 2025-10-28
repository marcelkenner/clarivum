# src/lib/seo/routes · AGENTS Guide

Route-focused metadata/JSON-LD factories consumed by App Router pages.

- `homepage.ts` must remain the single source of truth for `/` metadata/structured data. Update its copy when homepage requirements in `docs/PRDs/requierments/homepage/feature-requirements.md` evolve.
- `vertical-hub.ts`, `vertical-category.ts`, and `vertical-article.ts` mirror the Clarivum taxonomy from `src/lib/content-map.ts`. When taxonomy changes:
  - adjust the factories in tandem with the coordinator/view-model layers,
  - ensure Ajv tests still pass (`npm run check:seo`),
  - update sitemap builders (`src/app/sitemaps`) if new segments appear.
- Avoid duplicating strings: use helpers like `resolveAbsoluteUrl` and `listVerticalHighlights` so canonical URLs stay in sync with site configuration.
- If you add new route factories, document their adoption path in `docs/runbooks/seo-operations.md` and link to the governing PRD/ADR in the file header comment.
