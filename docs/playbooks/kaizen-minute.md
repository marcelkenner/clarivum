# Kaizen Minute Playbook

This playbook explains how to run the daily Kaizen Minute ritual and capture outputs that feed Clarivum's continuous improvement program.

## Daily Workflow

1. Reserve 15 to 20 minutes immediately after the deep-focus block.
2. Post an update in the `#kaizen-minute` Slack channel and the GitHub Kaizen issue opened by automation.
3. Record the slowdown, the smallest guardrail (<=60 minutes of effort), the owner, and the validation method.
4. Open or update a task/guardrail issue referencing the slowdown and the planned fix.
5. Land the guardrail during the improvement hour and link the resulting PR.

### Submission format

```
Slowdown: <one sentence>
Guardrail: <test|script|check|limit|alert> (<=60m)
Owner: <name>
Verification: <metric, test, or log to confirm success>
Links: <tasks, PRs, Sisu notes>
```

## Guardrail Ideas

- Add or tighten a unit test that fails if the bug reappears.
- Introduce a lint rule or formatter tweak to remove a recurring style issue.
- Ship a script that automates a noisy manual step (<=60 minutes to build).
- Add an alert or threshold to catch an incident before it impacts users.

## Scoreboard and Recognition

- Update `tasks/status-summary.md` with weekly counts of Kaizen guardrails merged.
- Call out notable guardrails during the Friday Sisu Review and in the `#kaizen-minute` channel.
- Rotate a Kaizen Captain each sprint to ensure the ritual stays on track.

## Documentation Links

- Root guidance: `AGENTS.md` (sections 5, 6, and 7)
- Continuous improvement guide: `docs/role-guides/continuous-improvement.md`
- Sisu debugging runbook: `docs/runbooks/sisu-debugging.md`
