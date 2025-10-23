# Tasks · AGENTS Guide

This directory holds the Clarivum task board (backlog → ready → in-progress → blocked → done). Maintain it diligently so everyone has accurate visibility.

## Structure

- Status columns live in subfolders (`backlog/`, `ready/`, `in-progress/`, `blocked/`, `done/`).
- Each status folder contains discipline lanes (`frontend`, `backend`, `platform`, `qa`, `business`, `shared`).
- Task files use Markdown with YAML front matter at the top.
- Naming convention: `<prefix>-<sequence>-<slug>.md` (e.g., `fe-001-bootstrap-vitest.md`). Suggested prefixes: `fe`, `be`, `plat`, `qa`, `biz`, `ops`, `shared`.
- Do not create a task until the governing PRD is approved and the related ADR is accepted (see `docs/policies/work-intake-workflow.md`).

## Front matter schema

Every task **must** start with:

```yaml
---
id: TSK-<AREA>-NNN
title: <Concise title>
status: <backlog|ready|in-progress|blocked|done>
area: <frontend|backend|platform|qa|business|shared>
subarea: <discipline-specific category>
owner: <Primary owner>
collaborators: [<optional list>]
effort: <tiny|small|medium|large>
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
links: [<docs/PRDs/...>, <docs/adr/...>, ...]
context7: [</vercel/next.js>, </supabase/supabase>, ...]
tags: [<keyword>, ...]
---
```

- `links` entries must include at least one PRD (`docs/PRDs/...`) and one ADR (`docs/adr/...`) governing the work.

## Body requirements

- `## Summary` — one paragraph describing the outcome/user value.
- `## Definition of Ready` — checklist aligned with stakeholders.
- `## Definition of Done` — checklist covering tests, docs, sign-offs.
- Optional: `## Notes`, `## Risks`, `## Follow-ups`.
- Keep checklists actionable and reference source documents.

## Workflow

1. Add new tasks in the appropriate status/area with full metadata and checklists once PRD + ADR prerequisites are met.
2. Move files between folders via pull request when status changes (update `status`, `updated_at`, and notes).
3. Use `npm run lint:tasks` to validate files; CI will fail if schema or structure is incorrect.
4. Run `npm run tasks:summary` to regenerate `tasks/status-summary.md` before sharing updates.
5. Archive completed work under `done/<area>/` with outcomes captured.

Keep this board current so planning, delivery, and retrospectives stay effortless.
