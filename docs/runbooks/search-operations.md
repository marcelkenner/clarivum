# Search Operations Runbook

## Scope & objectives
- Maintain high-relevance, low-latency Meilisearch indexes for Clarivum discovery surfaces (articles, tools, ebooks).
- Ensure pipelines owned by `SearchIngestionManager` and presented through `SearchViewModel` stay deterministic, observable, and reversible.
- Provide repeatable procedures for schema evolution, index swaps, and ranking adjustments mandated by ADR-009.

## Participants & tooling
- **Primary owner:** Search Platform Manager.
- **Engineering partner:** Full-stack engineer on rotation (weekly).
- **Stakeholders:** Editorial lead (content freshness), Analytics lead (zero-result rate).
- **Tooling:**
  - Meilisearch Cloud console (EU region) & API (`/meilisearch/documentation` index swap endpoints).
  - `@clarivum/search-manager` repository (`SearchIngestionManager`, `SearchTelemetryManager`).
  - Supabase console (webhook backlog, canonical counts).
  - OpenTelemetry dashboards (latency, zero-result, indexing failures).

## Daily index health check
1. **Check ingestion lag:** Review queue metrics from the ingestion job dashboard; backlog must stay < 50 records per index. Escalate if above threshold for 2 consecutive runs.
2. **Validate index parity:** Compare Meilisearch document counts to Supabase canonical counts via `npm run search:counts`. Differences > 0.5% trigger the drift flow below.
3. **Latency guardrail:** Confirm search latency p95 < 100 ms in the Observability dashboard. If exceeded, capture query samples for tuning review.

## Weekly maintenance tasks
- **Telemetry review:** `SearchTelemetryManager` exports zero-result queries; triage top 10 into backlog issues with proposed synonyms or content gaps.
- **Backup export:** Run `npm run search:export -- --index articles` to archive JSON snapshots for disaster recovery.
- **Key rotation reminder:** Check Secrets Manager expiration dates; schedule rotations >30 days old.

## Schema change & index swap procedure
Use index swaps to achieve zero downtime while applying schema migrations (per Context7 `/meilisearch/documentation` guidance).

1. **Design the migration:**
   - Update schema definitions in `search-manager/src/schema/{domain}` and write migration script (`SearchSchemaMigration` class).
   - Add regression fixtures for representative queries.
2. **Create staging index:** Deploy migration to staging Meilisearch; smoke test via `SearchViewModel` Storybook scenarios.
3. **Provision shadow index:** In production, create `articles_vNEXT`, `tools_vNEXT`, etc., and ingest full dataset using the migration script. Monitor tasks queue until completed.
4. **Swap atomically:** Execute swap request once verification passes.
   ```bash
   curl -X POST "$MEILISEARCH_URL/swap-indexes" \
     -H "Authorization: Bearer $MEILI_ADMIN_KEY" \
     -H "Content-Type: application/json" \
     --data-binary '[{"indexes":["articles","articles_vNEXT"]}]'
   ```
5. **Post-swap validation:** Re-run parity check, confirm search latency, and archive `*_vPREV` index after 48 hours of stable operation.

## Relevance tuning workflow
1. **Collect evidence:** Use analytics to identify queries with low CTR or high zero-result rate.
2. **Prototype factors:** Adjust ranking rules (typo tolerance, word proximity) locally; record changes in `SearchRelevanceConfig`.
3. **A/B in staging:** Run manual evaluation with curated query list; gather editorial feedback.
4. **Promote:** Update production config via feature flag and monitor for 24 hours.
5. **Document:** Log adjustments in `docs/analytics_events.md` and append summary to this runbook's changelog section.

## Drift or outage response
1. **Trigger condition:** Count mismatch >0.5%, ingestion backlog > 200, or Meilisearch availability alert.
2. **Stabilize ingestion:** Pause new webhook processing via Flagsmith `search_ingest_enabled=false`.
3. **Diagnose:**
   - Review Meilisearch task queue for failed jobs.
   - Inspect ingestion worker logs for serialization errors or upstream Strapi outages.
4. **Recover:**
   - Re-run failed batch via `SearchIngestionManager.retryFailedBatch(indexUid)`.
   - If corruption suspected, rehydrate index from latest snapshot (`npm run search:restore -- --index articles --snapshot snapshots/articles-YYYYMMDD.json`).
5. **Communicate:** Post status in `#clarivum-dev` (include incident start/end, root cause, follow-ups).
6. **Resume ingestion** once parity restored and latency within limits.

## Rollback procedure
1. Identify prior stable index (`articles_vPREV`) retained for 7 days.
2. Swap back to previous index using the same `/swap-indexes` API payload.
3. Run `npm run search:invalidate` to purge CDN caches affected by stale data.
4. File incident report outlining root cause, rollback timestamp, and remediation plan.

## Change log
- **2025-10-23:** Initial runbook covering schema swaps, relevance tuning, and drift response.
