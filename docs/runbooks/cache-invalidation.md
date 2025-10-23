# Cache Invalidation Runbook

## Scope & objectives
- Govern response caching, rate limiting, and distributed locks powered by Upstash Redis as defined in ADR-006.
- Provide deterministic pathways for key design, invalidation triggers, and emergency bypass for Clarivum edge experiences.
- Maintain observability for cache hit rate, miss penalties, and throttling accuracy.

## Roles & tooling
- **Owner:** Edge Platform Manager.
- **Engineering rotation:** Web platform engineer (weekly).
- **Stakeholders:** Marketing (campaign freshness), QA (release validation), SRE (latency SLO).
- **Tooling:**
  - Upstash console (EU-central) for `clarivum-cache`, `clarivum-guardrails`.
  - `@clarivum/cache` package (`EdgeResponseCache`, `RateLimiterManager`, `DistributedLockCoordinator`).
  - Grafana dashboards (cache hit %, rate limit counts, Upstash usage).
  - Feature flags via Flagsmith (`cache_bypass_enabled`).

## Key naming & TTL conventions
- Namespace format: `<env>:<surface>:<resource>:<variant>`.
- Default TTLs:
  - Marketing pages: 30 min (stale-while-revalidate background refresh).
  - API responses: 5 min unless policy override.
  - Locks/idempotency keys: 5 min or per job SLA.
- Cache entries store JSON payload + metadata:
  ```json
  {
    "version": "v2025-10-21",
    "checksum": "sha256-…",
    "payload": { /* data */ }
  }
  ```
- Maintain version registry in `cache/config/cacheVersionMap.ts`; increment when schema changes.

## Invalidation pathways
1. **Event-driven (preferred):**
   - Content workflows emit domain events (e.g., `article.published`).
   - `CacheInvalidationManager` maps events to key prefixes and enqueues delete commands.
2. **Release-driven:**
   - During deploy, run `npm run cache:version-bump -- --surface marketing`.
   - Bump version to force miss on next request.
3. **Manual purge:**
   - Use CLI: `npm run cache:invalidate -- --key <env:surface:resource>`.
   - Limit manual purges to targeted keys to avoid cold start storms.
4. **Emergency bypass:**
   - Toggle Flagsmith `cache_bypass_enabled=true` for impacted surfaces.
   - Revert once root cause resolved; monitor latency.

## Rate limiting policy updates
- Policies defined in `RateLimiterConfig`. For changes:
  1. Update policy class with new quota/sliding window values.
  2. Deploy to the dev environment; run smoke script `npm run rate-limit:test`.
  3. Monitor Upstash metrics for throttled count anomalies post-release.
- For ad-hoc overrides (e.g., partner demo), apply allowlist entry via `RateLimiterManager.allowTemporaryAccess(ip, ttl)`.

## Observability checklist
- Hit rate ≥ 80% for marketing surfaces; investigate if drop persists > 1 hour.
- Upstash request quota usage < 70% of monthly allocation (alert at 55%).
- Rate limiting errors correlate with metrics; ensure 429 responses include `RateLimit-Limit` headers.
- Emit OpenTelemetry spans with attributes: `cache.hit`, `cache.namespace`, `rateLimit.bucket`.

## Incident response
1. **Symptoms:** Stale or incorrect content, 5xx from Upstash, surge in 429s, latency > SLO.
2. **Immediate actions:**
   - Check Grafana dashboards for hit ratio or Upstash availability.
   - Validate Flagsmith toggles (ensure bypass not inadvertently on/off).
   - Inspect Upstash status page; if outage, enable bypass and notify `#clarivum-dev`.
3. **Mitigation options:**
   - Warm critical keys manually by invoking `CacheWarmupManager`.
   - For corrupted entries, delete prefix and rehydrate via background job.
   - If rate limits overly aggressive, temporarily double allowance and create follow-up ticket.
4. **Communication:** Post status, scope, mitigation plan, and ETA in `#clarivum-leadership`.
5. **Post-incident:** Document root cause, impacted routes, cache changes, and lessons learned in incident tracker.

## Maintenance cadence
- **Weekly:** Review Upstash usage reports, rotate sample keys, confirm TTL compliance.
- **Monthly:** Audit key namespaces for orphaned versions; prune stale prefixes.
- **Quarterly:** Rotate Upstash REST tokens via Terraform, update secrets in AWS Secrets Manager, validate CI pipelines.

## Change log
- **2025-10-23:** Initial runbook outlining key conventions, invalidation paths, and incident handling for Upstash caching.
