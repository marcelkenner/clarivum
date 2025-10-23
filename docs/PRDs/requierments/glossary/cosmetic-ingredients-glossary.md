# Cosmetic Ingredient Glossary Requirements

**Effective:** 2025-02-14  
**Doc owner:** Product Experience · Clarivum Skin  
**Related artifacts:** docs/PRDs/clarivum_brand.md, docs/PRDs/brand_design_system.md

## Overview

- Launch a reusable glossary that explains cosmetic ingredients (INCI and plain-language names) across Clarivum experiences.  
- Support editorial teams with a single source of truth that can power standalone glossary browsing, inline hover definitions, and contextual callouts.  
- Deliver a modular foundation that respects manager/coordinator patterns so UI, business logic, and navigation stay decoupled for future feature growth.

## Goals

- Give visitors a trustworthy reference to decode ingredient labels, discover functions/benefits, and understand safety considerations without medical claims.  
- Reduce bounce from education content by providing context via inline glossary callouts tied to article taxonomies in docs/PRDs/clarivum_brand.md.  
- Enable content, compliance, and brand teams to extend entries with minimal engineering support (new categories, translations, warnings).  
- Provide scalable technical surfaces for search, API reuse, and analytics instrumentation from day one.

## Non-Goals

- Providing medical advice, diagnostic flows, or prescription recommendations.  
- Serving as a regulatory submission system; compliance sign-off remains manual via existing product workflow.  
- Duplicating ingredient calculators or quiz flows (future tasks will decide those scope items).  
- Replacing broader product copy guidelines documented in docs/PRDs/brand_design_system.md.

## Target Users & Use Cases

- **Curious skincare consumer:** needs quick definitions, common aliases, and safety notes while reading articles or browsing products.  
- **Editorial strategist:** requires batching new entries, updating statuses, and previewing how glossary content renders inline.  
- **Customer support:** needs canonical talking points to answer ingredient-specific questions consistently.  
- **Partnerships/compliance reviewer:** verifies statements align with external regulations and brand policy before publication.

## Content Model Requirements

- **Entry identity:** unique slug (URL-friendly), INCI name, common name(s), alternate spellings, and CAS number when available.  
- **Taxonomy:** multi-select categories (function, texture, origin, concern pairing) mapped to Clarivum Skin pillar taxonomy.  
- **Status flags:** publication state (draft/reviewed/published), compliance approval timestamp, reviewer attribution.  
- **Narratives:** short description (≤ 280 characters), deep dive (rich text), usage guidance, known sensitivities, pairing recommendations, and contraindication notes.  
- **Regulatory metadata:** region coverage (EU, US, etc.), max concentration guidance ranges, banned/flagged jurisdictions.  
- **Media hooks:** optional icon, molecular illustration, and reference links (scientific papers or brand guidance).  
- **Localization:** content fields must accept language codes to support future Polish/English parity without reworking the data model.  
- **Versioning:** maintain changelog entries (timestamp, author, change summary) for auditability; expose latest update date in UI.

## UX & Interaction Requirements

- Standalone glossary screen with alphabetic index, search, filters, and entry cards summarizing top-level fields.  
- Detail page layout separating quick facts (INCI, common names, function, usage) from deeper narrative content and references.  
- Inline hover/tap micro-card component embeddable in articles and CTAs; respect mobile touch targets and accessible focus states.  
- Surface cross-links for related ingredients, recommended routines, and PRD-defined flagship downloads to boost engagement.  
- Provide empty states for new categories and search results, echoing brand tone from docs/PRDs/clarivum_brand.md.  
- Distinct ViewModel per surface (list ViewModel, detail ViewModel, inline popover ViewModel) with dependency injection to dedicated managers for data fetch, formatting, and policy enforcement.

## Search, Navigation & Discovery

- Global search box with debounced typeahead returning top five matches plus “view all results” action.  
- Filters for function category, skin concerns, texture, regulatory status, and vegan/cruelty-free badges.  
- Alphabetical jump navigation (anchors) with sticky header for quick letter access on desktop.  
- Allow linking by slug (e.g., `/glossary/niacinamide`) with Coordinator responsible for routing decisions and state restoration.  
- Track empty searches and filter combinations with zero results to inform backlog grooming.

## Integration & Extensibility

- Expose a Manager API handling retrieval, caching, and normalization of glossary entries for consumption by web surfaces and future mobile clients.  
- Provide Coordinator contracts so other flows (onboarding quiz, product comparisons) can request glossary navigation without coupling to UI details.  
- Inline glossary component must publish events for analytics (e.g., hover duration, click-through) with payloads sanitized per privacy policy.  
- Align data fetching with Next.js App Router server component guidance (Context7: Next.js data fetching and caching) to balance static rendering and dynamic updates; default to cache revalidation as needed for timely content changes.  
- Allow injection of alternate data sources (e.g., regulatory APIs) via adapter interfaces, keeping base manager focused on Clarivum-authored content.

## Accessibility & Compliance

- WCAG 2.2 AA minimum: ensure keyboard navigation, focus outlines, and ARIA patterns for popovers/tooltips.  
- Provide pronunciation guide or phonetic spelling for INCI terms to aid screen reader users.  
- Guarantee color contrast aligns with Tailwind design tokens defined in docs/PRDs/brand_design_system.md.  
- Include citation list for each entry; link text must be descriptive rather than bare URLs.  
- Respect privacy policies when logging glossary interactions; no PII captured in analytics payloads.

## Performance & Technical Requirements

- Page interaction (search, filter) must respond within 150 ms (p95) on modern mobile devices over 4G.  
- Initial glossary index should load within 1.2 s (TTFB p95) for Poland users, aligning with docs/README.md performance targets.  
- Support incremental static regeneration or cache revalidation so updates appear within 15 minutes of publish.  
- Ensure schema compatible with future headless CMS or knowledge base exports (JSON schema documented alongside implementation).  
- Provide API fallback strategy if data store unavailable (graceful degradation message, no blank screens).

## Observability & Success Metrics

- Instrument search queries, filter selections, entry views, inline hover usage, and CTA clicks.  
- Monitor glossary page conversion to flagship downloads outlined in docs/PRDs/clarivum_brand.md.  
- Establish alert thresholds: search error rate < 0.5%, API latency p95 < 250 ms, failed publish jobs escalated within one hour.  
- Dashboards must segment metrics by device category and locale to inform iteration.

## Operational Guidelines

- Content governance cadence: monthly compliance review, quarterly taxonomy audit, and ad-hoc updates as new ingredients trend.  
- Maintain contributor workflow: draft → SME review → compliance approval → publish with audit trail stored in source of truth.  
- Provide editor sandbox environment mirroring production data schema for safe previews.  
- Document runbook for incident response when glossary data becomes stale or inaccurate (tie into docs/runbooks/incident-response.md).  
- Update tasks board (tasks/README.md process) whenever glossary changes require engineering follow-up or new feature work.

## Open Questions & Risks

- Source of truth tooling: confirm whether initial launch relies on in-repo seed data, CMS integration, or external partner feeds.  
- Translation workflow: decide on sequencing for Polish/English parity and whether external localization vendors are involved.  
- Regulatory compliance depth: clarify responsibility for maintaining region-specific concentration thresholds.  
- Long-term storage: determine if we need archival for deprecated ingredients or if soft delete suffices.

