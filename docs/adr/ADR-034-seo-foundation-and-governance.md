# ADR-034: SEO Foundation and Governance Platform
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum targets compound organic growth as a core channel; existing PRDs reference SEO concepts piecemeal without a unifying architecture or ownership model.
- The Next.js 15 app router provides first-class metadata APIs, hybrid rendering, and route segment configuration that can encode SEO rules; today these capabilities are applied inconsistently across templates.
- Content operations depends on Strapi payloads (see `docs/PRDs/requierments/strapi/blog.md`) and publishing runbooks, yet metadata and schema markup drift between releases, creating rework and search ranking volatility.
- Core Web Vitals and rich-result eligibility require deterministic guardrails in CI/CD (per `docs/policies/repository-governance.md` and `docs/diagrams/adr-029-plausible-analytics-platform/`), but there is no single decision record defining the platform responsibilities.

## Decision
- Establish an SEO platform layer owned by the Frontend Platform team delivering:
  - A metadata factory leveraging Next.js `generateMetadata` and layout-level defaults; canonical, robots, OpenGraph, and Twitter tags are derived from a shared config, overridable via typed props.
  - A structured data module system outputting JSON-LD snippets (Article, FAQPage, Product, BreadcrumbList) with validation powered by Ajv schemas and unit tests in `src/lib/seo/__tests__`.
  - Automated sitemap generation (per content type) via ISR/on-demand revalidation and a centralized `src/app/sitemap.ts` orchestrator, plus robots.txt configuration with environment toggles.
  - Guardrails wired into `npm run validate` that fail builds when required metadata/structured data is missing or malformed for templates flagged as indexable.
  - Monitoring hooks: Web Vitals reporting to analytics, daily Search Console ingestion writing metrics JSON snapshots, and broken link detection integrated into CI.
- Codify governance via policy (`docs/policies/seo-governance.md`) and operational runbook (`docs/runbooks/seo-operations.md`); the SEO Lead co-owns guardrails with Platform.
- Reference implementation documented in PRD `docs/PRDs/seo-foundation.md`; tasks TSK-SEO-001/002 orchestrate execution.

## Diagrams
- [Architecture Diagram](../diagrams/adr-034-seo-foundation-and-governance/architecture-overview.mmd) — container view of Next.js metadata and structured data components alongside external services.
- [Data Pipeline Diagram](../diagrams/adr-034-seo-foundation-and-governance/metadata-pipeline.mmd) — sequence tracing CMS content through metadata factory, schema modules, and CI guardrails.
- [UML Component Diagram](../diagrams/adr-034-seo-foundation-and-governance/uml-components.mmd) — component relationships across metadata, structured data, sitemap, robots, and monitoring services.
- [BPMN Governance Workflow](../diagrams/adr-034-seo-foundation-and-governance/bpmn-governance.mmd) — governance cadence from content brief through monitoring and guardrail follow-up.

## Consequences
- **Positive:** Consistent metadata and structured data increase ranking stability, reduce manual QA churn, and make Core Web Vitals guardrails auditable. Automation reduces regression risk and clarifies ownership between engineering and content.
- **Costs:** Requires upfront investment in shared libraries, CI extensions, and analytics plumbing; teams must maintain schema definitions when Google updates guidelines.
- **Risks/Mitigations:** Incorrect automation could over-canonicalize or block indexation -- mitigated through staged rollout, preview environments, and manual QA checklists in the runbook. Additional CI checks extend pipeline time; mitigate by caching validators and limiting checks to touched templates.
- **Follow-ups:** Build diagrams, extend linting to detect orphaned routes, and evaluate need for dedicated search performance dashboards beyond Plausible once telemetry stabilizes.
