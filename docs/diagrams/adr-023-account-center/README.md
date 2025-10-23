# Customer Profile & Account Center Diagrams
- **ADR:** `docs/adr/ADR-023-account-center.md`
- **Last updated:** 2025-10-23
- **Owners:** Profile Experience Team

## Overview
These diagrams illustrate the architecture of the account center, including Supabase-backed profile services, integrations with payments, diagnostics, and mailing platforms, as well as compliance workflows for data export and deletion.

## Files
- `architecture-overview.mmd` — Profile service, integrations, and frontend consumption.
- `data-lineage.mmd` — Profile entities, linked subscriptions, diagnostics, and consent states.
- `uml-components.mmd` — ViewModel, manager, and service classes orchestrating account center features.
- `bpmn-compliance.mmd` — GDPR export/deletion workflow across systems.
