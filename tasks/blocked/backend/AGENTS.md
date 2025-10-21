# Blocked · Backend Lane · AGENTS Guide

Backend work pauses here when dependencies or issues prevent progress.

## Document the Blocker
- Describe the technical issue (failing integration, schema contention, missing approval) and attach supporting evidence.
- Identify the teams or individuals needed to unblock; include Slack channels or tickets.
- Log temporary mitigations attempted and their outcomes.

## Escalation Tactics
- Reference relevant ADRs or architecture docs to justify the desired resolution path.
- Ping platform/SRE/security partners when the blocker threatens reliability or compliance.
- Use Context7 docs to confirm whether alternative libraries or patterns could sidestep the issue.

## Exiting the Lane
- Once unblocked, move the task back to `in-progress/backend` with a note on what changed.
- If the work loses priority, return it to `backlog/backend` so the blocked column stays actionable.
