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
- [ ] Inventory API endpoints, scopes, and rate limits per vendor; confirm credentials stored in Secrets Manager.
- [ ] Define data models for cached responses (TTL, shape, error handling).
- [ ] Align with finance, marketing, support on MVP data views and actions.
- [ ] Document testing strategy (sandbox creds, mocked APIs) to avoid production side effects.
- [ ] Ensure security review of proxy design (input validation, logging).

## Definition of Done
- [ ] Proxy services fetch and normalize data for each module with caching and error states.
- [ ] Write operations (retry webhook, resend email, refund request) implemented with guardrails (confirmations, feature flags, audit log entries).
- [ ] Dashboard widgets render aggregated metrics for content, communications, commerce, support, and incidents.
- [ ] Grafana panels embedded with signed requests; Plausible and GitHub data surfaced where required.
- [ ] Comprehensive tests (unit + integration) plus recorded fixtures for sandbox interactions.
- [ ] Documentation updates: PRD references checked, runbook sections for troubleshooting each integration added.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.

