# ADR-001: Primary Cloud & Database Platform
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum’s first release is a content-heavy marketing and education experience built on Next.js App Router.
- We need globally cached delivery for anonymous visitors, plus secure sessions for members and editors.
- The data model comprises structured taxonomies, lead records, and entitlement metadata that must support relational queries, auditing, and row-level security.
- The engineering team is small (≤4 engineers) and must bias toward managed services with EU residency to satisfy GDPR for the Poland-first launch.
- Product requirements tracked in `docs/PRDs/first_configuration.md` and infrastructure milestones captured in `tasks/backlog/platform/devops-001-terraform-iac.md`.

## Decision
- Host the web application on **AWS CloudFront + ECS Fargate** with two persistent environments (`dev`, `prod`). GitHub Actions builds and pushes container images to ECR; deployments update the ECS service through blue/green rollouts. Preview builds launch as short-lived ECS services in the dev account.
- Terminate HTTPS at CloudFront, forward to an **Application Load Balancer** inside the platform VPC, and run the Next.js runtime on Fargate tasks behind that ALB. Build artifacts and static assets are published to S3 and served through CloudFront.
- Use **Amazon Aurora PostgreSQL (Serverless v2)** as the primary transactional database (region: `eu-central-1`) with PITR, row-level security, audit extensions (`pgcrypto`, `pg_stat_statements`), and Secrets Manager rotation.
- Store large assets (ebooks, media) in **Amazon S3** buckets (public/private pair per environment) with lifecycle policies; expose them via CloudFront signed URLs.
- Manage infrastructure via Terraform modules under `infra/aws` (app, data, network) and `infra/strapi`. Secrets reside in AWS Secrets Manager with rotation pipelines orchestrated by GitHub Actions.

## Diagrams
- [Architecture Overview](../diagrams/adr-001-primary-cloud-and-database/architecture-overview.mmd) — (Update in progress) Delivery path across CloudFront, the Next.js ECS service, and Aurora/S3.
- [Data Lineage](../diagrams/adr-001-primary-cloud-and-database/data-lineage.mmd) — Key entities for members, content, leads, and entitlements inside Aurora PostgreSQL.
- [UML Service Boundaries](../diagrams/adr-001-primary-cloud-and-database/uml-service-boundaries.mmd) — Runtime collaborators that coordinate deployment and platform automation on AWS.
- [BPMN Provisioning Flow](../diagrams/adr-001-primary-cloud-and-database/bpmn-provisioning.mmd) — Operational workflow for provisioning and validating infrastructure changes via Terraform and GitHub Actions.

## Consequences
- **Upside:** Single-cloud footprint simplifies networking, secrets, and compliance; Aurora delivers native Postgres capabilities (indexes, RLS, extensions) with managed HA. CloudFront keeps global latency low without Vercel vendor lock-in.
- **Risk:** AWS operational surface area is larger (ECS, CloudFront, Aurora, Secrets Manager). Invest in Terraform guardrails, runbooks, and observability to avoid hidden toil. Loss of Vercel previews requires purpose-built preview automation.
- **Cost:** Baseline spend spans CloudFront, ECS Fargate, Aurora, and S3. Track usage via AWS Budgets and surface spend deltas in the FinOps runbook.
- **Follow-ups:**
  - Implement connection pooling (RDS Proxy or pgBouncer) when concurrent requests exceed 50.
  - Conduct quarterly DR drills to validate Aurora PITR and documented RPO/RTO targets.
  - Refresh diagrams and runbooks (deployment, secrets, observability) to reflect the AWS stack.
