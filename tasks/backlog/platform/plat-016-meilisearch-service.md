---
id: TSK-PLAT-016
title: Deploy Meilisearch Search Service
status: backlog
area: platform
subarea: search
owner: Search Platform Manager
collaborators:
  - DevOps Lead
  - Content Platform Lead
effort: medium
created_at: 2025-10-25
updated_at: 2025-10-28
links:
  - docs/PRDs/technology-stack-catalog.md
  - docs/PRDs/requierments/strapi/blog.md
  - docs/adr/ADR-009-search-and-discovery-platform.md
  - docs/runbooks/search-operations.md
context7:
  - /meilisearch/documentation
  - /websites/aws_amazon-amazonrds-aurorauserguide
tags:
  - search
  - content
  - infrastructure
---

## Summary
Stand up Meilisearch Cloud projects, baseline indexes, and ingestion pipelines so Clarivum content (blog, tools, ebooks) is discoverable with low-latency search and editor-friendly workflows.

## Definition of Ready
- [x] Index schema finalized: searchable `title`, `subtitle`, `author`, `tags`, `body_excerpt`; filterable `locale`, `category`, `publish_date`; ranking prioritizes freshness then popularity agreed with stakeholders.
- [x] Ingestion and credentials defined: Strapi webhooks plus nightly backfill worker, keys rotated quarterly, workers in private subnets/IP-allowlisted.
- [x] Tenancy sizing approved: Fargate (or Meilisearch Cloud) starting t3.medium equivalent, EBS gp3 100 GB, autoscaling on QPS with cost alerts in place.
- [x] Fallback UX locked: disable search gracefully with curated links and feature flag to turn off service when needed.

## Definition of Done
- [ ] Meilisearch environments provisioned with API keys, access controls, and alerting configured.
- [ ] Initial indexes populated from Strapi or Aurora data and verified with parity checks.
- [ ] Webhooks or ingestion jobs wired to refresh indexes on publish and unpublish events.
- [ ] Search operations runbook updated with tenant specifics and swap procedures.
- [ ] Follow-up tasks captured for advanced analytics, personalization, or A/B testing needs.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
