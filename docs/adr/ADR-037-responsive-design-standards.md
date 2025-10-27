% Responsive design standards ADR
# ADR-037: Responsive Experience Standards
Date: 2025-10-27
Status: Accepted

## Context
- Clarivum’s web application must feel first-class across phones, tablets, laptops, and large-format devices. Marketing funnels, diagnostics, and authenticated experiences are all consumed heavily on mobile.
- While individual PRDs mention responsiveness in isolation, there is no single, codified standard in the architecture decision log to hold components, layouts, and delivery pipelines accountable.
- Performance and accessibility requirements (Core Web Vitals, WCAG) depend on fluid layouts, typography ramps, and adaptive navigation. Without explicit guidance we risk inconsistent breakpoints, ad-hoc media queries, and regressions during feature work.
- Upcoming homepage MVP, SEO platform foundation, and vertical experiences require shared responsive tokens, testing checklists, and automated guardrails.

## Decision
- Adopt a **Responsive-First** contract for every Clarivum route, component, and design artifact.
  - Treat mobile (≤ 600 px) as the primary design surface; enhance progressively for wider viewports.
  - Enforce breakpoint tokens and fluid scales owned by the frontend platform (`packages/design-tokens` + Tailwind config).
  - Require container queries or utility variants for layout-specific adaptations instead of brittle media queries.
  - Follow 10up’s responsive CSS guidance: nest media queries alongside component definitions for maintainability and use `srcset`/`sizes` for images so browsers choose the optimal asset per viewport.
- Canonical breakpoints (names align with Tailwind config and Storybook viewports):

  | Token | Min Width | Primary Usage |
  |-------|-----------|----------------|
  | `xs`  | 320 px    | Small phones, minimum supported width |
  | `sm`  | 600 px    | Large phones / phablets |
  | `md`  | 768 px    | Tablets (portrait) |
  | `lg`  | 1024 px   | Tablets (landscape) / small laptops |
  | `xl`  | 1280 px   | Desktops |
  | `2xl` | 1536 px   | Large monitors / marketing hero expansions |

- Typography and spacing use fluid `clamp()` ramps, tied to CSS custom properties (`--size-step-*`) so components inherit scaling automatically.
- Navigation, hero modules, forms, and complex grids must ship with accessible mobile patterns (touch targets ≥ 44 px, collapsible navigation, safe area insets).
- Testing & automation:
  - Storybook stories include responsive viewport knobs (xs, md, lg).
  - CI runs Playwright smoke checks at `xs`, `md`, and `lg` per route (extend `@seo-smoke` once homepage ships).
  - Lighthouse CI budgets track CLS/LCP across breakpoints; regressions fail `npm run validate`.
  - Image components must expose responsive sources; lint rules ensure `<img>`/`Image` include `srcSet`/`sizes` as applicable.
- Documentation and operationalizing:
  - New runbook (`docs/runbooks/responsive-design.md`) captures workflows, review checklists, and escalation.
  - Design tokens, Tailwind config, and component scaffolds reference this ADR.
- Diagrams under `docs/diagrams/adr-037-responsive-design-standards/` visualize component adaptation flows and breakpoint coverage.

## Consequences
- **Benefits:** Shared breakpoints, fluid scales, and testing guardrails prevent regressions, align design & engineering, and ensure mobile conversions remain strong.
- **Trade-offs:** Slight upfront overhead for Storybook variants, Playwright coverage, and linting. Component authors must adhere to token usage instead of ad-hoc CSS.
- **Follow-ups:**
  - Update brand & frontend PRDs, architecture doc, and design system to reference responsive requirements.
  - Extend ESLint/Tailwind linting to forbid raw pixel-based media queries outside the token set.
  - Integrate automated Percy/visual diff snapshots at `xs/md/lg` (tracked separately).

## Diagrams
- [Architecture Overview](../diagrams/adr-037-responsive-design-standards/architecture-overview.mmd) — Tokens, component library, and validation workflow.
- [Data Lineage](../diagrams/adr-037-responsive-design-standards/data-lineage.mmd) — Responsive assets flowing from CMS to browsers and CWV metrics.
- [UML Components](../diagrams/adr-037-responsive-design-standards/uml-components.mmd) — Services coordinating tokens, media, and testing suites.
- [BPMN Responsive Review](../diagrams/adr-037-responsive-design-standards/bpmn-review.mmd) — Review loop from design handoff through deployment.

## References
- `docs/runbooks/responsive-design.md`
- `docs/PRDs/requierments/frontend-platform/feature-requirements.md`
- `docs/PRDs/brand_design_system.md`
- `docs/diagrams/adr-037-responsive-design-standards/responsive-breakpoints.mmd`
