# ADR-017: Icon System for Clarivum UI
Date: 2025-10-24
Status: Accepted

## Context
- The Clarivum brand guidelines (`docs/PRDs/clarivum_brand.md`) call for a “premium KR” visual tone: minimal UI, luxurious accent moments, and scalable iconography that spans editorial and transactional flows.
- Detailed icon usage requirements are captured in `docs/PRDs/brand_design_system.md`; this ADR codifies the technology choice that supports them.
- Previous explorations evaluated:
  1. Proprietary icon kits (e.g., Streamline Premium) – strong variety but licensing complexity and limited SSR story.
  2. Lucide – open-source but only single-stroke weight, less suited for premium emphasis states.
  3. Phosphor – open-source React package with multiple weights, including duotone for elevated emphasis.
- We need a single library that:
  - Works in Next.js App Router (Server Components + SSR).
  - Provides multiple weights for stateful UIs without maintaining separate assets.
  - Supports tree-shaking and small bundle sizes.
  - Aligns with accessibility and sizing requirements in the design system.

## Decision
- Adopt **Phosphor Icons React** (`@phosphor-icons/react`) as the canonical icon family.
  - Install via `pnpm add @phosphor-icons/react`.
  - Import named icons for tree-shaking:
    ```tsx
    import { Heart, Bag } from "@phosphor-icons/react";

    export function InlineExamples() {
      return (
        <>
          <Heart size={24} weight="regular" />
          <Bag size={24} weight="duotone" />
        </>
      );
    }
    ```
  - For SSR/server components, import from `@phosphor-icons/react/ssr`.
  - Use `next.config.js` `experimental.optimizePackageImports` to reduce bundle overhead (per Context7 `/phosphor-icons/react` guidance).
- Define Clarivum icon styling spec:
  - Stroke width: 1.5–1.75 px at 24 px size.
  - Terminals: rounded caps and joins; no hard square edges.
  - Sizes: 16 / 20 / 24 / 32 px. Default = 24 px, micro-controls = 20 px, hero/emphasis = 32 px.
  - Color: `currentColor`; icons inherit text color tokens. Optional accent on hover/selected states only.
  - Density: generous spacing; pair with medium/large line-height typography.
  - States: hover → subtle opacity/tint; active → filled or duotone weight; focus → visible focus ring meeting WCAG AA/AAA.
- Accessibility & performance requirements:
  - Provide accessible names when icons stand alone (use the `alt` prop or wrap in labeled buttons); set `aria-hidden` when decorative.
  - Wrap glyphs in interactive elements sized ≥40×40 px for tap targets.
  - Enforce named imports to maintain tree-shaking; disallow namespace imports in lint rules.
  - Icons inherit tokens for dark mode automatically; no additional variants needed.

## Consequences
- **Benefits:** Multiple weights enable premium emphasis without asset duplication; open-source licensing avoids recurring costs; React package is SSR-safe and matches App Router expectations.
- **Trade-offs:** Slightly larger bundle compared to single-weight libraries; mitigate with named imports, optimized package imports, and lint automation.
- **Follow-ups:**
  - Update design system documentation to reflect Phosphor usage and sizing tokens.
  - Add ESLint rule or custom lint check preventing `import * as Icon from "@phosphor-icons/react"`.
  - Capture icon usage examples in Storybook with regular vs. duotone states.
  - Audit existing UI once icons ship to ensure focus/tap-area guidance is followed.
