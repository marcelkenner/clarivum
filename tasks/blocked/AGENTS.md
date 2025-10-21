# Blocked Tasks · AGENTS Guide

This column highlights work that cannot advance. Keep entries crisp so leadership can clear the path quickly.

## Required Information
- Describe the blocking issue, the owner responsible for unlocking it, and the target resolution date.
- Record attempts made, evidence gathered, and relevant links (PRs, incidents, vendor tickets).
- Update `updated_at` whenever new context appears; stale blocked items are non-actionable.

## Escalation Rhythm
- Review blocked tasks daily during standups; assign next steps and recap decisions.
- Escalate through the appropriate runbook (`docs/runbooks/incident-response.md`, `docs/runbooks/cost-review.md`, etc.) when SLA thresholds slip.
- Reference Context7 documentation when blockers involve tooling or library gaps so future agents learn quickly.

## Clearing the Blockade
- As soon as the impediment resolves, move the task back to the prior execution lane and note the resolution.
- If the work is deprioritized, return it to `backlog/` with rationale instead of keeping it indefinitely blocked.
