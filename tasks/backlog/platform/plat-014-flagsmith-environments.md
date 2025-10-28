---
id: TSK-PLAT-014
title: Stand Up Flagsmith Environments & Governance
status: backlog
area: platform
subarea: feature-flags
owner: Platform Engineer
collaborators:
  - Product Manager
  - QA Lead
effort: small
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/feature-flags/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-005-feature-flags.md
  - docs/runbooks/feature-flags-operations.md
  - docs/runbooks/deployment.md
context7:
  - /flagsmith/docs
  - /vercel/next.js
tags:
  - feature-flags
  - governance
  - infrastructure
---

## Summary
Provision Flagsmith projects for dev and prod, define environment defaults, and wire governance workflows so teams can gate features, experiments, and emergency toggles without risking regressions.

## Definition of Ready
- [x] Flag naming/metadata/sunset policy set: use `service.flag_name` with metadata `{owner, created_on, expires_on,ticket}` and 30/60/90-day reviews with weekly stale alerts (TSK-PLAT-002).
- [x] Integration surfaces confirmed: Next.js server/client, background jobs, and Strapi webhooks; server keys remain server-side only.
- [x] Alerting plan defined: weekly stale report to `#product-ops` plus automatic PR to retire flags after 90 days.
- [x] Secrets handling documented: server keys stored in Secrets Manager; client keys in public env files with read-only scope.

## Definition of Done
- [ ] Flagsmith environments created with initial segment and identity configuration plus audit logging enabled.
- [ ] Default flag templates and governance documentation published, including updates to `docs/runbooks/feature-flags-operations.md`; onboarding checklist shared with teams.
- [ ] SDK credentials stored securely and injected into dev and prod builds through CI.
- [ ] Sample feature flag wired into Next.js dev environment behind guard to validate evaluation paths.
- [ ] Follow-up backlog items captured for experimentation dashboards or additional tooling.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
