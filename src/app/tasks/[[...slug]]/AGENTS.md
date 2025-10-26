# src/app/tasks/[[...slug]] · AGENTS Guide

Thin server wrapper for `<DocumentScreen root="tasks" />`.

- Keep this file declarative: do not introduce client components, loaders, or custom logic here.
- Footer hint should continue to remind contributors about Kaizen/Sisu guardrail requirements. Update
  it only when the process changes.
- Any slug parsing change must be reflected in `/library` so task links remain discoverable.
- QA checklist: `/tasks/<lane>/<file>` renders with accurate breadcrumb + file metadata, and the
  underlying Markdown stayed append-only when required (e.g., `done/`).
- Run `npm run lint:code -- src/app/tasks src/components/documents` plus `npm run typecheck`.*** End Patch
