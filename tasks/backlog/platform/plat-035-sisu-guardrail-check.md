---
id: TSK-PLAT-035
title: Enforce Sisu Guardrail Checks on Bug Fix PRs
status: backlog
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - QA Lead
  - Backend Lead
effort: small
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/testing-stack/feature-requirements.md
  - docs/adr/ADR-015-testing-strategy.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/runbooks/sisu-debugging.md
  - docs/AGENTS.md
context7:
  - /websites/github_en_actions
  - /octokit/rest.js
tags:
  - sisu
  - ci-cd
  - quality
---

## Summary
Add automation that blocks bug-labelled pull requests unless they reference a Sisu debugging note and a guardrail follow-up, reinforcing the 48-hour guardrail commitment documented in the Sisu playbook.

## Definition of Ready
- [ ] Align enforcement rules (labels, body text, bypass options) with engineering leadership and incident commanders.
- [ ] Confirm Sisu note and guardrail link formats so automation can validate them reliably.
- [ ] Obtain GitHub token permissions for reading PR metadata and failing checks.
- [ ] Draft communication plan for rollout, including documentation updates and owner training.
- [ ] Identify monitoring approach for workflow failures or false positives.

## Definition of Done
- [ ] Workflow `.github/workflows/sisu-on-bug.yml` committed, covering PR opened/edited/synchronized events with clear failure messaging.
- [ ] Unit tests or dry-run logs demonstrating label/body parsing and failure scenarios stored for reference.
- [ ] Docs (`docs/runbooks/sisu-debugging.md`, `docs/AGENTS.md`) updated with enforcement behavior and remediation steps.
- [ ] Alerting wired (e.g., Slack or GitHub notifications) when the workflow fails or cannot parse a PR.
- [ ] Follow-up task opened for extending guardrail validation (e.g., verifying linked guardrail PR status).
