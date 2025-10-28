# src/lib/documents · AGENTS Guide

Shared utilities for reading and indexing Markdown documents:

- `fonts.ts` registers the Cormorant Garamond font used by the Atrament document styles.
- `get-document.ts` reads a single Markdown file from `docs/`, `tasks/`, or `sisu-log/`.
- `list-documents.ts` indexes all docs + caches metadata for the `/library` page.
- `access.ts` exposes `assertInternalDocsAccess()` to hide routes in production by default.

## Guardrails

- Never import these modules from client components; they rely on `fs` and must stay server-only.
- When adding a new root (e.g., `policies/`), update `DocumentRoot`, `ROOT_DIRECTORIES`, and the
  cache serialization logic in `list-documents.ts`, plus the root labels in `DocumentIndex`.
- Keep path normalization strict: reject any traversal attempts and prefer `path.posix` when
  generating URLs.
- Cache writes go to `.next/cache/clarivum`. Failing to write must never crash the server — always
  swallow errors after logging (if needed).
- Fonts: if you change typography, sync with ADR-018 and update `src/styles/document-theme.css`.
- Do not bypass `assertInternalDocsAccess()` without product/security approval.

## Checks

```bash
npm run lint:code -- src/lib/documents
npm run typecheck
```

Document any new helpers (e.g., Markdown sanitizers) here before exporting them.
