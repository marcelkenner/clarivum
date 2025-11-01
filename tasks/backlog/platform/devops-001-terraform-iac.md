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
Create and configure the Terraform codebase that provisions AWS foundations (CloudFront, S3 OAC, API Gateway HTTP APIs, Lambda, DynamoDB, Aurora Serverless, Secrets Manager) per ADR-001 and ADR-003.

## Definition of Ready
- [x] Repository strategy confirmed: dedicated repo `clarivum-infra` with `/modules`, `/stacks/<env>`, `/providers`, and `/pipelines` layout (no submodule) approved by architecture.
- [x] Resource inventory captured covering VPC/subnets/NAT, S3 (static + media + state), CloudFront (OAC), API Gateway HTTP APIs, Lambda (Graviton), DynamoDB tables, Aurora Serverless v2, Lightsail WordPress bundle, SES/Pinpoint, CloudWatch/X-Ray, IAM roles/policies, EventBridge rules, VPC endpoints, Route53, and budget alerts with inputs per stack.
- [x] Remote state backend standardized to S3 (`clarivum-tf-state-<account>`) with DynamoDB lock table `clarivum-tf-locks`, SSE-KMS encryption, workspace names `dev|stage|prod`, and state keys `platform/<workspace>/terraform.tfstate`.
- [x] CI workflow defined (`tf-validate`, `tf-plan`, manual `tf-apply`) running fmt/validate/tflint/tfsec/plan, authenticating via GitHub Actions OIDC role `TerraformDeployer`, and storing Slack webhook secrets securely.

## Definition of Done
- [ ] Terraform project scaffolded with remote state configuration committed.
- [ ] Baseline modules for CloudFront/S3 OAC, API Gateway, Lambda, DynamoDB, Aurora Serverless, and EventBridge authored and documented.
- [ ] CI workflow validating format/plan merged.
- [ ] Deployment runbook and platform role guide updated with IaC usage instructions.
- [ ] Knowledge-transfer walkthrough scheduled/recorded for engineers.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.


## Notes
Ready to move forward once repo structure and resource inventory decisions are documented. Coordinate with cost review owner to set tagging/budgeting conventions.

## 2025-11-01 Terraform Dev Reconciliation Design

```mermaid
graph TD
    stack[platform env stack] --> cf[platform-cloudfront]
    cf --> policy[Cache policy input or managed default]
    stack --> cost[platform-cost-controls]
    cost --> sns[SNS subscription (IMMEDIATE)]
    stack --> data[platform-data]
    data --> sse[SSE block optional for imports]
    stack --> storage[platform-storage]
    storage --> owner[Conditional ownership controls]
    stack --> dns[platform-dns]
    dns --> overwrite[allow_overwrite for Squarespace TXT/CNAME]
    stack --> secrets[platform-secrets]
    secrets --> sar[SAR rotation version 1.1.622]
```

**Assumptions**
- Imported resources keep their existing configuration; Terraform must tolerate drift without forcing replacement.
- CloudFront should continue using AWS managed cache behaviour unless a custom policy ARN is supplied.
- Rotation Lambda stays in the same VPC subnets/security groups that already exist for the database access path.

**Acceptance Tests**
1. **Given** the existing anomaly monitor ARN is supplied **when** `terraform plan` runs **then** no validation error occurs because the module requests an `IMMEDIATE` SNS subscription.
2. **Given** the imported DynamoDB table and S3 buckets are already encrypted **when** Terraform evaluates the modules **then** the plan shows no changes to server-side encryption or bucket ownership controls.
3. **Given** Squarespace TXT/CNAME records already exist in Route53 **when** the DNS module applies **then** Terraform updates them in place by using `allow_overwrite` rather than trying to recreate them.
