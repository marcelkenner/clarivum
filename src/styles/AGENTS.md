# src/styles · AGENTS Guide

Houses global CSS that is awkward to express via Tailwind. Currently only
`document-theme.css` (Atrament paper theme) lives here.

## Rules

- Treat `document-theme.css` as the single source of truth for the document viewer palette (ink,
  paper, accent jade). Any additions must cite ADR-018 and keep contrast ≥ 4.5:1.
- Prefer CSS custom properties defined at the top of the file; avoid scattering raw hex values so
  theme updates remain simple.
- Keep selectors scoped (e.g., `.document-*`). Do not leak styles into the rest of the app.
- Run `npx prettier src/styles/document-theme.css --write` after edits; the file is not currently
  auto-formatted by Tailwind.
- QA: `npm run dev` → inspect `/docs/...` and `/library` on mobile + desktop for regressions (TOC,
  tables, blockquotes, code blocks).

Update this guide whenever additional shared CSS files land here.\*\*\* End Patch
