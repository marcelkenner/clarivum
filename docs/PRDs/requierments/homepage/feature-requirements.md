# Feature Requirements — Brand Homepage

> **Canonical decisions:** Apply the brand system (`docs/adr/ADR-018-brand-design-system.md`) and frontend platform architecture (`docs/adr/ADR-019-frontend-platform.md`) when implementing this page.

## Objective
- Craft the `/` brand hub that introduces Clarivum, anchors the three verticals, and guides visitors toward priority funnels (ebooks, tools, newsletter).
- Serve as the highest-performing landing experience for both organic and paid traffic, reflecting the brand strategy in `clarivum_brand.md`.

## Target Outcomes
- Business: maximize click-through into vertical hubs and lead magnet conversions.
- Experience: deliver a clear value narrative within the first viewport, with LCP ≤ 2.5 s and CLS < 0.1.

## Primary Users & Segments
- New visitors evaluating the brand.
- Returning leads/customers looking for updates or quick access to tools/ebooks.
- Segmentation: highlight personalized CTAs when diagnostics or profile data available; default to most popular funnels otherwise.

## Experience Principles
- Reflect the brand pillars (evidence, craft, harmony, restraint) through calm design and authoritative messaging.
- Maintain clear navigation to `/skin/`, `/fuel/`, `/habits/`, `/ebooks/`, `/narzedzia/`, `/polecenia/`.
- Use consistent CTA language and Jade action color, with per-vertical accent cues from the design system.

## Functional Requirements
- FR1 — Hero section with brand promise (“Uczymy. Upraszczamy. Dowozimy.”), embedded UV widget (spec: `docs/PRDs/requierments/tools/widget_indeks_uv.md`), and primary CTA leading to flagship ebook or diagnostic.
- FR2 — Subbrand cards summarizing Skin, Fuel, Habits with key promises and CTAs.
- FR3 — Cross-vertical tools sampler (3–6 tiles) with quick-launch links.
- FR4 — Success proof module featuring testimonials, press logos, metrics (editable via CMS).
- FR5 — Global newsletter signup with segmentation options (vertical preference).
- FR6 — Ebook CTA block linking to `/ebooks/` hub; support dynamic promotions via feature flags.
- FR7 — Footer with navigation shortcuts, legal links, social proof.

## Content & Data Inputs
- Copy and assets curated in Strapi; modules reference structured fields (headlines, body, CTA labels, imagery).
- Testimonials and metrics sourced from marketing team, with verification timestamps.
- Newsletter form integrates with marketing automation tags.

## Integrations & Dependencies
- Internal: component library, analytics, diagnostics outcomes for personalization, coupon engine for promotions.
- External: marketing automation for newsletter, CDN for imagery.

## Analytics & KPIs
- Track CTA engagement per module, scroll depth, click-through into verticals, newsletter signup rate.
- Monitor funnel from homepage entry to lead magnet conversion and subsequent purchases.

## Non-Functional Requirements
- Employ responsive layout with 12-column grid; degrade gracefully on mobile (hero and cards stack).
- Implement image optimization (Next.js Image) and lazy-loading for lower modules.
- Maintain WCAG 2.2 AA compliance (contrast, focus states, accessible navigation).

## Compliance & Access Control
- Display cookie/consent prompts per legal guidelines.
- Ensure privacy and terms links accessible in header or footer.
- Home content edits require product + marketing approval; maintain version history.

## Launch Readiness Checklist
- Content QA for copy, translations, and assets complete.
- Performance tests run (Lighthouse ≥ 90 for performance and accessibility).
- Analytics and personalization validated in the dev environment.
- Incident fallback plan ready (feature flags to hide promotional modules if needed).

## Open Questions & Assumptions
- Confirm hero CTA priority (ebook vs diagnostic) with growth team.
- Determine need for localized versions (language toggle).
- Assume testimonials supplied with consent forms; legal confirmation pending.
