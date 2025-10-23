# ADR-009: Search & Discovery Platform
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum’s content catalogue spans multilingual blogs, tools, and gated assets that require typo-tolerant, facet-aware search across verticals (Skin, Fuel, Habits).
- Search queries must stay under 100 ms p95 to preserve UX expectations from the marketing PRDs, even when invoked from ISR pages or client-side experiences.
- Editorial workflows (Strapi) emit publish/unpublish events that should instantly refresh the search index without downtime.
- The engineering team needs a managed service to avoid operating a search cluster; deployments must support EU residency and integration with Vercel edge/serverless workloads.
- Discovery experiences and SLAs are defined in `docs/PRDs/requierments/glossary/cosmetic-ingredients-glossary.md` and `docs/PRDs/requierments/homepage/feature-requirements.md`.

## Decision
- Adopt **Meilisearch Cloud (EU region)** as the managed search engine for all user-facing discovery surfaces.
  - Provision separate indexes per domain (`articles`, `tools`, `ebooks`) with language-specific ranking rules.
  - Leverage Meilisearch’s index swapping capability for zero-downtime reindexing during schema changes (per Context7 `/meilisearch/documentation` guidance on swap endpoints).
- Build an ingestion pipeline orchestrated by the `@clarivum/search-manager` service:
  - Strapi webhooks enqueue normalized payloads; background jobs transform content (strip HTML, compute boosts) before pushing via Meilisearch REST API.
  - Maintain idempotent upserts keyed by Strapi document UID and locale.
  - Store schema definitions and ranking rules as code with versioned migrations so rollbacks can restore prior relevance tuning.
- Expose a ViewModel-friendly client (`SearchViewModel`) that wraps the Meilisearch JS SDK with composable filters, personalization hooks, and analytics forwarding.
- Secure access using Meilisearch API keys scoped per client type (public search, admin indexing) and rotate quarterly via Secrets Manager (see ADR-007).
- Emit search telemetry (latency, zero-result rate) through OpenTelemetry spans for observability dashboards.

## Diagrams
- [Architecture Overview](../diagrams/adr-009-search-and-discovery-platform/architecture-overview.mmd) — Strapi ingestion, background processing, and Meilisearch consumption paths.
- [Data Lineage](../diagrams/adr-009-search-and-discovery-platform/data-lineage.mmd) — Index schemas, documents, ranking rules, and sync tracking.
- [UML Client Components](../diagrams/adr-009-search-and-discovery-platform/uml-clients.mmd) — Indexing and querying collaborators with relevance tuning hooks.
- [BPMN Reindex Flow](../diagrams/adr-009-search-and-discovery-platform/bpmn-reindex.mmd) — Zero-downtime schema change and validation process.

## Consequences
- **Benefits:** Meilisearch delivers out-of-the-box typo tolerance, relevance tuning, and atomic index swaps without operating Elasticsearch or maintaining nodes.
- **Risks:** Vendor dependency and quota constraints; mitigate with usage alerts and retention of export scripts to migrate to self-hosted Meilisearch if necessary.
- **Operational notes:** Weekly sync job verifies that index counts match Strapi canonical counts; discrepancies trigger alerts.
- **Follow-ups:**
  - Document schema change and relevance tuning processes in `docs/runbooks/search-operations.md`.
  - Implement automated search regression tests (fixture queries) in CI to catch ranking regressions.
  - Evaluate multilingual synonym sets once localization expands beyond Polish.
