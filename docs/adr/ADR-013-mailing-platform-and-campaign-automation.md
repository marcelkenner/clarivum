# ADR-013: Mailing Platform & Campaign Automation
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum requires owned audiences for lifecycle messaging (welcome drips, product education, retention nudges) without relying on third-party SaaS lock-in.
- Subscription and lead funnels must sync with marketing emails while respecting GDPR (EU residency, consent capture, right-to-erasure).
- The engineering team is small; mailing infrastructure must be simple to operate, scriptable via Terraform, and integrate with existing Supabase/Flagsmith data flows.
- Campaign tooling needs robust segmentation, template management, bulk send performance, and API hooks for transactional sends (e.g., ebook delivery receipts).
- Newsletter and lifecycle requirements are defined in `docs/PRDs/requierments/newsletter/feature-requirements.md`.

## Decision
- Adopt **Listmonk** (`/knadh/listmonk`) as the self-hosted newsletter and campaign platform.
  - Deploy the official Docker image on **AWS ECS Fargate (eu-central-1)** managed via Terraform modules; leverage the single-binary runtime highlighted in Listmonk docs for simplified container ops.
  - Provision a dedicated **Amazon RDS Postgres** instance for Listmonk to avoid contention with Supabase and enable independent scaling.
  - Store configuration and SMTP credentials (Amazon SES + future providers) in AWS Secrets Manager (per ADR-007) and mount via task definitions.
- Build an integration layer:
  - `MailingCoordinator` (Coordinator) bridges application events to Listmonk via its REST API, handling audience sync, consent updates, and double opt-in flows.
  - `AudienceSyncManager` ensures nightly reconciliation between Supabase profiles and Listmonk subscribers, respecting granular consent flags.
  - Webhooks from Listmonk feed back delivery/bounce events into Supabase for analytics and suppression logic.
- Manage deployments using Docker Compose locally and Terraform-driven pipelines in CI; use rolling updates to minimize downtime.
- Enforce GDPR compliance: store consent proofs, enable audience exports/deletions via automated scripts, and host backups within EU S3 buckets.

## Diagrams
- [Architecture Overview](../diagrams/adr-013-mailing-platform-and-campaign-automation/architecture-overview.mmd) — Supabase/Flagsmith integrations with Listmonk on ECS and SES delivery.
- [Data Lineage](../diagrams/adr-013-mailing-platform-and-campaign-automation/data-lineage.mmd) — Subscriber, consent, campaign, and event relationships.
- [UML Service Layer](../diagrams/adr-013-mailing-platform-and-campaign-automation/uml-services.mmd) — Coordinator, audience sync, webhook, and template collaborators.
- [BPMN Campaign Flow](../diagrams/adr-013-mailing-platform-and-campaign-automation/bpmn-campaign.mmd) — Planning, approval, execution, and feedback loop.

## Consequences
- **Benefits:** Full ownership of mailing lists, flexible segmentation, and cost savings compared to SaaS while aligning with existing AWS tooling.
- **Trade-offs:** Requires maintaining the Listmonk service (upgrades, monitoring). Mitigate with automated health checks, alerts, and quarterly patch schedules.
- **Operational notes:** Campaign throughput depends on SMTP provider limits; configure SES sending quotas and fallback provider strategy.
- **Follow-ups:**
  - Document campaign workflow in `docs/runbooks/mailing-operations.md`, including template versioning and approval steps.
  - Add observability dashboards (Grafana) for send metrics, bounces, and queue depth.
  - Implement integration tests validating end-to-end subscription flows (form submit → Listmonk list → welcome email).
