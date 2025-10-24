# Documentation · AGENTS Guide

Agents editing the `docs/` tree should follow this guidance to keep Clarivum’s documentation authoritative and consistent.

## Orientation

- Start at `docs/README.md` for the documentation map.
- `docs/PRDs/` contains product, brand, and architecture readiness artifacts. Coordinate with stakeholders before major edits.
- `docs/architecture.md` mirrors the current C4 view; update it whenever components, data flows, or SLO alignments change.
- Architecture decisions live in `docs/adr/`. New decisions require a dedicated ADR using `_template.md`; superseded ones must link forward/backward.
- Role-specific playbooks live in `docs/role-guides/`; update those when process changes affect a discipline.
- The continuous improvement cadence and vocabulary reside in `docs/role-guides/continuous-improvement.md`; keep it paired with the root `AGENTS.md` guidance and the `docs/runbooks/sisu-debugging.md` playbook.
- Ritual playbooks live in `docs/playbooks/` (`kaizen-minute.md`, `metsa-cadence.md`); update them whenever the cadence or metrics change.
- **Use Context7 for any library or platform references** so documentation cites current guidance.
- Point to `tasks/README.md` whenever documentation work generates actionable follow-ups and keep `tasks/status-summary.md` updated for stakeholders.
- Reference `docs/role-guides/planning.md` when introducing new workflows or ceremonies.

## Editing guidelines

- Keep documentation in Markdown with ASCII characters unless a PRD already includes localized content (e.g., Polish terms).
- Reference sources explicitly (PTRD sections, ADR IDs, runbooks) so humans can trace changes.
- When updating a policy or runbook, cross-link related documents (deployment, incident response, cost review).
- Maintain checklists and tables for quick scanning; avoid duplicating content across docs—link instead. Each topic must have a single ADR as its source of truth, with PRDs and runbooks pointing to it.
- Enforce the sequencing defined in `docs/policies/work-intake-workflow.md` whenever you add or update documentation.
- Validate diagram coverage with `npm run lint:diagrams` before opening a PR; the linter blocks merges when ADRs lack required artifacts.
- Run `npm run lint:docs` before submitting doc changes to confirm PRDs ↔ ADRs ↔ tasks remain connected.
- Update Kaizen/Sisu artifacts together: the playbook (`docs/role-guides/continuous-improvement.md`), Sisu Debugging runbook, `tasks/status-summary.md`, and Slack channels `#kaizen-minute` / `#sisu-log` must stay in sync when cadence or metrics change.

## Key documents & triggers

- **PRD updates:** Align with `docs/PRDs/first_steps.md` exit criteria before coding work begins.
- **Runbooks:** `docs/runbooks/` covers deployment, incident response, and cost reviews. Modify when operational procedures change.
- **Policies:** `docs/policies/` (error budget, security baseline) inform CI gates and on-call responses. Update alongside code or process changes.
- **Checklists:** `docs/checklists/pull-request.md` must mirror CI expectations.

## Review checklist for doc changes

- [ ] Cross-checked context with the latest ADRs and PTRD sections.
- [ ] Updated related docs and links to avoid drift.
- [ ] Included effective date or version markers where relevant.
- [ ] Noted required follow-up actions (e.g., schedule runbook training).
- [ ] Verified references via Context7 when citing external libraries or APIs.

Keep this file current as the documentation set evolves. If you add new directories under `docs/`, either extend this automation or provide localized guidance.
