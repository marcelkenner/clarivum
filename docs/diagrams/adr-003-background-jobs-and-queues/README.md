# Background Jobs & Queues Diagrams
- **ADR:** `docs/adr/ADR-003-background-jobs-and-queues.md`
- **Last updated:** 2025-10-23
- **Owners:** Platform Operations

## Overview
These diagrams document how Clarivum orchestrates asynchronous workloads with Amazon SQS, Lambda workers, and supporting infrastructure. They illustrate queue topologies, payload schemas, runtime collaborators, and the escalation flow for failed jobs.

## Files
- `architecture-overview.mmd` — Queue, worker, and scheduler topology for background work.
- `data-lineage.mmd` — Message payload contracts and dead-letter storage.
- `uml-runtime.mmd` — Worker library classes enforcing idempotency and retries.
- `bpmn-job-lifecycle.mmd` — Operational lifecycle for enqueuing, retrying, and resolving jobs.
