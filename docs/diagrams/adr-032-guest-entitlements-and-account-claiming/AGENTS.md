# docs/diagrams/adr-032-guest-entitlements-and-account-claiming · AGENTS Guide

## Directory Purpose
- Anchor visualizations backing `docs/adr/ADR-032-guest-entitlements-and-account-claiming.md`.
- Ensure diagrams stay synchronized with fulfillment orchestrator changes, guest claim UX, and entitlement shelf architecture.

## Diagram Responsibilities
- `architecture-overview.mmd`: High-level services spanning checkout, fulfillment, identity, and account center.
- `data-lineage.mmd`: Storage and reporting paths for entitlements, profiles, and analytics.
- `uml-components.mmd`: Component relationships powering the entitlement shelf UI and APIs.
- `sequence-guest-claim.mmd`: End-to-end sequence from Stripe checkout to account claim completion.
- `bpmn-claim-flow.mmd`: Operational flow including retries, alerts, and activation steps.

## Contribution Checklist
- Validate Mermaid syntax with `npm run lint:diagrams` before committing.
- Cross-link updates in the ADR and associated runbooks when diagrams change materially.
- Capture Context7 citations when introducing new tooling or service references.
- Coordinate with platform + growth squads to confirm data retention and consent assumptions remain accurate.
