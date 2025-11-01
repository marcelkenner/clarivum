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
  - docs/runbooks/secrets-management.md
  - docs/runbooks/incident-response.md
  - docs/runbooks/feature-flags-operations.md
  - docs/adr/ADR-015-testing-strategy.md
  - docs/adr/ADR-016-ci-cd-platform.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/adr/ADR-004-observability-stack.md
  - docs/adr/ADR-005-feature-flags.md
  - docs/adr/ADR-006-edge-cache-and-rate-limiting-platform.md
  - docs/adr/ADR-007-secrets-management-and-configuration-distribution.md
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
| [`tasks/backlog/platform/plat-014-flagsmith-environments.md`](../../backlog/platform/plat-014-flagsmith-environments.md) | Backlog → Ready → In-progress | Provision Flagsmith projects, naming, alerting, secrets |
| [`tasks/backlog/platform/plat-015-elasticache-platform.md`](../../backlog/platform/plat-015-elasticache-platform.md) | Backlog → Ready → In-progress | Provision ElastiCache Serverless Redis, Cache Gateway, metrics, incident playbook |
| [`tasks/backlog/platform/plat-028-request-security-controls.md`](../../backlog/platform/plat-028-request-security-controls.md) | Backlog → Ready → In-progress | Country denylist, honeypot, telemetry + support comms |
| [`tasks/backlog/platform/plat-034-kaizen-daily-automation.md`](../../backlog/platform/plat-034-kaizen-daily-automation.md) | Backlog → Ready → In-progress | Schedule Kaizen issue creation + confirmations |
| [`tasks/backlog/platform/plat-035-sisu-guardrail-check.md`](../../backlog/platform/plat-035-sisu-guardrail-check.md) | Backlog → Ready → In-progress | Enforce Sisu guardrail links on bug PRs |
| [`tasks/backlog/platform/plat-036-forest-day-scheduler.md`](../../backlog/platform/plat-036-forest-day-scheduler.md) | Backlog → Ready → In-progress | Automate Forest Day issue so improvements stay on calendar |
| [`tasks/backlog/qa/qa-001-playwright-smoke-suite.md`](../../backlog/qa/qa-001-playwright-smoke-suite.md) | Backlog → Ready → In-progress | Automate Skin/Fuel/Habits smoke journeys for CI |

### Stretch

- [`tasks/backlog/platform/plat-048-uv-widget-cache-gateway.md`](../../backlog/platform/plat-048-uv-widget-cache-gateway.md) — extend new Redis infra to UV widget consumers.
- [`tasks/backlog/platform/plat-049-uv-widget-analytics-guardrails.md`](../../backlog/platform/plat-049-uv-widget-analytics-guardrails.md) — baseline Plausible guardrails once caching lands.

## Definition of Success

- Terraform repo + CI/CD guardrails operational with OIDC + Secrets Manager integration.
- Flagsmith environments + governance live with stale alerting and secrets flow documented.
- ElastiCache Serverless Redis provisioned with metrics + fallback plan; UV widget + rate limit consumers ready to integrate.
- Request security middleware enforced with telemetry, support comms, and feature flags controlling rollout.
- Kaizen/Sisu/Forest Day automations running daily/monthly with failure alerts; smoke suite stabilizes <2% flake.
- Documentation (AGENTS, deployment, secrets management, incident response, feature-flag runbooks) reflects new guardrails.

## Dependencies & Prep

- Align remote state backend + IAM naming before Sprint Planning (DevOps + Security).
- Finalize branch protections (required checks list) with engineering leadership.
- Confirm Flagsmith project access + billing before provisioning; prep feature flag metadata templates.
- Reserve ElastiCache capacity plan and document incident contacts.
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
