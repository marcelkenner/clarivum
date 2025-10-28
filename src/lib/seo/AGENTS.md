# src/lib/seo · AGENTS Guide

Owns the shared SEO platform utilities called out in ADR-034 and PRD `docs/PRDs/seo-foundation.md`. Keep changes in lockstep with the homepage metadata kickoff runbook (`docs/runbooks/seo-homepage-metadata-kickoff.md`) and governance policy (`docs/policies/seo-governance.md`).

- Metadata helpers live in `metadata.ts`. They must:
  - default `metadataBase` derived canonical URLs via `resolveAbsoluteUrl`,
  - hydrate Open Graph + Twitter with fallback imagery (`DEFAULT_OG_IMAGE`),
  - stay type-safe using the Next.js Metadata typings (always reference Context7 `/vercel/next.js` when questions arise).
- Structured data builders reside in `structured-data.ts`. Adding new schema types requires:
  - linking to the canonical Google documentation in code comments,
  - extending the Ajv guardrail tests under `__tests__/structured-data.spec.ts`,
  - documenting the new schema contract in `docs/runbooks/seo-operations.md`.
- Routes under `routes/` expose factory functions (e.g., `homepageMetadata`, `buildVerticalHubStructuredData`). Every indexable route must consume these factories instead of hand-coding metadata inside page files.
- Guardrails:
  - Run `npm run check:seo` (or `npm run validate`) after edits; it executes the Vitest suite in `__tests__` which fails if canonical URLs, structured data types, or Ajv schemas drift.
  - Keep tests deterministic—stub random data, avoid network access, and prefer existing content-map fixtures.
- When adding dependencies (e.g., schema validators), coordinate with Platform to review bundle impact and update ADR-034 where needed.
