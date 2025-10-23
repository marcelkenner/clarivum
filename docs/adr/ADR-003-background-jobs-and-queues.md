# ADR-003: Background Jobs & Queues
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum must process asynchronous workloads: lead enrichment, email fulfillment, analytics backfills, sitemap regeneration, and scheduled cache warming.
- Vercel functions are short-lived and not suited for long-running or resource-intensive tasks.
- We require at-least-once delivery semantics, predictable retries, and dead-letter handling without standing up self-managed infrastructure.
- Workflows are detailed in `docs/PRDs/requierments/supabase-platform/feature-requirements.md` and long-running export expectations in `docs/PRDs/requierments/pdf-converter/requirements.md`.

## Decision
- Adopt **Amazon SQS (standard queue)** as the central job queue.
  - All background tasks are enqueued through a shared library (`@clarivum/jobs`) that enforces idempotency keys and schema validation.
  - Visibility timeout defaults to 60 seconds, adjustable per job type.
- Run **AWS Lambda** functions (Node.js 20 runtime) as workers subscribed to the queue via event source mappings.
  - Concurrency limits configured per job type to avoid rate-limiting third-party APIs.
  - Failed retries escalate to an **SQS Dead-Letter Queue** after 5 attempts; CloudWatch alarms notify oncall.
- Manage infrastructure via Terraform: queue definitions, IAM roles, Lambda deployment, secrets, and alarms live in the shared `infra/` repository.
- For workloads requiring delayed execution, use SQS message timers; for cron-style jobs, use **Amazon EventBridge Scheduler** targeting the Lambda handlers.

## Consequences
- **Upside:** Serverless operations, automatic scaling, integration with existing AWS monitoring, and minimal maintenance overhead.
- **Constraints:** Lambda execution time limits (15 minutes) govern job complexity. If tasks exceed this window, they must be decomposed or migrated to ECS Fargate.
- **Cost:** Pay-per-use fits low-to-medium throughput. Monitor concurrency to stay under budget; heavy workloads might warrant exploring AWS Step Functions or ECS.
- **Follow-ups:**
  - Implement a local testing harness (SAM or `serverless-offline`) for deterministic job execution in CI.
  - Define clear contracts for each job payload and document them in `/docs/api/jobs.md` (to be created).
