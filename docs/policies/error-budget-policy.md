# Error Budget Policy

Clarivum commits to a **99.9% monthly availability SLO** for the customer-facing web experience and a **99.5% availability SLO** for the member API. The corresponding error budgets are:

- Web experience: 43 minutes/month.
- Member API: 3 hours 39 minutes/month.

We treat error budget consumption as the primary signal for prioritizing reliability work. This policy defines how teams respond as consumption increases within a calendar month.

## Burn thresholds & actions

| Error budget consumed | Action |
|-----------------------|--------|
| 0–50%                 | Normal operations. Track burn in reliability review. |
| 50–75%                | Engineering lead reviews recent incidents; mandatory incident reviews completed before new feature deploys. |
| 75–100%               | **Feature freeze**: only P0 security patches and reliability remediations may ship. Runbook owners audit mitigations. |
| >100%                 | Executive visibility. Trigger SEV-1 postmortem, prioritize long-term fixes, and keep freeze until next month or SLO restored. |

## Enforcement

- CI/CD pipeline queries Grafana SLO API before production deploy. If burn ≥ 75%, deployment workflow blocks unless tagged as `reliability-fix`.
- Product roadmap includes a minimum of 20% capacity for reliability debt. Burn > 50% automatically schedules an executive review.
- Incident postmortems must document error budget impact and remediation commitments with target dates.

## Measurement

- Golden signals instrumented via OpenTelemetry export to Grafana. SLO calculations follow the rolling window described in `/docs/architecture.md`.
- Synthetic checks (Checkly) act as a secondary guardrail; they do not replace real-user metrics but tighten detection.
- Burn rate alerts trigger at:
  - 2× burn rate (projected exhaustion within 7 days).
  - 4× burn rate (projected exhaustion within 3 days).

## Review cadence

- Policy reviewed quarterly during the reliability review meeting.
- Adjust SLO targets only through an ADR; do not relax targets without explicit leadership approval.

This policy is effective immediately and applies to all Clarivum production services.
