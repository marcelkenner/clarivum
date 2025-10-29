---
id: TSK-PLAT-054
title: Design Strapi Canary Release Strategy
status: backlog
area: platform
subarea: ci-cd
owner: DevOps Lead
collaborators:
  - Editorial Engineering
  - Reliability Lead
effort: small
created_at: 2025-10-29
updated_at: 2025-10-29
links:
  - docs/PRDs/requierments/strapi/setup.md
  - docs/adr/ADR-010-content-management-platform.md
  - docs/runbooks/deployment.md
context7:
  - /strapi/documentation
  - /terraform-aws-modules/terraform-aws-ecs
  - /websites/github_en_actions
tags:
  - release
  - guardrail
  - automation
---

## Summary
Define and implement a canary rollout mode for Strapi so new container images receive live traffic from a limited slice of users before full promotion. The goal is to codify traffic shifting, automated metrics evaluation, and rollback triggers inside the existing GitHub Actions + ECS workflow.

## Definition of Ready
- [ ] Align on canary blast radius, success metrics, and rollback expectations with Editorial Engineering and product stakeholders.
- [ ] Validate that infrastructure prerequisites (ALB target groups, weighted routing, or ECS deployment configuration) support traffic splitting without downtime.
- [ ] Update deployment runbook outline with the target canary flow and observers to notify.

## Definition of Done
- [ ] Canary deployment stage added to `.github/workflows/strapi-ci-cd.yml` with automated promotion/abort logic based on agreed health metrics.
- [ ] Runbooks/AGENTS docs updated with the canary checklist, escalation path, and manual override steps.
- [ ] Observability dashboards/alerts cover canary success and rollback signals (latency, error rate, admin UX checks).
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
