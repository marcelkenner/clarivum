# Mailing Platform & Campaign Automation Diagrams
- **ADR:** `docs/adr/ADR-013-mailing-platform-and-campaign-automation.md`
- **Last updated:** 2025-10-23
- **Owners:** Lifecycle Marketing Engineering

## Overview
These diagrams describe the Listmonk-based mailing stack, including infrastructure on AWS, synchronization with Supabase, and automation services that coordinate campaigns. They show how audiences flow between systems, the service classes that orchestrate Listmonk APIs, and the operational lifecycle for campaign execution.

## Files
- `architecture-overview.mmd` — ECS Fargate deployment, integrations, and feedback loops.
- `data-lineage.mmd` — Subscriber records, consent flags, and event tracking across Supabase and Listmonk.
- `uml-services.mmd` — Coordinator, sync manager, and webhook processors managing email automation.
- `bpmn-campaign.mmd` — Campaign planning, approval, sending, and feedback workflow.
