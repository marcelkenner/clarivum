# src/app/docs · AGENTS Guide

Catch-all route group that renders Markdown from `docs/` using the Atrament document styles.

## Build/Test

- Server components only. Rely on `<DocumentScreen root="docs" />` for rendering.
- `npm run lint:code -- src/app/docs src/components/documents src/lib/documents`
- `npm run typecheck`

## Implementation notes

- Do **not** import `fs` or read files directly; always use `getDocument()` from
  `src/lib/documents/get-document.ts`.
- `DocumentScreen` handles table-of-contents anchors and metadata injection. If you need to
  customize behavior, extend that component rather than editing every route.
- Slug segments map directly to files under `docs/`. Keep relative paths aligned with actual
  filenames (respecting case) so deep links and the `/library` index stay in sync.
- When adding MDX features, update `DocumentScreen` + `document-theme.css` so styling stays
  consistent with ADR-018 (brand) and the Atrament typography guidance.
- `assertInternalDocsAccess()` hides this route in production unless `INTERNAL_DOCS_ALLOW=true`.

## Ops

- Revalidation is fixed at 300 seconds. If you need faster docs refresh, update this directory,
  `/library`, and the cache strategy in `list-documents.ts` together, then note it in `AGENTS.md`.
- After adding new doc folders, run `npm run ensure:agents` so subdirectories inherit guidance.*** End Patch
