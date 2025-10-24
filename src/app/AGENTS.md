# App Router · AGENTS Guide

The `src/app/` directory houses Next.js route segments, layouts, metadata, and server actions. Treat each route as a thin composition layer that wires ViewModels, Managers, and Coordinators into presentation components.

## Routing and file layout

- Follow App Router conventions: route segments, `page.tsx`, `layout.tsx`, route groups (`(marketing)`), and client/server boundaries.
- Keep folder taxonomy aligned with `docs/PRDs/clarivum_brand.md` and `first_configuration.md`. When new flows appear, update those docs first.
- Locate view code under `view/`, ViewModels under `viewmodel/`, Managers under `manager/`, and Coordinators under `coordinator/` inside each feature segment. Export constructors from `index.ts` files so routes depend on interfaces, not implementations.
- Validate route params through dedicated Value Objects (classes or zod schemas) before they reach ViewModels. Never pass raw `params` or `searchParams` into UI components.

## Server components and dependency injection

- Default to server components for pages and layouts. Create a ViewModel instance inside the server component, inject Managers and Coordinators, then pass only serializable data/actions to child client components.
- Use dependency factories in `src/app/<feature>/config/` to assemble ViewModels with the correct Managers for each environment. This keeps tests able to inject doubles.
- When server actions are required, wrap them in a Coordinator class so that navigation rules and side effects live outside of components.
- Review caching (`revalidate`, `cache`, tag revalidation) against `docs/README.md` performance budgets; connect guardrail metrics to the Kaizen log.

## UI composition and accessibility

- Consolidate cross-route UI (navigation, shells, CTA modules) into shared components. Keep each component under 200 lines and expose props that lean on ViewModel data instead of pulling from global state.
- Ensure metadata, Open Graph, and structured data functions read from Managers (e.g., `SeoManager`) so we can reuse them in other surfaces.
- Implement accessibility at the ViewModel boundary: expose methods for focus management, keyboard shortcuts, and ARIA states rather than manipulating the DOM directly inside components.

## Guardrails and rituals

- Every route change must add or update at least one automated guardrail (unit test, type refinement, lint rule, or monitoring hook). Log it in `#kaizen-minute` and link the follow-up in `#sisu-log` when debugging incidents.
- Reflect review decisions in tasks and docs: update the relevant PRD, ADR, or runbook, and ensure the continuous-improvement board captures any new experiments.
- Run `npm run lint`, `npm run typecheck`, and format checks before submitting; CI expects zero warnings.

## Review checklist

- [ ] View components consume a ViewModel/Coordinator instead of services or globals.
- [ ] Params, search params, and cookies are validated before use.
- [ ] Metadata and SEO tags follow brand requirements via Managers/Coordinators.
- [ ] Edge/runtime configuration, caching, and telemetry align with ADR-004 and `docs/runbooks/sisu-debugging.md`.
- [ ] Guardrail (test, alert, lint rule) added or updated and recorded in the Kaizen log.
