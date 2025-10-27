# src/components · AGENTS Guide

Holds shared React components that live outside a specific route group. Currently focused on the
Atrament documentation UI (see `documents/`), but keep this guidance general for future components.

- Prefer server components unless the UI truly needs client hooks/state. Co-locate client wrappers
  (e.g., `DocumentIndex`) with `use client` directives at the file top.
- All shared components must ship with a narrow, documented API; add prop JSDoc so routes can adopt
  them without guesswork.
- Cross-check each component against ADR-018 (brand) before introducing new typography or color
  tokens.
- Tests: `npm run lint:code -- src/components` and `npm run typecheck`. Add unit tests (Vitest + RTL)
  under `src/components/__tests__/` as soon as a component gains logic.
- `ui/` holds the Clarivum component library primitives. Follow `src/components/ui/AGENTS.md`
  before adding or modifying shared UI pieces.
- When composing layouts, rely on the global `.container`, `.section`, `.full-bleed`, and `.safe`
  helpers defined in `src/app/globals.css` so spacing aligns with the site-wide 4‑pt scale and
  container widths (740 / 1120 / 1280 px).
- Update this file when we introduce additional shared component families (forms, layout, etc.).
