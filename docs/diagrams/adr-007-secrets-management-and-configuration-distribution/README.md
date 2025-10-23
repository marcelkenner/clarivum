# Secrets Management & Configuration Distribution Diagrams
- **ADR:** `docs/adr/ADR-007-secrets-management-and-configuration-distribution.md`
- **Last updated:** 2025-10-23
- **Owners:** Security Engineering

## Overview
These diagrams show how Clarivum centralizes secrets in AWS Secrets Manager and propagates configuration to Vercel, Lambda, and CI pipelines. They capture the access topology, secret metadata model, automation classes, and the rotation workflow required by the security baseline.

## Files
- `architecture-overview.mmd` — Secrets Manager as the source of truth feeding runtimes and CI.
- `data-lineage.mmd` — Secret metadata, rotation handlers, and audit logs.
- `uml-automation.mmd` — Automation classes for syncing and rotating secrets.
- `bpmn-rotation.mmd` — Workflow for rotating credentials and distributing updates.
