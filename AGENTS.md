ALWAYS USE CONTEXT7


<file_length_and_structure>
– Never allow a file to exceed 500 lines.
– If a file approaches 400 lines, break it up immediately.
– Treat 1000 lines as unacceptable, even temporarily.
– Use folders and naming conventions to keep small files logically grouped.
</file_length_and_structure>

<oop_first>
– Every functionality should be in a dedicated class, struct, or protocol, even if it’s small.
– Favor composition over inheritance, but always use object-oriented thinking.
– Code must be built for reuse, not just to “make it work.”
</oop_first>

<single_responsibility_principle>
– Every file, class, and function should do one thing only.
– If it has multiple responsibilities, split it immediately.
– Each view, manager, or utility should be laser-focused on one concern.
</single_responsibility_principle>

<modular_design>
– Code should connect like Lego — interchangeable, testable, and isolated.
– Ask: “Can I reuse this class in a different screen or project?” If not, refactor it.
– Reduce tight coupling between components. Favor dependency injection or protocols.
</modular_design>

<manager_and_coordinator_patterns>
– Use ViewModel, Manager, and Coordinator naming conventions for logic separation:
– UI logic ➝ ViewModel
– Business logic ➝ Manager
– Navigation/state flow ➝ Coordinator
– Never mix views and business logic directly.
</manager_and_coordinator_patterns>

<function_and_class_size>
– Keep functions under 30–40 lines.
– If a class is over 200 lines, assess splitting into smaller helper classes.
</function_and_class_size>

<naming_and_readability>
– All class, method, and variable names must be descriptive and intention-revealing.
– Avoid vague names like data, info, helper, or temp.
</naming_and_readability>

<scalability_mindset>
– Always code as if someone else will scale this.
– Include extension points (e.g., protocol conformance, dependency injection) from day one.
</scalability_mindset>

<avoid_god_classes>
– Never let one file or class hold everything (e.g., massive ViewController, ViewModel, or Service).
– Split into UI, State, Handlers, Networking, etc.
</avoid_god_classes>
# Clarivum · AGENTS Guide

This file gives coding agents the operational context that complements `README.md`, the PTRD, and the ADRs. Read this before making changes.

## Project orientation

- Stack: Next.js 15 (App Router) with React 19, Tailwind CSS 4, TypeScript 5. Runs on Vercel (see `docs/architecture.md`).
- Decision history lives in `docs/adr/ADR-001…005`. Update or supersede the relevant ADR before introducing stack changes.
- Product & brand context is in `docs/PRDs/` (`first_steps.md`, `clarivum_brand.md`, etc.). Keep feature work aligned with those documents.
- **Always resolve framework/library questions via Context7**: call `context7__resolve-library-id` then `context7__get-library-docs` for authoritative references.

## Build & verification commands

| Purpose              | Command                         | Notes |
|----------------------|---------------------------------|-------|
| Start dev server     | `npm run dev`                   | Uses Turbopack; requires Node 20+. |
| Production build     | `npm run build`                 | Run before shipping infra changes. |
| Lint (required)      | `npm run lint`                  | ESLint config mirrors CI gate. |
| Ensure agent guides  | `npm run ensure:agents`         | Auto-generates `AGENTS.md` for new directories. |

There are no automated tests yet. When you add them (Vitest/Playwright, etc.), extend scripts and update this guide.

## Workflow expectations

- Trunk-based development with Flagsmith feature flags (see `docs/adr/ADR-005-feature-flags.md`).
- Follow the PR checklist in `docs/checklists/pull-request.md`; the CI gate expects those tasks to be complete.
- Respect reliability guardrails in `docs/policies/error-budget-policy.md` and deployment steps in `docs/runbooks/deployment.md`.
- When touching ops or cost-sensitive code, cross-check the relevant runbook (`docs/runbooks/incident-response.md`, `docs/runbooks/cost-review.md`).

## Documentation duties

- Update `docs/architecture.md` if architecture or integrations change.
- Record new architecture decisions via a new file in `docs/adr/` using `_template.md`. Set status and link to superseded ADRs when relevant.
- Keep PRDs and policies in sync with code. If a change contradicts existing docs, update the docs in the same PR.

## Coding conventions

- Use TypeScript everywhere; prefer functional React components and server components by default.
- Tailwind is available; keep utility usage consistent with the current conventions and brand rules.
- Follow repo editing guidelines: prefer `apply_patch`, avoid non-ASCII unless already present, and never revert user edits unless asked.
- Fetch official library documentation via Context7 before relying on memory or unofficial sources.

## Before finishing a task

1. Run `npm run lint`.
2. Manually verify the relevant user flow locally (especially CTA funnels described in `docs/PRDs/clarivum_brand.md`).
3. Summarize doc updates and note any follow-up ADRs or runbook changes.

Agents should treat this file as living guidance. Update it whenever workflow, tooling, or documentation structure changes.
