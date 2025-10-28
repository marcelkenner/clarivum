# UV Index Widget Diagrams

This directory captures the diagram set required by `docs/policies/diagramming-policy.md`
for the hero UV widget work tracked in:

- PRD: `docs/PRDs/requierments/tools/widget_indeks_uv.md`
- ADR: `docs/adr/ADR-022-tools-and-calculators-platform.md`

Contents:

- `architecture-uv-widget.mmd` — C4-style component view highlighting frontend,
  backend, and Wttr.in integration boundaries.
- `data-lineage-uv-widget.mmd` — Data flow from geolocation consent through API
  responses and client caching layers.
- `uml-uv-widget.mmd` — Sequence diagram showing runtime interactions among
  coordinator, managers, and external services.
- `bpmn-uv-widget.mmd` — Process diagram covering user consent and fallback
  branching logic.

Owners: Product (homepage), Frontend, and Platform teams jointly maintain these
artifacts. Update them whenever scope, integrations, or contracts evolve.
