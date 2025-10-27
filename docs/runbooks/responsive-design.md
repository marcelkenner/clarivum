# Responsive Design Runbook

## Scope & Purpose
- Ensure every Clarivum route, component, and content asset delivers an accessible, high-performing experience across mobile, tablet, and desktop breakpoints.
- Translate ADR-037 into day-to-day engineering, design, and QA practices.
- Provide escalation guidance when responsive regressions are detected in CI, visual snapshots, or user feedback.

## Roles & Responsibilities
- **Frontend Platform Lead:** owns tokens, Tailwind config, Storybook responsive controls, and CI guardrails.
- **Design Lead:** keeps Figma libraries aligned with breakpoint tokens and fluid type/spacing ramps.
- **QA Lead:** maintains Playwright viewport coverage (`xs`, `md`, `lg`) and regression scripts.
- **Content & Growth:** validate copy length, imagery, and SEO modules across breakpoints before publishing.

## Breakpoints & Tokens
- Canonical breakpoints (see ADR-037):
  - `xs` 320 px, `sm` 600 px, `md` 768 px, `lg` 1024 px, `xl` 1280 px, `2xl` 1536 px.
- Tailwind configuration exposes `@screen xs|sm|...`; component authors must rely on these tokens.
- Typography: use `text-fluid-*` utilities (backed by `clamp()`) to keep heading/body scales responsive.
- Spacing: prefer design tokens (`gap-responsive`, `pad-*`) so gutters scale proportionally.

## Implementation Checklist (per feature)
1. **Design handoff**
  - Confirm Figma frames exist for `xs`, `md`, and `lg`.
  - Validate touch targets (≥ 44 px), safe area insets, and truncated copy handling.
2. **Development**
   - Use responsive image sources (`srcset`/`sizes` or Next `<Image>` with device sizes) so browsers select the best asset per viewport (10up best practice).
  - Scaffold component stories with responsive viewports in Storybook.
  - Use container queries for layout-specific adaptations where possible; fallback to Tailwind breakpoint utilities.
   - Nest media queries alongside component styles when custom CSS is required to keep responsive rules discoverable.
  - Avoid fixed heights/widths unless bounded by tokens (e.g., `max-w-[theme('screens.lg')]`).
3. **Testing**
  - Run `npm run test -- --viewport=xs,md,lg` (Playwright smoke).
  - Execute `npm run validate` to trigger Lighthouse budgets at multiple viewport widths.
  - Manually spot-check complex flows (forms, multi-step wizards) on physical devices or BrowserStack.
4. **Review**
   - PR description includes responsive screenshots or Percy links.
   - Design/QA sign off on layout behavior; note any TODOs with issue links.

## Automation & Tooling
- **Storybook:** `viewport` addon pre-configured with canonical breakpoints; required stories must include `parameters.viewport.defaultViewport`.
- **Playwright:** `playwright.config.ts` includes projects `mobile`, `tablet`, `desktop`; update when breakpoints evolve.
- **Lighthouse CI:** threshold tracking for LCP/CLS across viewports; failing budgets block merges.
- **Visual Regression (future work):** integrate Percy or Chromatic snapshots at `xs`, `md`, `lg` (tracked separately).

## Monitoring & Alerting
- Grafana dashboards track Core Web Vitals segmented by device class (mobile vs desktop).
- Alerts trigger on sustained LCP > 3 s mobile or CLS > 0.2; Platform coordinates remediation.
- Kaizen Minute: log responsive regressions and guardrail follow-ups within 24 h.

## Incident Response
1. Acknowledge issue in `#clarivum-dev` (or `#seo-incidents` if affecting search) and create task referencing ADR-037.
2. Assess scope: impacted routes, breakpoints, and whether feature flags can mitigate.
3. Roll back or hotfix using component toggles or quick patches; document steps in the PR.
4. Add regression guardrail (Playwright test, Storybook story, or lint rule) within 48 h per Sisu policy.
5. Record learnings in `sisu-log/` and update this runbook if new patterns emerge.

## References
- ADR-037 Responsive Experience Standards
- ADR-019 Frontend Application Platform
- Brand Design System PRD (`docs/PRDs/brand_design_system.md`)
- Frontend Platform Feature Requirements (`docs/PRDs/requierments/frontend-platform/feature-requirements.md`)

Keep this runbook current; revisit quarterly or when adding new device classes/breakpoints.
