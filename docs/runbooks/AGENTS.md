# Runbooks · AGENTS Guide

Runbooks describe repeatable operational procedures (deployments, incidents, cost reviews). They must stay synchronized with tooling.

## Maintenance expectations

- Update runbooks immediately after process changes or postmortems.
- Include prerequisites, exact commands, decision trees, and escalation paths.
- Keep links to dashboards, alerts, and third-party consoles current.
- Reference originating policies/ADRs and confirm tooling syntax via Context7 when in doubt.
- Maintain `sisu-debugging.md` in lockstep with the Kaizen cadence docs; every Sisu Log entry should map to this runbook’s template and timelines.

## Review checklist

- [ ] Steps are ordered, actionable, and free of ambiguity.
- [ ] Rollback/mitigation paths are documented.
- [ ] Contacts/escalation rules are current.
- [ ] Runbook cross-links to relevant policies and checklists.
