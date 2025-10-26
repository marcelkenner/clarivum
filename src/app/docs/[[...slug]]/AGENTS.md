# src/app/docs/[[...slug]] · AGENTS Guide

Catch-all server component that proxies Markdown to `<DocumentScreen root="docs" />`.

- Do not add client components or hooks. Rendering must stay server-side so `fs` access remains safe.
- If you need new props (e.g., different footer messaging), add them to `DocumentScreen` and pass them
  here — keep this file as a thin wrapper.
- Keep `export const revalidate = 300` in sync with `/library` and document any changes in `README.md`.
- When adding new root folders under `docs/`, confirm links resolve by loading
  `/docs/path/to/file` locally.
- QA: `npm run lint:code -- src/app/docs src/components/documents` and `npm run typecheck`.*** End Patch
