# cms/public · AGENTS Guide

**Context7:** Confirm static asset behaviour with `/strapi/documentation/v5_2_2`.

## Scope
- Assets here are served verbatim by the Strapi backend (e.g., `robots.txt`). Keep them aligned with ADR-010 and `docs/PRDs/requierments/frontend-platform/feature-requirements.md`.
- Do not place secrets or environment-specific files in this directory; everything is baked into the container image.

## Workflow
- Check in only reproducible fixtures (icons, placeholder images, policy documents). Production uploads live in S3 via the configured upload provider.
- When adjusting SEO or crawler directives, update `docs/runbooks/ops-hub.md` and note the behaviour change in the release PR.
- Keep binaries optimized (<1 MB) and include source attribution in file headers or accompanying README snippets.
- After modifications, run `npm run build` and `npm run start` locally to confirm the assets are emitted in the production bundle.
