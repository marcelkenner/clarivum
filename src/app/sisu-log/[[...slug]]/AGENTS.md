# src/app/sisu-log/[[...slug]] · AGENTS Guide

Wrapper around `DocumentScreen` for the `sisu-log/` directory.

- Keep component body small — fetch doc via `DocumentScreen` only. All formatting changes belong in
  `DocumentScreen` or `document-theme.css`.
- Footer copy must continue to enforce append-only edits. Update it alongside the root `AGENTS.md`
  Sisu policy if wording changes.
- Validate every new Sisu note by loading `/sisu-log/<filename>` prior to merging.
- Use `npm run lint:code -- src/app/sisu-log src/components/documents` & `npm run typecheck` after
  edits.\*\*\*
