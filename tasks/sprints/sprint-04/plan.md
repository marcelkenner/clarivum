---
id: sprint-04
title: Sprint 04 Plan
status: planned
start: 2026-01-06
end: 2026-01-17
updated_at: 2025-10-27
links:
  - docs/AGENTS.md
  - docs/runbooks/deployment.md
  - docs/adr/ADR-015-testing-strategy.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/playbooks/kaizen-minute.md
  - docs/runbooks/sisu-debugging.md
---

# Sprint 04 Plan (Winter Weeks 1–2)

- **Window:** 2026-01-06 → 2026-01-17  
- **Sprint Goal:** Finish the reliability guardrails (IaC, CI/CD, Kaizen/Sisu automation, smoke suite) required to scale Winter hardening work.  
- **Theme:** “Reliability runway” — lock in infrastructure automation so future Ops Hub and revenue work stands on solid ground.  
- **Owners:** DevOps Lead, QA Lead, Observability Champion  
- **Slack check-ins:** `#clarivum-dev`, `#clarivum-platform`, `#qa`, `#kaizen-minute`

## Committed Scope

| Task | Status Lane | Notes |
|------|-------------|-------|
| [`tasks/backlog/platform/devops-001-terraform-iac.md`](../../backlog/platform/devops-001-terraform-iac.md) | Backlog → Ready → In-progress | Stand up shared Terraform repo, remote state, baseline modules |
| [`tasks/backlog/platform/devops-004-ci-cd-foundation.md`](../../backlog/platform/devops-004-ci-cd-foundation.md) | Backlog → Ready → In-progress | GitHub Actions quality gates + preview deploy requirement |
| [`tasks/backlog/qa/qa-001-playwright-smoke-suite.md`](../../backlog/qa/qa-001-playwright-smoke-suite.md) | Backlog → Ready → In-progress | Automate Skin/Fuel/Habits smoke journeys for CI |
| [`tasks/backlog/platform/plat-034-kaizen-daily-automation.md`](../../backlog/platform/plat-034-kaizen-daily-automation.md) | Backlog → Ready → In-progress | Schedule Kaizen issue creation + confirmations |
| [`tasks/backlog/platform/plat-035-sisu-guardrail-check.md`](../../backlog/platform/plat-035-sisu-guardrail-check.md) | Backlog → Ready → In-progress | Enforce Sisu guardrail links on bug PRs |
| [`tasks/backlog/platform/plat-036-forest-day-scheduler.md`](../../backlog/platform/plat-036-forest-day-scheduler.md) | Backlog → Ready → In-progress | Automate Forest Day issue so improvements stay on calendar |

### Stretch

- Add `tasks/backlog/platform/devops-002-stale-flag-monitor.md` if Terraform+CI wraps early; same automation family.
- Pilot `tasks/backlog/platform/plat-034` enhancements (multi-timezone) once MVP runs for a week.

## Definition of Success

- Terraform repo provisions Vercel, Supabase, AWS primitives with documented runbooks and CI `plan` guardrails.
- CI/CD workflows gate every PR with lint, typecheck, Vitest, Playwright smoke, and preview deploy status.
- Kaizen, Sisu, and Forest Day automations create issues without manual effort; alerts fire on failures.
- Smoke suite stabilizes at <2% flake rate and posts traces/screenshots for triage.
- Documentation updates merged (AGENTS, deployment runbook, testing strategy) describing the guardrails for downstream teams.

## Dependencies & Prep

- Align remote state backend + IAM naming before Sprint Planning (DevOps + Security).
- Finalize branch protections (required checks list) with engineering leadership.
- Confirm QA data + credentials for Playwright flows; stage environment seeded.
- Slack/webhook destinations for automation success/failure vetted with ProdOps.

## Risks & Mitigations

- **Terraform scope creep** → focus on shared modules + staging env; file follow-up tasks for prod scaling.
- **Playwright flake** → enforce deterministic data/flags, add retry-once pattern, capture traces for triage.
- **Automation tokens** → pre-request `repo` + `issues:write` scopes; add monitors for rate limits.

## Key Dates

- **Sprint Planning:** 2026-01-06 (morning, deep-work safe)  
- **Mid-sprint guardrail demo:** 2026-01-13 (async video)  
- **Retro + Kaizen showcase:** 2026-01-17

---

Winter sprint 04 sets the baseline for every subsequent Winter sprint: Terraform + CI/CD outputs become inputs for Ops Hub work in Sprint 05, while Kaizen/Sisu automation provides the flow data needed for quarterly metrics.
