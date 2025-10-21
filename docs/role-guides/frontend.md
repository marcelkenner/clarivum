# Frontend Guide

Welcome to Clarivum’s web experience. This guide captures the conventions, tooling, and decision history the frontend team relies on.

## Key references

- Brand & sitemap: `docs/PRDs/clarivum_brand.md`, `docs/PRDs/first_configuration.md`
- Architecture overview: `docs/architecture.md`
- Feature flag process: `docs/adr/ADR-005-feature-flags.md`
- Component conventions: `src/AGENTS.md`, `src/app/AGENTS.md`

## Daily workflow

1. **Sync with design & content**  
   - Confirm copy, imagery, and CTA destinations with marketing using the funnels in `clarivum_brand.md`.
   - Keep shared components in sync with the design tokens documented in `brand_design_system.md`.
2. **Implementation**  
   - Build in `src/app/` using server components by default; add `"use client"` only when interactivity demands it.
   - Type everything with TypeScript, using Zod schemas for external data where needed.
3. **Instrumentation**  
   - Add OpenTelemetry spans around critical flows (diagnostics, lead capture).  
   - Monitor Core Web Vitals budgets (p95 < 300 ms, p99 < 800 ms) and note regressions in PRs.
4. **Flags & rollout**  
   - Wrap unfinished features behind Flagsmith flags. Document owner + sunset date in the PR.
5. **Validation**  
   - Run `npm run lint` and manual smoke checks for the flows touched.  
   - Update the PR checklist and mention any docs/runbooks modified.

## Accessibility & localization

- Follow WCAG 2.1 AA: semantic HTML, focus management, proper labels.  
- All user-facing text originates from content team sources; avoid hardcoding Polish/English copy without confirmation.
- RTL not required yet, but avoid assumptions that break future localization.

## Asking for help

- Design system gaps → #clarivum-design.  
- Content updates → open a short PR against `docs/PRDs/clarivum_brand.md`.  
- Framework questions → use Context7 (`/vercel/next.js`) for authoritative guidance, then cross-post findings in #clarivum-frontend.  
- If blockers persist, log them in the shared “Frontend Blockers” Notion checklist and page the engineering lead.
