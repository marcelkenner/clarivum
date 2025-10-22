---
# Open Source Stack Strategy
Last Updated: 2025-10-21

Clarivum leans on modern, well-supported open source projects to keep velocity high while protecting maintainability, privacy, and cost ceilings. This document records the selected tools, the rationale behind each choice, and how they map into requirements. Update this file whenever we introduce, retire, or materially change an open source dependency.

## Selection Criteria
- **Mission fit:** Supports Clarivum’s vertical funnels (Skin, Fuel, Habits) and modular architecture.
- **Governance:** Active community, clear release cadence, and security posture (CVE response time ≤30 days).
- **Portability:** MIT/Apache-style licensing preferred; avoid copyleft encumbrances in core runtime.
- **Performance & DX:** Proven compatibility with Next.js 15, React 19, and Vercel serverless constraints.
- **Compliance:** EU-friendly hosting options, GDPR alignment, and observability hooks for auditing.

## Adopted Projects

### Frontend Platform
- **Next.js 15 (MIT)**  
  Full-stack React framework powering the marketing site and gated experiences. App Router enables hybrid rendering, route groups, and ISR, aligning with sitemap requirements in `clarivum_brand.md`. See requirements: `docs/PRDs/requierments/frontend-platform/feature-requirements.md`.
- **React 19 (MIT)**  
  Component model underpinning UI composition. Concurrency features (Transitions, Server Components) help keep interactive diagnostics fast and modular.
- **TypeScript 5 (Apache 2.0)**  
  Enforces type safety, ensuring requirements like diagnostics branching and ecommerce contracts remain reliable.
- **Tailwind CSS 4 (MIT)**  
  Utility-first styling mapped to Clarivum’s design tokens. Works with the component library requirements and preserves performance via JIT compilation.

### Content & Data Layer
- **Strapi (MIT)**  
  Headless CMS managing structured content, taxonomies, disclosures, and localization. Requirements: `docs/PRDs/requierments/strapi/feature-requirements.md`.
- **Supabase (Apache 2.0)**  
  Postgres + Storage stack providing transactional persistence, RLS, and asset delivery. Requirements: `docs/PRDs/requierments/supabase-platform/feature-requirements.md`.
- **PostHog (MIT)**  
  Product analytics platform (self-hosted or cloud) powering event pipelines and funnel dashboards without external data sharing. Requirements: `docs/PRDs/requierments/analytics/feature-requirements.md`.

### Feature Control & Personalization
- **Flagsmith (BSD-3-Clause)**  
  Feature flagging and experimentation with EU hosting. Interfaces with Next.js runtime to deliver progressive rollouts. Requirements: `docs/PRDs/requierments/feature-flags/feature-requirements.md`.
- **Zod (MIT)**  
  Runtime schema validation ensuring incoming data (forms, diagnostics, APIs) meets expectations before storage or personalization logic executes. Requirements: `docs/PRDs/requierments/form-engine/feature-requirements.md`.
- **React Hook Form (MIT)**  
  High-performance form state management enabling accessible, dynamic form experiences in tools, diagnostics, and checkout. Included in `docs/PRDs/requierments/form-engine/feature-requirements.md`.

### Observability & Quality
- **OpenTelemetry (Apache 2.0)**  
  Standardized tracing, metrics, and logging instrumentation across frontend and backend. Requirements: `docs/PRDs/requierments/observability/feature-requirements.md`.
- **Grafana OSS Stack (AGPL/Apache mix)**  
  Tempo, Loki, and Prometheus (via Grafana Cloud or self-host) for visualization, alerting, and retention, aligned with ADR-004.
- **Storybook (MIT)**  
  UI workbench for the component library, supporting visual review and documentation. Requirements: `docs/PRDs/requierments/storybook/feature-requirements.md`.
- **Vitest (MIT) & Testing Library (MIT)**  
  Unit and component testing stack optimized for Vite/Next.js bundlers, ensuring rapid feedback loops. Requirements: `docs/PRDs/requierments/testing-stack/feature-requirements.md`.
- **Playwright (Apache 2.0)**  
  Cross-browser end-to-end testing covering primary funnels (lead magnet, checkout, subscription). Also documented in `docs/PRDs/requierments/testing-stack/feature-requirements.md`.

## Governance & Maintenance
- Track critical releases monthly; aim to adopt security patches within two weeks and feature releases within one quarter after risk review.
- Security: subscribe to project advisory feeds; log CVE triage notes in `docs/policies/security-advisories.md` (to be created).
- Licenses: maintain SPDX inventory in `compliance/open-source-report.csv` (roadmap item). Ensure third-party notices ship with production artifacts.
- Contribution policy: minor fixes can be upstreamed by engineering after legal approval; avoid proprietary roadmap leakage.

## Evaluation Backlog
- **Drizzle ORM** for typed database migrations (investigate compatibility with Supabase RLS).
- **Checkly OSS Runner** for synthetic monitoring if Grafana Synthetic Monitoring becomes cost-prohibitive.
- **Meilisearch** as future full-text search engine for content discovery (pending search requirements).

Document additions or removals via PR, updating corresponding requirement files and ADRs where relevant.
