# Frontend · AGENTS Guide

Clarivum’s frontend lives under `src/` using the Next.js App Router. Follow this guide when working on application code.

## Structure & routing

- Directory layout follows App Router conventions: route segments under `src/app/`.
- Use server components by default; introduce client components only when interactivity requires it.
- Maintain vertical taxonomy alignment with `docs/PRDs/clarivum_brand.md` and the sitemap in `first_configuration.md`. Route names and slugs must match those docs.

## Styling & UI

- Styling uses Tailwind CSS 4. Prefer utility classes; extract components into shared files if patterns repeat.
- Follow brand colors and CTA patterns defined in `docs/PRDs/clarivum_brand.md` and `brand_design_system.md`.

## Data & integrations

- Until Supabase data access is implemented, prefer typed placeholder data with clear TODOs referencing the relevant ADR or task.
- When integrating APIs or background jobs, ensure contracts align with ADR-001 (Supabase), ADR-003 (queues), and ADR-004 (observability).
- Consult Context7 for Next.js/React/Tailwind best practices before adopting new APIs.

## Telemetry

- Instrument meaningful spans and metrics per ADR-004. Even for UI-only changes, ensure logging/analytics hooks remain intact.
- Surface Core Web Vitals issues and keep p95/p99 targets from `docs/README.md` in mind (p95 < 300 ms, p99 < 800 ms).

## Developer checklist

- [ ] Update or create components in TypeScript with strict typing.
- [ ] Add accessibility attributes (semantic tags, `aria` labels) for new UI.
- [ ] Run `npm run lint` before submitting changes.
- [ ] Update docs if routes or user flows change (e.g., sitemap or runbooks).
- [ ] Verify any new library usage against Context7 documentation.

Add new section(s) to this guide if additional tooling or architectural layers are introduced under `src/`.
