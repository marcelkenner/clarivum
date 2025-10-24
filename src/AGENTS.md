# Frontend · AGENTS Guide

Clarivum's frontend lives under `src/` using the Next.js App Router. Treat every addition as a reusable module that respects the ViewModel, Manager, and Coordinator separation.

## Architectural roles

- **View components** render UI only. They delegate to a ViewModel for state, actions, and derived data. Do not read from services, `process.env`, or `fetch` inside views.
- **ViewModels** expose typed methods and readonly state. They compose Managers via dependency injection and never import React. Keep each ViewModel in its own file/class.
- **Managers** hold business rules, data access, and side effects. They coordinate with repositories, APIs, or feature-flag clients while remaining UI-agnostic.
- **Coordinators** control navigation flow and high-level state transitions across ViewModels. Use them to encapsulate routing logic or multi-step wizards.
- Prefer composition and protocol-like interfaces over inheritance. Every new capability belongs in a dedicated class under `src/app/<feature>/viewmodels`, `.../managers`, or `.../coordinators`.

## Structure and routing

- Keep route segments under `src/app/` and mirror taxonomy from `docs/PRDs/clarivum_brand.md` and `first_configuration.md`.
- Shared UI should live under `src/components/` (or feature `components/`) with one component per file under 200 lines.
- Client components are opt-in; default to server components. When client-side state is required, wrap it in a thin component that still consumes a ViewModel instance.
- Do not grow files past 400 lines. Break large features into subfolders (`view`, `viewmodel`, `manager`, `coordinator`, `ui`) as soon as they approach 200 lines per class.

## Styling and accessibility

- Rely on Tailwind CSS 4 utility classes. Promote repeated patterns into composable class factories or dedicated components.
- Enforce accessibility up front: semantic HTML, ARIA roles, focus management, and keyboard flows. ViewModels should expose methods that simplify a11y (e.g., `toggleAnnouncement()` rather than DOM mutations).
- Align with brand tokens from `docs/PRDs/clarivum_brand.md` and `brand_design_system.md`; fetch updates via Context7 before introducing new utilities.

## Data, telemetry, and guardrails

- Managers wrap all network access. Stub or inject them in tests to keep ViewModels deterministic.
- Surface analytics, OTel spans, and Core Web Vitals metrics through Managers so they can be swapped or tested. Keep p95 < 300 ms and p99 < 800 ms as per `docs/README.md`.
- Follow the Sisu Debugging and Kaizen rituals: every meaningful frontend change must ship with at least one guardrail (test, lint rule, script, or alert) and log the improvement in `#kaizen-minute` / `#sisu-log`.
- For placeholder data, create typed fixtures inside `__fixtures__/` and reference the governing task/ADR in a TODO comment.

## Workflow checklist

- [ ] Define or update ViewModel/Manager/Coordinator classes for new flows; inject dependencies via constructors.
- [ ] Keep functions under 30 lines and classes under 200 lines; split once they trend above those thresholds.
- [ ] Add automated guardrails (unit test, lint rule, or monitoring hook) before merging.
- [ ] Run `npm run lint`, `npm run typecheck`, and all relevant scripts; resolve warnings to zero.
- [ ] Update documentation (PRD, runbook, guide) and tasks with links back to Kaizen entries.
- [ ] Validate new library usage by calling `context7__resolve-library-id` → `context7__get-library-docs` before adoption.

Extend this guide whenever new tooling or architectural layers appear under `src/`.
