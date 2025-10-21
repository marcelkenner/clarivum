# Ready Tasks · AGENTS Guide

The ready column contains initiatives that are fully refined, resourced, and waiting to start. Treat it as the single source of truth for sprint planning.

## Entry Requirements
- Definition of Ready is complete: scope, acceptance criteria, dependencies, and success metrics are unambiguous.
- Owners, collaborators, and due dates are populated; supporting docs and Context7 references are current.
- Risk, security, and accessibility considerations are addressed or explicitly waived by stakeholders.

## Maintenance Checklist
- Keep checklist items synchronized with CI/lint expectations and update `updated_at` whenever details change.
- If new information surfaces, either refresh the DoR or send the task back to `backlog/` with rationale.
- Confirm downstream lanes (platform, QA, analytics) understand upcoming hand-offs before sprint kick-off.

## Cadence
- Review this column during sprint planning; prioritize based on impact, urgency, and capacity.
- Remove tasks that start execution immediately by moving them to the `in-progress/` lane.
