# src/app/library · AGENTS Guide

Single route that renders the Atrament “library” index. It is a **server component** that wraps
`<DocumentIndex />` (client) in the document styles shell so every PRD/ADR/task/Sisu note is searchable.

## Expectations

- Data must come from `listDocuments()` in `src/lib/documents/list-documents.ts`. Never touch `fs`
  directly from this route and never import that helper in a client component.
- Keep the revalidation window aligned with the docs guardrail (`export const revalidate = 300`).
  Adjust only if `AGENTS.md` + ADRs document the change.
- When you add a new root (e.g., `sisu-log/ops/`), update the root registry in
  `list-documents.ts`, the labels in `DocumentIndex.tsx`, and mention it in `README.md#Documentation map`.
- Style tweaks must reuse the Atrament palette in `src/styles/document-theme.css`. Stronger layout
  changes require sign-off from the brand design ADR (ADR-018).
- Navigation discoverability lives in `src/app/(marketing)/layout.tsx`. Update that header (and any
  other shells) if the library URL changes.

## Local QA

1. `npm run lint:code -- src/app/library src/components/documents src/lib/documents`
2. `npm run typecheck`
3. `npm run dev` → open `/library`, verify search/filter, counts, and links.

Update this file whenever the library gains new behaviors (filters, tags, permissions, etc.).\*\*\* End Patch
