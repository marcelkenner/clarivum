---
id: TSK-PLAT-039
title: Integrate Core Systems into Operations Hub
status: backlog
area: platform
subarea: integrations
owner: Platform Integration Lead
collaborators:
  - Lifecycle Marketing Manager
  - Payments Operations Manager
  - Support Lead
effort: large
created_at: 2025-10-24
updated_at: 2025-10-24
links:
  - docs/PRDs/requierments/operations-hub/feature-requirements.md
  - docs/adr/ADR-031-admin-operations-hub.md
  - docs/runbooks/ops-hub.md
  - docs/runbooks/mailing-operations.md
  - docs/runbooks/payments-operations.md
context7:
  - /knadh/listmonk
  - /stripe/stripe
  - /aws/aws-sdk-net
  - /plausible/docs
tags:
  - integrations
  - communications
  - payments
---

## Summary
Wire the Ops Hub proxy layer to Strapi, Supabase, Listmonk, SES, Novu, Stripe, PayU, Przelewy24, Plausible, and Grafana APIs so operators get unified dashboards, action buttons, and health signals without leaving `/ops`.

## Definition of Ready
- [ ] API scopes, rate limits, and sandbox credentials documented for each vendor integration and stored in Secrets Manager.
- [ ] Cache models and TTLs defined per endpoint, including cache-busting rules and safe stale-while-revalidate paths.
- [ ] MVP data views and actions agreed with finance, marketing, and support stakeholders, with wireframes linked in the task.
- [ ] Sandbox and contract testing strategy established (mock servers and record/replay fixtures for E2E coverage).
- [ ] Security review scheduled with data flow diagram covering input validation, logging, and least-privilege controls.

## Definition of Done
- [ ] Proxy services fetch and normalize data for each module with caching and error states.
- [ ] Write operations (retry webhook, resend email, refund request) implemented with guardrails (confirmations, feature flags, audit log entries).
- [ ] Dashboard widgets render aggregated metrics for content, communications, commerce, support, and incidents.
- [ ] Grafana panels embedded with signed requests; Plausible and GitHub data surfaced where required.
- [ ] Comprehensive tests (unit + integration) plus recorded fixtures for sandbox interactions.
- [ ] Documentation updates: PRD references checked, runbook sections for troubleshooting each integration added.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
