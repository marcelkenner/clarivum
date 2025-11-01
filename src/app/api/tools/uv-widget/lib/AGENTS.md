# src/app/api/tools/uv-widget/lib · AGENTS Guide

This directory does not yet have tailored agent guidance. Use these defaults until you add project-specific notes.

- Keep changes aligned with the PTRD (`docs/PRDs/first_steps.md`) and relevant ADRs.
- Run `npm run ensure:agents` after restructuring to keep agent docs in sync.
- Follow coding standards from the root `AGENTS.md`.
- Always resolve library and framework questions via Context7 (`context7__resolve-library-id` + `context7__get-library-docs`).
- Update this file with localized best practices as soon as the directory gains dedicated responsibilities.
- Shared cache and rate limiter use the shared ElastiCache Serverless connection (`UV_WIDGET_CACHE_ENDPOINT`, `UV_WIDGET_CACHE_PORT`, `UV_WIDGET_CACHE_USE_TLS`). Toggle `UV_WIDGET_CACHE_MODE`/`UV_WIDGET_RATE_LIMIT_MODE` to `memory` for local-only runs; leave `UV_WIDGET_CACHE_ALLOW_STALE=true` so stale payloads cover outages.
- Risk copy and CTA content hydrate from Strapi (`tools-uv-widget`). Provide `STRAPI_API_URL` (or `STRAPI_BASE_URL`) alongside a read-only token in `STRAPI_TOOLS_UV_WIDGET_TOKEN` (fallback `STRAPI_DELIVERY_API_TOKEN`); the loader caches responses per language for 5 minutes and falls back to baked copy when Strapi is unreachable.
- Validate changes with `npm run test -- tests/api/tools/uv-widget` to exercise cache-hit and throttle scenarios.
