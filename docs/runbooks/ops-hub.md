# Clarivum Operations Hub Runbook

## Scope & Objectives
- Operate the Clarivum Operations Hub (COH) described in ADR-031, ensuring operators can triage incidents, manage content/communications, and execute guardrails from a single console.
- Maintain availability, role-based access, and audit integrity for `/ops` modules.

## Roles & Tooling
- **Primary owner:** Operations Program Manager.
- **Engineering liaison:** Platform engineer on-call (rotates weekly).
- **Finance liaison:** Payments Operations Manager.
- **Tooling:** COH UI (`https://app.clarivum.com/ops`), Supabase SQL editor (audit verification), Grafana dashboards, Slack `#clarivum-ops`, Vercel deploy logs, Auth0 dashboard.

## Access & Authentication
1. Users must belong to Auth0 groups `ops_viewer`, `ops_editor`, or `ops_admin`. Finance features additionally require `ops_finance`.
2. Enable forced MFA in Auth0 dashboard → Security → Multi-factor.
3. Supabase `ops_audit` table enforces RLS by Auth0 `sub`. Verify by running:
   ```sql
   select * from ops_audit limit 10;
   ```
   Only operators with appropriate roles should see entries.

## Daily Checklist (09:00 local)
1. Review Operations Hub dashboard:
   - Confirm incident list matches Grafana alert history.
   - Check communication module for SES/Listmonk alerts.
2. Verify Slack digest job succeeded (status banner in Overview).
3. Confirm latest Kaizen issue link loads (top-right widget).
4. Sample audit log entry to ensure events continue to flow.

## Incident Workflow
1. **Detection:** Alert banner appears (fed from Grafana/Novu). Click to view incident details.
2. **Assessment:** Use Overview to inspect SLO charts; open module-specific tabs for deeper data.
3. **Action:** Trigger safe actions (e.g., retry webhook, revalidate ISR) via module buttons. Destructive actions require feature flag + confirmation + optional approval toggle.
4. **Audit:** Confirm action logged under Audit Feed with correct metadata; cross-post summary to `#clarivum-ops`.
5. **Follow-up:** Create or update Kaizen/Sisu tasks directly via integrated quick links.

## Deployment & Rollback
1. Deployments happen through Vercel preview → production flow. Ensure feature flags for new modules remain off until checks pass.
2. Use `flagsmith` to toggle `ops_module_<slug>`. Document toggles in audit log via comment.
3. **Rollback:** If release unstable, disable feature flag, redeploy previous Git SHA via Vercel dashboard, and verify status banner reverts.

## Monitoring & Alerts
- Grafana dashboard `Clarivum / Ops Hub` tracks API latency, error rates, cache hit ratio.
- Supabase function `notify_ops_audit_anomaly` raises Slack alert on unusual patterns (e.g., >10 destructive actions/hour).
- If API proxy hits rate limit, module shows amber banner; retry after TTL or adjust caching.

## Maintenance Windows
- Schedule upgrades during monthly Forest Day when traffic is low; announce 24h prior in Slack and Ops Hub banner.
- Back up Supabase `ops_audit` to S3 monthly via scheduled job (`npm run ops:audit:backup`).

## Troubleshooting
| Symptom | Checks | Mitigation |
|---------|--------|------------|
| Auth loop | Verify Auth0 tenant status; check browser console for missing scope; clear cookies. | Re-sync Auth0 rules, ensure callback URL matches Vercel env. |
| Blank module | Inspect server logs (Vercel), confirm vendor API key in Secrets Manager, check Flagsmith gate. | Rotate credentials, re-enable flag after verifying. |
| Metrics stale | Grafana panel TTL exceeded or API failure. | Refresh token via COH settings, confirm Grafana API key. |
| Audit log missing entries | Supabase RLS misconfigured or cron paused. | Check `ops_audit_ingest` function logs, rerun background job. |

## Security & Compliance
- Quarterly access review: export COH access list and compare with HR roster.
- Ensure audit exports stored per compliance retention (1 year).
- Do not expose full PII; COH masks sensitive attributes by design. Report deviations immediately.

## Change Log
- **2025-10-24:** Initial runbook documenting ownership, daily/incident workflows, deployment, and troubleshooting.
