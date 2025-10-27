# src/app/(marketing)/\_home · AGENTS Guide

Clarivum’s marketing homepage acts as the reference implementation for the brand layout, container,
and spacing system.

- Wrap every major section in the global `.section` helper and place content inside the centered
  `.container` variants from `src/app/globals.css`. Use:
  - `container` (default 1120 px) for hero, diagnostics, and planning bands.
  - `container container--wide` (1280 px) for dense grids (tools/verticals).
  - `container container--narrow` (740 px) for long-form strips and learning moments.
- Only backgrounds should bleed full-width; use `.full-bleed` as the wrapper and keep text/cards
  inside an inner `.container`. Apply `.safe` to sticky or fixed elements so mobile safe-area insets
  are respected.
- Maintain the 4-pt spacing scale (`4 • 8 • 12 • 16 • 24 • 32 • 40 • 48 • 64 • 80 • 96 • 128`):
  section spacing `clamp(64px, 12vw, 96px)`, grid gaps 24–32 px desktop / 16 px mobile, card
  padding 16–24–32 px by breakpoint.
- Prefer the shared UI primitives from `src/components/ui` (e.g., `Button`, `ButtonLink`,
  `Card`, `TextField`) so CTAs, forms, and cards inherit analytics hooks, accessibility, and brand
  tokens automatically.
- Keep changes aligned with the homepage PRD (`docs/PRDs/requierments/homepage/feature-requirements.md`),
  brand system (`docs/PRDs/brand_design_system.md`), and ADR-018/ADR-027.
- Resolve library/tooling questions with Context7 before introducing new dependencies.
