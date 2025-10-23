# Feature Requirements — Frontend Platform (Next.js, React, Tailwind, TypeScript)

> **Canonical decision:** `docs/adr/ADR-019-frontend-platform.md` defines the architecture, composition rules, and performance guardrails for this platform.

## Objective
- Provide a resilient, high-performance frontend foundation using Next.js 15, React 19, Tailwind CSS 4, and TypeScript 5 that supports Clarivum’s modular IA and funnels.
- Enable rapid iteration with component reuse, server-side rendering, and hybrid static generation while maintaining accessibility and SEO.

## Target Outcomes
- Business: deliver marketing and gated experiences that convert leads and subscribers with sub-second interactions and strong SEO rankings.
- Experience: maintain Core Web Vitals (LCP ≤ 2.5 s, FID/INP ≤ 200 ms, CLS < 0.1) across verticals and ensure TypeScript catches regressions before release.

## Primary Users & Segments
- External: visitors, leads, customers consuming the site.
- Internal: frontend engineers, designers, content editors reliant on predictable component behavior.
- Segmentation: vertical theming (`skin`, `fuel`, `habits`), localization readiness, and authenticated vs anonymous states.

## Experience Principles
- Embrace the App Router to mirror sitemap structure (route groups, dynamic segments) and keep navigation intuitive.
- Align styling with the brand design system using Tailwind tokens and custom utilities; avoid ad-hoc CSS.
- Maintain accessibility-first approach with semantic HTML, focus management, and ARIA patterns embedded in components.

## Functional Requirements
- FR1 — Implement routing structure reflecting `clarivum_brand.md` (global home, vertical hubs, category-first blog, tools, ebooks, recommendations).
- FR2 — Support Incremental Static Regeneration for marketing pages and SSR for personalized/gated experiences with caching directives.
- FR3 — Provide shared layout, metadata, and SEO primitives (OpenGraph, structured data) per page type.
- FR4 — Integrate Tailwind design tokens mapped to brand colors, typography, spacing; include vertical accent variants.
- FR5 — Enforce TypeScript strict mode, path aliases, and ESLint configuration to maintain code quality.
- FR6 — Ensure hydration boundaries and server components minimize bundle size (<200 KB for anonymous routes).
- FR7 — Offer utilities for feature flags, analytics, and localization injection via dependency-injected providers.

## Content & Data Inputs
- Content fetched from Strapi via REST/GraphQL, cached appropriately.
- Feature flags from Flagsmith, personalization inputs from diagnostics/profile services.
- Localization strings sourced from CMS or translation files (future extension).

## Integrations & Dependencies
- Internal: component library, analytics instrumentation, auth (Auth0/NextAuth), Supabase data access, form engine.
- External: Vercel deployment targets, PostHog analytics SDK, Grafana instrumentation exporters.

## Analytics & KPIs
- Monitor Web Vitals (LCP, FID/INP, CLS), conversion funnels, and navigation drop-offs.
- Track build times, bundle sizes, and static generation performance to catch regressions early.

## Non-Functional Requirements
- Maintain 99.9% availability via Vercel; fallback rendering for flag/timeouts.
- Enforce tree-shaking and code-splitting; use Turbopack build outputs.
- Keep JSX components under 200 lines; break into child components to uphold single responsibility.

## Compliance & Access Control
- Honor GDPR with consent-aware analytics loading and cookie banners.
- Ensure route guards respect role-based access from auth claims.
- Maintain security headers (CSP, SRI, XFO) via Next.js middleware.

## Launch Readiness Checklist
- Route scaffold complete (home, verticals, ebooks, tools, recommendations, profile, subscriptions).
- Performance budgets verified in production-like environment.
- TypeScript build and ESLint pass with zero errors; CI gating configured.
- Documentation added to developer guide describing folder conventions and theming strategy.

## Open Questions & Assumptions
- Need decision on localization framework (next-intl vs custom); placeholder assumed.
- Determine polyfill/load strategy for legacy browsers (support baseline to be defined).
- Assume Vercel Edge Middleware will be introduced later for personalization; plan providers accordingly.
