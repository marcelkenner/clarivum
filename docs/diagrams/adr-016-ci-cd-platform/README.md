# CI/CD Platform & Quality Gates Diagrams
- **ADR:** `docs/adr/ADR-016-ci-cd-platform.md`
- **Last updated:** 2025-10-23
- **Owners:** DevOps

## Overview
These diagrams detail the GitHub Actions-based CI/CD platform, illustrating workflow triggers, integration with Vercel and Supabase, secrets distribution, and the status checks that gate merges. They capture artifact flows, automation classes, and the orchestration lifecycle from pull request to production deploy.

## Files
- `architecture-overview.mmd` — Workflow topology across GitHub Actions, Vercel, and infrastructure targets.
- `data-lineage.mmd` — Build artifacts, status reports, and deployment records.
- `uml-automation.mmd` — Pipeline coordinators, job definitions, and secret management helpers.
- `bpmn-release.mmd` — Merge and deploy workflow with quality gates.
