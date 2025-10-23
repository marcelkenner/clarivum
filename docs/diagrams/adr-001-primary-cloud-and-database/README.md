# Primary Cloud & Database Platform Diagrams
- **ADR:** `docs/adr/ADR-001-primary-cloud-and-database.md`
- **Last updated:** 2025-10-23
- **Owners:** Platform Engineering

## Overview
These diagrams capture the hosting, persistence, and operational responsibilities defined in ADR-001. They highlight how Vercel, Supabase Postgres, and Supabase Storage interact with Clarivum’s Next.js application and the supporting infrastructure automation.

## Files
- `architecture-overview.mmd` — Container-level view of web delivery, database, and storage services.
- `data-lineage.mmd` — Entity relationships that describe how content and leads live inside Supabase.
- `uml-service-boundaries.mmd` — Domain classes for provisioning and runtime adapters used by the platform team.
- `bpmn-provisioning.mmd` — Provisioning and disaster-recovery workflow for infrastructure operations.
