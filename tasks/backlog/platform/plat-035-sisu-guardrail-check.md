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
- [ ] Enforcement rules confirmed (PRs labeled `bug` must link Sisu incident/bug ID plus guardrail follow-up; failing test or metric link required).
- [ ] Link formats captured with regex patterns documented for automation validation.
- [ ] Workflow permissions scoped to `checks: write`/`pull-requests: write` using GitHub OIDC (no repo-wide PAT).
- [ ] Communication + monitoring plan prepared (playbook update, announcement post, weekly bypass report owners).

## Definition of Done
- [ ] Workflow `.github/workflows/sisu-on-bug.yml` committed, covering PR opened/edited/synchronized events with clear failure messaging.
- [ ] Unit tests or dry-run logs demonstrating label/body parsing and failure scenarios stored for reference.
- [ ] Docs (`docs/runbooks/sisu-debugging.md`, `docs/AGENTS.md`) updated with enforcement behavior and remediation steps.
- [ ] Alerting wired (e.g., Slack or GitHub notifications) when the workflow fails or cannot parse a PR.
- [ ] Follow-up task opened for extending guardrail validation (e.g., verifying linked guardrail PR status).
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
