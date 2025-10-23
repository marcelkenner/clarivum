# UV Index Widget Diagrams

This directory captures the diagram set required by `docs/policies/diagramming-policy.md`
for the hero UV widget work tracked in:

- PRD: `docs/PRDs/requierments/tools/widget_indeks_uv.md`
- ADR: `docs/adr/ADR-022-tools-and-calculators-platform.md`

Contents:

- `architecture-uv-widget.md` — C4-style component view highlighting frontend,
  backend, and Open-Meteo integration boundaries.
- `data-lineage-uv-widget.md` — Data flow from geolocation consent through API
  responses and client caching layers.
- `uml-uv-widget.md` — Sequence diagram showing runtime interactions among
  coordinator, managers, and external services.
- `bpmn-uv-widget.md` — Process diagram covering user consent and fallback
  branching logic.

Owners: Product (homepage), Frontend, and Platform teams jointly maintain these
artifacts. Update them whenever scope, integrations, or contracts evolve.
