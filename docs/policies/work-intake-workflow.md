# Work Intake Workflow Policy

This policy defines the sequencing for product discovery, architectural decisions, delivery planning, and operational readiness. Follow these steps for every net-new initiative or material change so we never ship work without an aligned PRD, ADR, and runbook.

## 1. Opportunity intake → PRD

1. Capture the customer or business problem in a Feature Requirements document under `docs/PRDs/`.
2. Required fields:
   - Objective, outcomes, and personas.
   - Experience principles and constraints.
   - Functional and non-functional requirements.
3. Review cadence:
   - Product + engineering leads co-review the draft.
   - Mark status in the PRD header (`status: draft|approved|retired`).
4. No task or ADR work starts until the PRD is approved.

## 2. Architecture Decision Record

1. For each platform, integration, or schema decision, author an ADR under `docs/adr/`.
2. Prerequisites:
   - Reference the approved PRD in the ADR context section.
   - Capture alternatives considered and the chosen path.
   - Outline implementation constraints, data contracts, and compliance impact.
3. Status flow: `proposed` → review (product + engineering + stakeholders) → `accepted`.
4. Only accepted ADRs unlock delivery tasks. Supersede older ADRs rather than mutating history.

## 3. Delivery task gating

1. Create tasks under `tasks/<status>/<discipline>/` **after** the ADR is accepted.
2. Task front matter **must** include:
   - `links:` pointing to the governing PRD and ADR (`docs/PRDs/...`, `docs/adr/...`).
   - `context7:` entries for any external references pulled from the tool.
3. Definition of Ready checklist:
   - PRD link, ADR link, acceptance criteria, analytics or observability updates.
4. Definition of Done checklist:
   - Code + tests + docs updated.
   - Runbook updates complete (see next section).
   - Feature flag strategy captured if applicable.
5. Moving a task to `ready` or `in-progress` without both links is a governance violation.

## 4. Runbooks and operational collateral

1. Determine runbook scope while the ADR is under review; draft outline in parallel.
2. Before a task exits `in-progress`, ensure:
   - Runbooks under `docs/runbooks/` cover deployment, QA, monitoring, rollback.
   - Policies/checklists updated if responsibilities change.
   - Links back to the ADR for context.
3. If no runbook changes are needed, document that decision in the task `Notes` section.

## 5. Change management

- PRD updates that affect scope require a corresponding ADR update or new ADR entry.
- ADR amendments must reference the PRD section they modify and link to impacted tasks.
- Tasks already in flight must be updated with new links and re-run through Definition of Ready if the ADR changes materially.
- Runbooks stay synchronized; add a changelog entry noting the ADR revision.

## 6. Enforcement & tooling

- `npm run lint:docs` ensures every PRD references an ADR, every ADR references a PRD, and both are linked by at least one task (forward/backward traceability).
- `npm run lint:tasks` blocks tasks that lack PRD/ADR links or required metadata; governance reviewers verify links during PR reviews.
- The pull-request template requires PRD + ADR references.
- CI fails if ADR or PRD files exceed 500 lines or drift from templates (enforced via lint rules—see roadmap task `TSK-PLAT-011`).

## 7. Exceptions

- Incidents follow the incident-response runbook; document temporary deviations and retroactively produce or update PRDs/ADRs within 48 hours.
- Minor copy tweaks that do not change requirements or architecture may reference an existing PRD/ADR without new documents—note the rationale in the task.

Everyone is responsible for upholding this workflow. If gaps appear, flag them in `#clarivum-dev` and propose fixes via PRD/ADR updates.
