# Affiliate & Ad Telemetry Runbook

> Complements ADR-033 and the analytics PRD. Maintains day-to-day monitoring, fraud response, and partner reconciliation for affiliate links and on-site ads.

## Purpose
- Ensure every monetization placement (affiliate links, sponsorship cards, display ads) logs impressions and clicks accurately.
- Detect fraud or partner mismatch quickly to protect Clarivum revenue.
- Provide operations, marketing, and finance with a checklist for daily, weekly, and monthly monitoring.

## Scope
- Monetization Impression Service (`/api/monetization/impression`) and Click Redirect Service (`/go/...`).
- Supabase schemas: `monetization_impressions`, `affiliate_click_events`, `monetization_reconciliation`, `monetization_alerts`.
- Plausible dashboard **Monetization & Affiliate Integrity** and Looker/Metabase finance views.
- Partner statement import scripts and discrepancy workflows.

## Preconditions
- ADR-033 implemented (edge functions deployed, background workers active).
- Plausible dashboards shared with marketing/finance.
- Slack channels `#clarivum-partnerships` and `#clarivum-alerts` monitored by on-call rotation.
- Access to partner portals or CSV exports granted to finance ops.

## Daily Checklist
- Review Plausible monetization dashboard for CTR or RPM anomalies (>20% movement vs 7-day baseline).
- Check Grafana panel `Monetization Jobs` for failed redirect/impression jobs; retry and escalate if failures >0.
- Inspect Slack alerts for fraud flags (duplicate IPs, excessive clicks); investigate within 2 business hours.
- Validate top 5 placements manually (load page, confirm impression + click events in logs).

## Weekly Checklist
- Run reconciliation pipeline (`npm run monetization:reconcile --env staging|prod`) and review output in `monetization_reconciliation` table.
- Import partner reports (CSV/API) for key affiliates; compare delta % and document variances >2%.
- Review pending fraud investigations; close or escalate to legal if external follow-up required.
- Audit disclosure modules on new articles to ensure `/jak-zarabiamy/` link present and up to date.

## Monthly Checklist
- Generate revenue share summary for finance; archive in secure drive with partner invoices.
- Refresh synthetic monitors (Checkly/GitHub Actions) hitting `/go/...` endpoints; rotate HMAC keys.
- Perform spot QA of ad creatives, ensuring consent gating and lazy load behaviours still compliant.
- Update Looker dashboard snapshots and share with leadership.

## Incident Response
### Redirect Failures
1. Confirm `/go/...` endpoint availability via synthetic monitor; if down, redeploy edge function.
2. Replay queued events from `affiliate_click_events` with status `pending_forward`.
3. Notify partners if downtime exceeded 15 minutes; document in incident log.

### Fraud Spike
1. Review alert payload (IP, user agent, partner).
2. Temporarily throttle offending partner or placement via Flagsmith.
3. Coordinate with security team (ADR-028) for IP blocking if malicious.
4. File Sisu debugging note and create guardrail issue if repeat occurs.

### Partner Discrepancy
1. Compare internal metrics vs partner statement; identify placements affected.
2. Export supporting CSV from Supabase and share with finance/legal.
3. Escalate to partner via documented contact, referencing discrepancy ticket.
4. Update reconciliation log with outcome and adjust anomaly thresholds if necessary.

## Tooling
- `npm run monetization:reconcile` — daily aggregate and comparison.
- `npm run monetization:synthetic` — triggers synthetic click to validate instrumentation.
- Looker dashboard: `Monetization Integrity`.
- Supabase saved queries: `recent_clicks`, `top_placements_today`, `fraud_flags_open`.

## Access & Permissions
- Marketing: view dashboards, request synthetic tests.
- Finance: export reconciliation tables, approve credit notes.
- Engineering: maintain edge functions, queues, and telemetry pipelines.
- Support: handle user-reported broken links via support macros referencing this runbook.

## Change Log
- 2025-10-27 — Initial version aligned with ADR-033 monetization telemetry platform.
