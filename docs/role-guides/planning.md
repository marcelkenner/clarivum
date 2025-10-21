# Planning & Task Intake Guide

Use this guide to break initiatives into cross-functional tasks that flow smoothly through the Clarivum board.

## Principles

1. **Start with outcomes**: Anchor every task to a user + business result documented in PRDs (`clarivum_brand.md`, `first_steps.md`).
2. **Slice vertically when feasible**: Prefer tasks that deliver end-to-end value (frontend + backend + analytics) behind a feature flag, rather than siloed layers.
3. **Expose dependencies explicitly**: When work must split, create sibling tasks (e.g., `fe-`, `be-`, `plat-`) with cross-links and shared Definition of Done items.
4. **Keep DR/DoD objective**: Each task’s checklists must be testable and reference authoritative docs/Context7 sources.
5. **Document rituals**: Sprint planning, backlog refinement, and release reviews must update the task board and summary.

## Workflow

1. **Intake**
   - Capture idea or requirement changes in the relevant PRD/ADR first.
   - Draft a task in `tasks/backlog/<area>/` with complete front matter and checklists.
   - Tag related tasks in the `notes` section and list shared dependencies.
2. **Refinement**
   - Apply the Definition of Ready checklist with stakeholders (product, design, engineering, QA, security).
   - Split work by discipline when needed:
     - `frontend` for App Router, UI, and accessibility.
     - `backend` for APIs, data modeling, background jobs.
     - `platform` for infrastructure, CI/CD, observability.
     - `qa` for automation and validation.
     - `business` for documentation, analytics, go-to-market.
     - `shared` for multi-team spikes or decision records.
   - Ensure cross-task dependencies are noted in each file.
3. **Planning**
   - Move tasks to `ready/` once DR is satisfied.
   - During sprint planning, select tasks by status and area. Record responsible owner and target sprint in the body.
   - Update `tasks/status-summary.md` via `npm run tasks:summary` and share in `#clarivum-dev`.
4. **Delivery**
   - Move tasks across status folders as work progresses; update metadata, branch/PR links, and notes.
   - Keep DoD checklists aligned across dependent tasks (e.g., ensure telemetry and QA sign-offs exist). Use `npm run lint:tasks` before merges.
5. **Review & retrospectives**
   - Collect outcomes from `done/` tasks for sprint reviews. Highlight metrics, learnings, and follow-up items.
   - Log improvement ideas as new backlog tasks with clear owners.

## Task decomposition checklist

- [ ] Problem statement + user benefit recorded.
- [ ] Success metrics identified (conversion, latency, cost, error budgets, etc.).
- [ ] Dependencies (design assets, API availability, infrastructure) enumerated.
- [ ] Security/privacy implications noted (consult `docs/policies/security-baseline.md`).
- [ ] Testing/observability requirements defined (Vitest, Playwright, OTel).
- [ ] Documentation updates listed (PRDs, runbooks, guides).
- [ ] Rollout + measurement plan (feature flags, dashboards) captured.

## Meeting cadence suggestions

| Ceremony | Frequency | Purpose | Outputs |
| --- | --- | --- | --- |
| Backlog grooming | Weekly | Validate readiness, split tasks, surface gaps | Updated backlog entries, decision notes |
| Sprint planning | Bi-weekly | Commit to ready tasks and capacity | Owners assigned, `ready/` → `in-progress` moves |
| Stand-ups / async updates | Daily | Track progress, surface blockers | Task file `Notes`/`Blockers` updated |
| Reliability review | Monthly | Inspect SLOs, cost, incidents | New tasks for remediation, policy updates |
| Retro | Every sprint | Capture wins & improvements | Follow-up tasks in backlog/shared |

## Tooling reminders

- `npm run lint:tasks` — verify schema, naming, DR/DoD structure before merging.
- `npm run tasks:summary` — regenerate `tasks/status-summary.md` for stakeholder updates.
- Context7 lookups (`context7__resolve-library-id` + `context7__get-library-docs`) should back any external guidance embedded into tasks.

Keep this guide evolving with the team’s needs. If a planning pain point emerges, document the fix here and add a supporting task.
