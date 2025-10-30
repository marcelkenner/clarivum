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
updated_at: 2025-10-28
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
  - /aws/aws-cli
tags:
  - terraform
  - infrastructure
  - devops
---

## Summary
Create and configure the Terraform codebase that provisions AWS foundations (CloudFront, ECS, Aurora, SQS/Lambda/Secrets Manager) per ADR-001 and ADR-003.

## Definition of Ready
- [x] Repository strategy confirmed: dedicated repo `clarivum-infra` with `/modules`, `/stacks/<env>`, `/providers`, and `/pipelines` layout (no submodule) approved by architecture.
- [x] Resource inventory captured covering VPC/subnets/NAT, ECR, ECS/Fargate, RDS Postgres, S3 (assets/state/logs), CloudFront, KMS, Secrets Manager, SQS/SNS, SES, CloudWatch/X-Ray, IAM roles/policies, WAF, API Gateway, Lambda glue, VPC endpoints, Route53, external data stores, and budget alerts with inputs per stack.
- [x] Remote state backend standardized to S3 (`clarivum-tf-state-<account>`) with DynamoDB lock table `clarivum-tf-locks`, SSE-KMS encryption, workspace names `dev|stage|prod`, and state keys `platform/<workspace>/terraform.tfstate`.
- [x] CI workflow defined (`tf-validate`, `tf-plan`, manual `tf-apply`) running fmt/validate/tflint/tfsec/plan, authenticating via GitHub Actions OIDC role `TerraformDeployer`, and storing Slack webhook secrets securely.

## Definition of Done
- [ ] Terraform project scaffolded with remote state configuration committed.
- [ ] Baseline modules for CloudFront/ECS, Aurora, SQS, and Lambda authored and documented.
- [ ] CI workflow validating format/plan merged.
- [ ] Deployment runbook and platform role guide updated with IaC usage instructions.
- [ ] Knowledge-transfer walkthrough scheduled/recorded for engineers.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Ready to move forward once repo structure and resource inventory decisions are documented. Coordinate with cost review owner to set tagging/budgeting conventions.
