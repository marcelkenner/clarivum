# ADRs · AGENTS Guide

Architecture Decision Records document Clarivum’s significant technical choices. Use this guidance when authoring or updating files in `docs/adr/`.

## Writing a new ADR

1. Copy `_template.md` into a new file named `ADR-0XX-short-slug.md`.
2. Fill in `Date`, `Status` (usually `Proposed` until reviewed), and the required sections (`Context`, `Decision`, `Consequences`).
3. Reference related PRDs, runbooks, or policies to ground the decision.
4. Add “Follow-ups” when additional work remains; track those tasks separately in the issue tracker.
5. Use Context7 to confirm any library/service recommendations before documenting them.

## Updating existing ADRs

- If superseding, mark the old ADR as `Superseded by ADR-0YY` and link to the new record.
- Keep numbering sequential. Do not reuse ADR numbers.
- Update the root `AGENTS.md` or documentation index when major architecture shifts occur.

## Review checklist

- [ ] Decision aligns with PTRD guardrails (`docs/PRDs/first_steps.md`).
- [ ] Impacts to reliability, security, or cost mapped back to runbooks/policies.
- [ ] Links to supporting evidence (benchmarks, RFCs, Context7 references) included.
- [ ] Consequences section clearly states trade-offs and rollback plan.

Treat ADRs as immutable snapshots of decisions—only append amendments or supersede through new records.
