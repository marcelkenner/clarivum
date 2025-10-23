# Payments & Checkout Orchestration Diagrams
- **ADR:** `docs/adr/ADR-011-payments-and-checkout-orchestration.md`
- **Last updated:** 2025-10-23
- **Owners:** Commerce Engineering

## Overview
These diagrams capture the multi-provider payments strategy spanning Stripe, PayU, and Przelewy24. They illustrate routing logic, normalized data stored in Supabase, service collaborators, and the operational workflow for handling confirmations, failures, and reconciliations.

## Files
- `architecture-overview.mmd` — Checkout coordinator, provider integrations, and webhooks.
- `data-lineage.mmd` — Payment intent normalization, provider references, and ledger data.
- `uml-services.mmd` — Coordinator, managers, and webhook handlers defined by the orchestration layer.
- `bpmn-fulfillment.mmd` — Checkout lifecycle from initiation through reconciliation.
