# Blocked · Platform Lane · AGENTS Guide

Platform work lands here when infrastructure, tooling, or vendor issues halt progress.

## Document the Issue
- Detail the failing component (CI pipeline, secret rotation, cloud resource) and the observed symptoms.
- Link to monitoring dashboards, incident tickets, or vendor cases that track resolution.
- Identify the remediation owner and set a target recovery time.

## Unblock Strategies
- Engage SRE, security, or finance partners early if the blocker affects compliance or budget.
- Capture temporary mitigations (feature flags, manual scripts) and associated risks.
- Reference Context7 for alternative tooling guidance; log any recommendations for future ADR updates.

## After Unblocking
- Return the task to `in-progress/platform` with a concise resolution summary.
- If the effort must be replanned, move it to `backlog/platform` with updated context.
