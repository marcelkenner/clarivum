# src/app/api/tools/uv-widget · AGENTS Guide

This directory does not yet have tailored agent guidance. Use these defaults until you add project-specific notes.

- Keep changes aligned with the PTRD (`docs/PRDs/first_steps.md`) and relevant ADRs.
- Run `npm run ensure:agents` after restructuring to keep agent docs in sync.
- Follow coding standards from the root `AGENTS.md`.
- Always resolve library and framework questions via Context7 (`context7__resolve-library-id` + `context7__get-library-docs`).
- Update this file with localized best practices as soon as the directory gains dedicated responsibilities.
- UV widget cache & throttling rely on Upstash REST creds (`UPSTASH_CACHE_REST_URL`/`TOKEN`, `UPSTASH_RATELIMIT_REST_URL`/`TOKEN`). For maintenance or local dev, set `UV_WIDGET_CACHE_MODE=memory` and `UV_WIDGET_RATE_LIMIT_MODE=memory`. Global throttling defaults to `UV_WIDGET_GLOBAL_RATE_LIMIT_PER_MIN=0`; raise it per environment when platform signs off.
- Gate rollout with `UV_WIDGET_SERVICE_ENABLED=true|false`; when toggled off the route returns `503` without caching and skips upstream calls. Use `UV_WIDGET_FETCH_ATTEMPTS` (default `2`) to tune retry behaviour during incidents.
- Strapi powers the risk/fallback copy via the `tools-uv-widget` collection. Ensure `STRAPI_API_URL` (or `STRAPI_BASE_URL`) and a read-only delivery token (`STRAPI_TOOLS_UV_WIDGET_TOKEN` or `STRAPI_DELIVERY_API_TOKEN`) are present before enabling the widget in an environment.
- Server-side Plausible hooks emit `uv_widget_load`, `uv_widget_error`, and `uv_widget_rate_limited`; keep ADR-029 catalog entries in sync when adjusting event payloads.
- Run `npm run test -- tests/api/tools/uv-widget` after touching cache or rate-limit logic; tests cover cache hits, stale fallbacks, and throttle edges.
