# Sisu Debugging Runbook

This runbook converts escaped defects or incidents into lasting guardrails within 48 hours. Use it alongside the `#sisu-log` channel, the repository `sisu-log/` folder, the Kaizen Minute ritual, and related tasks in `tasks/`.

## Preconditions

- Incident or escaped bug has been stabilized (hotfix / rollback applied).
- Primary owner and secondary scribe identified.
- Relevant dashboards, alerts, and logs accessible.

## Step-by-Step

1. **Capture the Three W's (<=5 minutes)**
   - *What broke?* Include symptom and impact scope.
   - *Why did it escape?* Identify missing test, limit, alert, or review gap.
   - *Where do we place the guardrail?* Propose the smallest viable prevention step.
   - Log the answers in `#sisu-log`, commit an entry under `sisu-log/`, and append to the incident/task file.
2. **Stabilize ("One-way door first")**
   - Implement or confirm the hotfix/rollback to stop user impact.
   - Record temporary mitigations and owners.
3. **Identify the Overloaded Process**
   - Inspect queues older than 24h (PRs, support tickets, alerts, flaky tests). The oldest backlog is usually the bottleneck.
   - Document which system or ritual saturated and why.
4. **Install Guardrails (<=48h)**
   - Create/merge a guardrail PR (test, static check, alert, limit, script).
   - Update the relevant runbook, policy, or checklist.
   - Link tasks/PRs in the Sisu Log entry and assign follow-up date.
5. **Communicate & Follow Through**
   - Share summary + guardrail link in Sisu Review.
   - Schedule follow-up validation (date owner will confirm the guardrail holds).

## Sisu Log Template

```
SISU DEBUGGING NOTE
Feature/Service:
Incident/Bug:
Impact:
What broke:
Why it escaped:
Guardrail we added (link):
Process bottleneck found:
Owner & due date:
Follow-up check (date):
```

## Outputs & Artifacts

- Updated `#sisu-log` message and corresponding `sisu-log/` markdown entry with links to guardrail PRs and documentation updates.
- Task updates (status, notes) reflecting the guardrail and follow-up.
- Documentation changes (runbooks, policies, checklists) merged.
- Metrics tagged for next weekly scorecard (review latency, change-failure rate, recurrence).

## Escalation

- If a guardrail cannot land within 48h, escalate in `#urgent-oncall` with owner, blocker, and new ETA.
- If multiple guardrails compete for priority, involve the Kaizen Captain / engineering manager to rerank within the improvement hour.

## References

- Root guidance: `AGENTS.md` continuous improvement cadence.
- Orientation guide: `docs/role-guides/continuous-improvement.md`.
- Finland working time flexibility: https://tem.fi/en/working-hours
- Sisu concept primer: https://en.wikipedia.org/wiki/Sisu
