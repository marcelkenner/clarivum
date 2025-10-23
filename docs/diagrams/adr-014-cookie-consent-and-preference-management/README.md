# Cookie Consent & Preference Management Diagrams
- **ADR:** `docs/adr/ADR-014-cookie-consent-and-preference-management.md`
- **Last updated:** 2025-10-23
- **Owners:** Legal & Compliance Engineering

## Overview
These diagrams summarize the Klaro!-based consent management approach, showing how consent categories map to Flagsmith traits, how audit events flow into Supabase, and how application code respects consent gates. They highlight configuration assets, runtime collaborators, and the lifecycle for updating and revoking consent.

## Files
- `architecture-overview.mmd` — Klaro loader integration, consent storage, and downstream consumers.
- `data-lineage.mmd` — Consent records, Supabase audit logs, and category mappings.
- `uml-components.mmd` — Initialization, consent state, and trait synchronization classes.
- `bpmn-consent.mmd` — Consent capture, update, and revocation workflow.
