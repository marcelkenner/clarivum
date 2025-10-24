# Sprint Plans · AGENTS Guide

**Context7:** Always resolve framework or library questions via Context7 (`context7__resolve-library-id` followed by `context7__get-library-docs`).
The `tasks/sprints/` directory captures forward-looking sprint plans. These files summarize scope, goals, and ownership; the canonical source of task status remains the main task board (`tasks/backlog`, `tasks/ready`, `tasks/in-progress`, `tasks/blocked`, `tasks/done`).

## Usage

- Each sprint gets its own subfolder (`sprint-01/`, `sprint-02/`, …) containing a `plan.md` (or similar) that lists objectives, committed tasks, guardrails, and risks.
- Reference task files by relative path (e.g., `../ready/frontend/fe-001-bootstrap-vitest.md`). Do not duplicate or move the actual task files into sprint folders.
- Update the sprint plan whenever scope changes, reflecting Kaizen guardrails and Sisu follow-ups.
- Archive completed sprints in place and add a brief retrospective summary once the sprint closes.

Keep sprint docs concise and link back to the daily Kaizen issues, runbooks, and relevant ADRs/PRDs where needed.
