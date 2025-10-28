# src/lib/seo/**tests** · AGENTS Guide

Holds the Vitest guardrails for the SEO platform layer.

- `metadata.spec.ts` covers the generic factory expectations (canonical URLs, OG/Twitter fallbacks). Extend this when adding new metadata features.
- `structured-data.spec.ts` validates JSON-LD builders with Ajv. If you introduce new schema types, import the corresponding Google schema JSON or craft a minimal schema so we fail fast.
- `routes.spec.ts` loads real view models to ensure every indexable route exposes valid metadata/structured data. Add regression tests when wiring new routes or when taxonomy changes require updates.
- Always run `npm run check:seo` locally; CI runs this via `npm run validate` and will block merges on failures.
- Look up Next.js metadata API, structured data specs, or Ajv configuration via Context7 (`context7__resolve-library-id` + `context7__get-library-docs`) before changing APIs.
