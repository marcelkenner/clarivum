# tasks/wip · AGENTS Guide

Represents the “actively being shaped” lane for tasks that haven’t entered execution yet. Use it to capture rough notes, blockers, or coordination tasks that exceed the 15-minute Kaizen window but aren’t ready for `tasks/in-progress/**`.

## Usage guidelines
- File names follow `<area>-<sequence>-<slug>.md` (mirror `tasks/backlog/**`). Keep metadata up to date (`status: wip`, `owner`, `updated_at`).
- Move a task to `tasks/in-progress/<area>/` once scope, Definition of Ready, and schedule are confirmed. Delete the WIP copy to avoid drift.
- Cross-link to roadmap entries or Kaizen issues so reviewers can trace context quickly.

## Hygiene
- Run `npm run lint:tasks` after editing to validate front matter.
- Update `tasks/status-summary.md` if the task materially changes scope or owner.
- Document unresolved questions in the “Open Questions” section; never leave TODOs in free-form text without owner/date.

Context references: `docs/PRDs/first_steps.md`, `docs/role-guides/continuous-improvement.md`, and any relevant ADRs. Resolve library/framework topics via Context7 as usual.
