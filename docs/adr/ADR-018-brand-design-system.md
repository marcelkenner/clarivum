# ADR-018: Clarivum Brand Design System
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum’s product vision (premium Korean-inspired calm with evidence-led storytelling) must be reflected consistently across every touchpoint before engineering begins.
- The working brand guidelines live in `docs/PRDs/brand_design_system.md`, but without an ADR the design language risks fragmenting as squads scale.
- Decisions about typography, color roles, components, and motion drive implementation details in Next.js, Tailwind tokens, marketing assets, and documentation.
- We require a codified source of truth that engineering, design, and content teams reference to avoid conflicting palettes, icon libraries, or motion styles.

## Decision
- Adopt the **Clarivum Brand Design System v1.0** as defined in `docs/PRDs/brand_design_system.md` and summarize its enforceable rules here.
- Foundations:
  - **Visual promise:** premium, serene, evidence-driven.
  - **Pillars:** Skin, Fuel, Habits with dedicated accent colors; Jade remains the global primary.
  - **Typography:** wordmark set in Cormorant Garamond; UI/body in Inter with prescribed type scale, tracking, and responsive `clamp()` usage.
  - **Color tokens:** Jade, Skin Teal, Fuel Amber, Habits Indigo, Beige, Gold, Ink, Snow. Enforce WCAG contrast thresholds (≥4.5:1 body, ≥3:1 icon/large text) and pillar-specific usage.
- Layout & components:
  - 8‑pt spacing system, 12-column desktop grid, 12 px card radius, no shadows (depth via tints/hairlines).
  - Buttons follow Jade-first hierarchy with defined hover/active/disabled/focus states; focus ring = 2 px Jade outline.
- Icon system:
  - Reference ADR-017; Phosphor icons with stroke 1.5–1.75 px, rounded terminals, size tokens 16/20/24/32 px, duotone reserved for emphasis.
- Motion & imagery:
  - Motion durations 120–240 ms with cubic-bezier ease; respect `prefers-reduced-motion`.
  - Imagery guidelines favor natural textures, diffused light, pillar-specific accents.
- Accessibility:
  - Target WCAG 2.2 AA (AAA where feasible); hit areas ≥44×44 px; focus states visible; no color-only messaging.
- Governance:
  - Any deviations or evolutions require updates to both the PRD and this ADR.
  - Tokens must be implemented in Tailwind/custom CSS vars and synced to Storybook once components exist.

## Consequences
- **Benefits:** Shared vocabulary and enforceable rules prevent UI drift, streamline component build-out, and align brand/marketing with product delivery.
- **Trade-offs:** Adds upfront governance overhead; teams must maintain tokens and documentation whenever visual decisions change.
- **Follow-ups:**
  - Establish automated linting for color and spacing tokens in CSS/Tailwind references.
  - Publish Storybook “foundations” stories to visualize tokens and usage.
  - Revisit icon + motion specs quarterly to ensure they still serve evolving experiences.
