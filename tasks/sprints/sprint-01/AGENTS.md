# tasks/sprints/sprint-01 · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` → `context7__get-library-docs`).

## Scope
- `plan.md` is the single source of truth for Sprint 01 schedule, commitments, and theme; keep the front matter (`id`, `title`, `status`, `start`, `end`, `updated_at`, `links`) aligned with the latest plan.
- Maintain the Markdown sections (Sprint Goal/Theme, Committed Scope, Stretch, Definitions, Dependencies, Risks) as a living document; update them whenever tasks shift lanes or Kaizen guardrails change.
- Ensure the `links` block references the PRDs/ADRs that justify the sprint focus; add new entries instead of inlining long explanations.

## Editing Workflow
- Link tasks via relative paths (e.g., `../../backlog/...`) and keep the status lane column synced with the task board.
- When scope changes, adjust both the Committed Scope table and the Definition of Success bullets so reviewers understand the impact.
- Reflect material updates in `docs/roadmaps/engineering-roadmap-2025-2026.md` (Nov–Dec 2025 section) to keep roadmap and sprint plan synchronized.
- After the sprint closes, append a short retrospective summary plus follow-up guardrail/task references before archiving.

## Validation
- Run `npm run lint:tasks` after edits to confirm metadata consistency.
- Run `npm run tasks:summary` to verify the sprint plan aligns with task board totals; include the diff in the PR description when scope moves.
- Run `npm run validate` if roadmap or documentation files change alongside the sprint plan.

## Coordination
- Announce scope or schedule shifts in the sprint’s Slack channels listed in `plan.md` and log guardrail owners in the daily Kaizen issue.
- Capture any new incident learnings in `sisu-log/` and link them from the plan.
- Align with product/ops partners on review deadlines and demo expectations so the sprint goal remains realistic.
