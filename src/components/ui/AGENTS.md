# src/components/ui · AGENTS Guide

Shared Clarivum UI primitives live here. They provide branded building blocks (buttons, cards,
form fields, typography helpers) that respect ADR-018 (brand system), ADR-017 (icon strategy), and
ADR-027 (component library governance).

- Components exporting interactivity (`Button`, `TextField`, `ButtonLink`) are Client Components.
  Keep them side-effect free and accept analytics hooks so downstream features can emit standard
  events without duplicating logic.
- Accept accents via `accent="jade" | "skin" | "fuel" | "habits"` wherever relevant. All styling
  flows through CSS variables defined in `tokens.ts` to keep palette adjustments centralized.
- Document each component in Storybook under `src/components/ui/__stories__/`. Use `npm run storybook`
  to review locally and `npm run storybook:test` (static build guard invoked by `npm run lint`) to
  ensure the workbench compiles.
- Containers and section spacing follow the brand layout system: default max width 1120 px, narrow
  740 px, wide 1280 px, inline padding `clamp(16px, 4vw, 64px)`, section spacing `clamp(64px, 12vw,
96px)`. Use the `.container`, `.container--narrow`, `.container--wide`, `.section`, `.full-bleed`,
  and `.safe` helpers from `globals.css` when composing layouts.
- Tests belong under `tests/components/ui/` with Vitest + Testing Library. Cover analytics dispatch,
  focus rings, and accessibility wiring (labels, aria attributes) before merging new components.
- Update this guide and `docs/PRDs/requierments/components/feature-requirements.md` when expanding
  the component surface area or introducing extra variants.
