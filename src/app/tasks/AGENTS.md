# src/app/tasks · AGENTS Guide

Renders Markdown from the `tasks/` board using the Atrament document styles (`DocumentScreen root="tasks"`).

## Guardrails

- Every task change merged under `tasks/` should be reachable via `/tasks/<path>` and listed inside
  `/library`. Validate links manually when touching new subfolders.
- Keep all logic server-side. The route imports only `DocumentScreen`; task data must come from the
  filesystem at request time.
- Update `tasks/README.md` or `tasks/status-summary.md` together with UI tweaks if behavior or paths
  change.
- Production access is disabled by default via `assertInternalDocsAccess()`. Set
  `INTERNAL_DOCS_ALLOW=true` only when the documentation should be temporarily exposed.

## Local checks

```bash
npm run lint:code -- src/app/tasks src/components/documents src/lib/documents
npm run typecheck
npm run dev   # open /tasks/backlog/... to verify breadcrumbs + metadata
```

Extend this guide if we add task-specific filters, metadata, or query params.*** End Patch
