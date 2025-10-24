# Incident Response Runbook

Use this runbook whenever an operational issue threatens Clarivum’s SLOs, security posture, or customer trust. All responders must be familiar with these steps before joining on-call rotations.

## Roles & communication

- **Incident Commander (IC):** First on-call engineer unless otherwise assigned.
- **Communications Lead:** Product or marketing representative responsible for stakeholder updates.
- **Scribe:** Captures timeline and actions in the incident doc (Notion link stored in PagerDuty runbook).
- **Channels:** Primary coordination in `#clarivum-oncall`. Escalation to voice/video via Zoom within 5 minutes for Sev-1 incidents.

## Severity levels

| Severity | Description | Examples | Target response | Target resolution |
|----------|-------------|----------|-----------------|-------------------|
| Sev-1    | Full outage or major degradation (error budget burn > 10%/hr) | 5xx spike on primary journey, data breach, auth outage | Page IC immediately | ≤ 1 hour |
| Sev-2    | Partial outage or degraded experience (error budget burn > 5%/hr) | CTA flow fails for a segment, latency exceeds p99 budget | Respond in 10 minutes | ≤ 4 hours |
| Sev-3    | Minor issues with limited customer impact | Admin tooling degradation, stale analytics | Respond same business day | ≤ 2 business days |

## Response checklist

1. **Acknowledge alert:** PagerDuty assigns IC; IC announces acknowledgment in `#clarivum-oncall`.
2. **Stabilize & triage:**
   - Verify the issue via Grafana dashboards and logs.
   - Capture current metrics (latency, error rate, affected regions).
   - If security-related, immediately rotate secrets if compromise suspected.
3. **Mobilize team:** Assign roles (Communications Lead, Scribe). Loop in domain experts as needed (Auth0, Supabase).
4. **Mitigate:** 
   - Roll back recent deployments using the deployment runbook if root cause is unclear within 15 minutes (Sev-1).
   - Toggle feature flags to disable suspect features.
   - Apply hot fixes only if rollback is impossible.
5. **Communicate:**
   - Update incident status every 15 minutes (Sev-1) or 30 minutes (Sev-2) in Slack.
   - Post status page updates if customer visible (template stored in Statuspage).
6. **Resolve:** Once service returns to normal, mark the incident resolved with timestamp and summary.
7. **Post-incident:** 
   - Within 24 hours, complete a blameless postmortem (Notion template). Include timeline, contributing factors, remediation tasks, and lessons.
   - File follow-up tickets with explicit owners and due dates.

## Tooling references

- **Monitoring:** Grafana dashboards (`Clarivum/Platform-SLO`, `Clarivum/Auth`, `Clarivum/Jobs`).
- **Logs:** Grafana Loki → query presets saved as `Incident triage`.
- **Tracing:** Grafana Tempo search for trace IDs from failing requests.
- **Operations hub:** `/ops` overview for incident banners, module health, audit log access, and deep links into native consoles (Strapi, Listmonk, Stripe, Grafana).
- **CI/CD:** GitHub Actions overview for recent deployments.
- **Feature flags:** Flagsmith admin UI (production environment).

## Escalations

- If IC cannot stabilize within 30 minutes (any severity), escalate to engineering lead and CTO.
- Security incidents must notify DPO/legal within 72 hours (GDPR); Communications Lead coordinates statements.
- For third-party outages (Auth0, Vercel, Supabase), open support tickets immediately and link them in the incident doc.

Review this runbook quarterly during the reliability review. Update contacts, tooling links, and severity guidance as the platform evolves.

## Change log
- **2025-10-24:** Added Operations Hub reference to tooling checklist.
