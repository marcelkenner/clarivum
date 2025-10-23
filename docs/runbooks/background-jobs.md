# Background Jobs Runbook

> Supports the queue strategy defined in `docs/adr/ADR-003-background-jobs-and-queues.md` and related PRDs (`supabase-platform`, `pdf-converter`, `newsletter`).

## Purpose
- Operate Clarivum’s asynchronous workloads powered by Amazon SQS + AWS Lambda workers.
- Ensure reliable processing, predictable retries, and rapid recovery from failures.

## Scope
- Queues managed via Terraform under `infra/jobs`.
- Lambda workers in `jobs/` workspace (Node.js 20).
- Covers EventBridge schedules triggering recurring jobs.

## Preconditions
- Terraform state applied; queue ARNs documented.
- AWS IAM roles with least privilege assigned (producers, consumers).
- Dead-letter queues (DLQs) configured for every primary queue.
- CloudWatch dashboards (`Jobs / Throughput`, `Jobs / Errors`) active.

## Tooling & References
- AWS Console (SQS, Lambda, CloudWatch).
- `npm run jobs:enqueue -- --job <name>` — manual enqueue helper.
- `npm run jobs:drain -- --queue <name>` — drains queue in maintenance windows.
- Runbook references: `docs/runbooks/notifications.md`, `docs/runbooks/mission-moderation.md` for dependent flows.

## Operational Checklist
### Daily
- Review CloudWatch alarms for message backlog or DLQ spikes.
- Confirm Lambda concurrent execution within configured limit.
- Check mission-critical jobs (coupon reward issuance, PDF exports) completed without retries >3.

### Weekly
- Inspect DLQ contents; triage messages older than 24h.
- Validate Terraform drift (`terraform plan`) to ensure infra consistent.
- Audit job schemas vs `@clarivum/jobs` package — update if new fields added.

### Monthly
- Load-test queue throughput (burst 200 msg/s) in staging.
- Review cost and adjust visibility timeout or batch size if needed.

## Job Lifecycle
1. Producer enqueues payload with idempotency key.
2. Lambda worker processes message; success deletes from queue.
3. Failure triggers exponential backoff; after 5 attempts message sent to DLQ.
4. On-call reviews DLQ, fixes root cause, replays message if safe.

## Deployment Procedure
- Use CI pipeline to bundle Lambda (esbuild) and publish artifact.
- Terraform apply updates event source mapping and environment variables.
- Post-deploy validation: enqueue test message via CLI, verify CloudWatch logs.
- Rollback: redeploy previous artifact (stored in S3) or disable event source mapping.

## Incident Response
### Backlog Growth / Slow Processing
- Check CloudWatch `ApproximateAgeOfOldestMessage`.
- Actions:
  - Scale concurrency limit upward temporarily.
  - Increase batch size if handler idempotent.
  - If downstream dependency slow, trigger feature flag to pause new enqueues.
- Communicate status and ETA in `#clarivum-ops`.

### DLQ Flood
- Inspect sample payload to identify failure reason.
- Common causes: schema validation change, third-party outage, expired credentials.
- Steps:
  1. Fix code/config issue and redeploy handler.
  2. Drain DLQ by reprocessing (`aws sqs send-message-batch` script) or manual tool.
  3. Monitor success metrics; ensure no recurrence.

### Lambda Errors / Timeouts
- Review CloudWatch logs for stack traces.
- Extend timeout if legitimate processing requires more time (max 15 min).
- If CPU bound, evaluate moving to Fargate worker.

## Maintenance Windows
- To pause processing:
  1. Disable EventBridge schedule or Lambda event source mapping.
  2. Drain queue if necessary.
  3. Announce pause and resume time to stakeholders.

## Observability
- Metrics tracked:
  - `job_processed_total`
  - `job_failed_total`
  - `job_duration_seconds`
  - `dlq_messages_total`
- Traces exported via OpenTelemetry; correlate with incident IDs.

## Security & Compliance
- Rotate IAM access keys quarterly; monitor CloudTrail for unauthorized access.
- Redact sensitive payload fields before logging.
- Store job schema documentation in `docs/apis/jobs.md` (update alongside new job types).

## Escalation Matrix
- Level 1: Backend engineer on rotation.
- Level 2: Platform lead for infra scaling or architecture changes.
- Level 3: CTO for AWS support escalation.
- Notify dependent team (e.g., marketing for email jobs) if delay >2 hours.

## Maintenance
- Review runbook after introducing new queue types or moving workloads off Lambda.
- Record updates in changelog.

## Changelog
- 2025-10-26 — Initial publication supporting mission coupon and PDF pipelines.
