# src/app/api/tools/uv-widget · AGENTS Guide

This directory does not yet have tailored agent guidance. Use these defaults until you add project-specific notes.

- Keep changes aligned with the PTRD (`docs/PRDs/first_steps.md`) and relevant ADRs.
- Run `npm run ensure:agents` after restructuring to keep agent docs in sync.
- Follow coding standards from the root `AGENTS.md`.
- Always resolve library and framework questions via Context7 (`context7__resolve-library-id` + `context7__get-library-docs`).
- Update this file with localized best practices as soon as the directory gains dedicated responsibilities.
- UV widget cache & throttling rely on Upstash REST creds (`UPSTASH_CACHE_REST_URL`/`TOKEN`, `UPSTASH_RATELIMIT_REST_URL`/`TOKEN`). For maintenance or local dev, set `UV_WIDGET_CACHE_MODE=memory` and `UV_WIDGET_RATE_LIMIT_MODE=memory`.
- Strapi powers the risk/fallback copy via the `tools-uv-widget` collection. Ensure `STRAPI_API_URL` (or `STRAPI_BASE_URL`) and a read-only delivery token (`STRAPI_TOOLS_UV_WIDGET_TOKEN` or `STRAPI_DELIVERY_API_TOKEN`) are present before enabling the widget in an environment.
- Run `npm run test -- tests/api/tools/uv-widget` after touching cache or rate-limit logic; tests cover cache hits, stale fallbacks, and throttle edges.
