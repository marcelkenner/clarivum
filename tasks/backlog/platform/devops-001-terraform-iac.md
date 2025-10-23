---
id: TSK-PLAT-001
title: Establish Terraform Infrastructure Repository
status: backlog
area: platform
subarea: infrastructure-as-code
owner: DevOps Lead
collaborators: []
effort: medium
created_at: 2025-10-21
updated_at: 2025-10-21
links:
  - docs/PRDs/first_steps.md
  - docs/architecture.md
  - docs/runbooks/deployment.md
  - docs/adr/ADR-001-primary-cloud-and-database.md
  - docs/adr/ADR-003-background-jobs-and-queues.md
context7:
  - /hashicorp/terraform
  - /aws/lambda
  - /aws/sqs
  - /vercel/cli
tags:
  - terraform
  - infrastructure
  - devops
---

## Summary
Create and configure the Terraform codebase that provisions Vercel, Supabase, AWS (SQS/Lambda/Secrets Manager) per ADR-001 and ADR-003.

## Definition of Ready
- [ ] Align repository strategy (`infra/` submodule vs. separate repo) with architecture lead.
- [ ] Inventory required resources and parameters with platform + backend teams.
- [ ] Decide on remote state backend and workspace naming conventions.
- [ ] Confirm CI tooling for `terraform fmt`/`plan` checks and secret storage.

## Definition of Done
- [ ] Terraform project scaffolded with remote state configuration committed.
- [ ] Baseline modules for Vercel, Supabase, SQS, Lambda authored and documented.
- [ ] CI workflow validating format/plan merged.
- [ ] Deployment runbook and platform role guide updated with IaC usage instructions.
- [ ] Knowledge-transfer walkthrough scheduled/recorded for engineers.

## Notes
Ready to move forward once repo structure and resource inventory decisions are documented. Coordinate with cost review owner to set tagging/budgeting conventions.
