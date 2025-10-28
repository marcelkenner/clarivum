# src/components/documents · AGENTS Guide

Contains the Atrament documentation components:

- `DocumentScreen` (server) renders Markdown using `react-markdown` + `remark-gfm`
- `DocumentIndex` (client) builds the searchable list for `/library`

## Practices

- `DocumentScreen` must stay server-only. Never add `use client` or hooks that would force
  `react-markdown` + `fs` helpers into the browser.
- Heading parsing, slug generation, and TOC behavior belong in `DocumentScreen`. If you need new
  elements (callouts, alerts), add them here so all doc surfaces benefit.
- For any new Markdown feature, update both the renderer and `src/styles/document-theme.css` so the
  Atrament typography stays consistent.
- `DocumentIndex` is the single client surface; keep it lightweight (search filter only) and avoid
  direct filesystem imports. All data should arrive via props from `/library`.
- Commands: `npm run lint:code -- src/components/documents src/lib/documents`, `npm run typecheck`.

Document these rules before adding more component families (e.g., doc editor).\*\*\* End Patch
