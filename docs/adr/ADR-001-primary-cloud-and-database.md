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
- Serve the marketing and member experience from **Amazon S3** behind **CloudFront with Origin Access Control**. Next.js outputs static assets/ISR artefacts to S3; CloudFront owns TLS termination, caching, and global distribution.
- Implement the BFF/API layer with **Amazon API Gateway HTTP APIs** fronting **AWS Lambda (Graviton)** functions. Provisioned concurrency stays disabled by default to keep idle cost near zero; enable only for handlers that breach latency SLOs.
- Adopt a dual-datastore pattern:
  - **Amazon DynamoDB (On-Demand)** for key/value, session, and high-churn data that fits a single-table design.
  - **Amazon Aurora PostgreSQL Serverless v2** (`eu-central-1`, min ACU 0–0.5 depending on engine patch) for relational workloads, row-level security, PITR, and extensions (`pgcrypto`, `pg_stat_statements`).
- Store large assets (ebooks, media) in dedicated **Amazon S3** buckets (public/private pair per environment) with lifecycle policies, surfaced via CloudFront signed URLs.
- Cover editorial CMS needs through an **Amazon Lightsail WordPress bundle** until traffic or customisation requires managed containers.
- Manage infrastructure via Terraform modules under `infra/aws` (edge, api, data, identity). Secrets remain in AWS Secrets Manager and are injected into Lambda through environment variables sourced by GitHub Actions OIDC roles.

## Diagrams
- [Architecture Overview](../diagrams/adr-001-primary-cloud-and-database/architecture-overview.mmd) — (Update in progress) Delivery path across CloudFront, API Gateway/Lambda, DynamoDB, and Aurora/S3.
- [Data Lineage](../diagrams/adr-001-primary-cloud-and-database/data-lineage.mmd) — Key entities for members, content, leads, and entitlements inside Aurora PostgreSQL.
- [UML Service Boundaries](../diagrams/adr-001-primary-cloud-and-database/uml-service-boundaries.mmd) — Runtime collaborators that coordinate deployment and platform automation on AWS.
- [BPMN Provisioning Flow](../diagrams/adr-001-primary-cloud-and-database/bpmn-provisioning.mmd) — Operational workflow for provisioning and validating infrastructure changes via Terraform and GitHub Actions.

## Consequences
- **Upside:** Serverless-first footprint keeps idle cost near zero, scales automatically, and still delivers managed Postgres features alongside DynamoDB elasticity.
- **Risk:** Lambda cold starts can hurt latency-sensitive flows—use provisioned concurrency and warmers judiciously. DynamoDB single-table design demands upfront modelling discipline, and the Lightsail CMS tier will need planned uplift if custom integrations accelerate.
- **Cost:** Baseline spend now centres on CloudFront, API Gateway/Lambda invocations, DynamoDB request units, Aurora ACUs, and SES/Pinpoint usage. Track deltas through AWS Budgets, Cost Anomaly Detection, and the FinOps runbook aligned to Track A.
- **Follow-ups:**
  - Introduce RDS Proxy or pgBouncer when Lambda connection bursts approach Aurora limits.
  - Conduct quarterly DR drills covering Aurora PITR and DynamoDB backup/restore paths.
  - Refresh architecture diagrams and runbooks (deployment, secrets, observability, Lightsail tenancy) to reflect the Track A stack.

## Implementation notes (dev · 2025-10-30)

- VPC `vpc-0bfe1a3458c531a72` with paired public/private subnets bridges CloudFront/S3, Lambda/API Gateway, DynamoDB, and Aurora Serverless v2 (`platform-dev-aurora`).
- CloudFront distribution `EPHSANK5PAPBA` (`d29q7vbsl5v19l.cloudfront.net`, alias `dev.clarivum.com`) fronts S3 buckets `clarivum-dev-static-869603330574` (static web assets) and `clarivum-dev-media-869603330574` (member media); access is mediated via Origin Access Control `E240OSKJ8C4XHZ`, logging to `clarivum-dev-cdn-logs-869603330574`, and routes `api/*` to the HTTP API origin.
- DynamoDB table `platform-dev-kv` (PAY_PER_REQUEST, TTL enabled) and Secrets Manager paths `clarivum/platform/dev/database/*` back Lambda `platform-dev-core`, which is exposed through API Gateway HTTP API `j0cjdyuqti`; the SAR stack `clarivum-platform-dev-database-master-rotation` rotates the Aurora master secret every 30 days.
- No Lightsail instances were provisioned; Strapi continues to run on ECS per ADR‑010, preserving CMS alignment.
