# Monthly Cost Review Runbook

Clarivum targets predictable spend with a cap of **$2.5k/month** at 10× projected launch traffic. Follow this runbook at the start of every month and whenever spend crosses alert thresholds (50%, 75%, 90%).

## Participants & tools

- **FinOps owner:** Engineering lead (primary), Finance partner (secondary).
- **Dashboards:** AWS Cost Explorer, AWS Budgets, CloudFront usage reports, Aurora performance insights.
- **Reports:** Exported CSV from AWS (linked in shared drive), CloudFront spend JSON (`npm run cost:export`), Aurora/S3 usage metrics.

## Standard review (monthly)

1. **Preparation (Day 1–2):**
   - Review `docs/finops/aws-cost-optimization-blueprint.md` and note any divergence between the selected track/levers and current spend so follow-up actions stay aligned.
   - Pull previous month’s AWS Cost Explorer report (grouped by service, tag `clarivum:environment`).
   - Export CloudFront usage by distribution/environment; capture bandwidth, Lambda@Edge/Function URLs invocations, and cache hit ratios.
   - Export Aurora (storage, IOPS) and S3 usage (storage, data transfer) and compare to plan thresholds.
2. **Baseline reconciliation:**
   - Verify totals align with finance ledger; flag discrepancies > 5%.
   - Update the cost tracking spreadsheet (tab: `2025`).
3. **Variance analysis:**
   - Identify services with > 10% month-over-month change.
   - Attribute variance to events (campaigns, new features, incidents).
   - Highlight any spend without tagged environment (`untagged` filter in Cost Explorer) and create follow-up tickets.
4. **Rightsizing actions:**
   - Review Lambda concurrency and duration metrics; adjust reserved concurrency if underutilized.
   - Evaluate Aurora storage growth; archive cold tables > 120 days to Glacier or S3 Infrequent Access per retention plan.
   - Check CloudFront bandwidth spikes; ensure caching headers are correct and consider asset optimization.
5. **Budget thresholds:**
   - Confirm AWS Budgets alerts are set for 50/75/90% and routed to `#finops-alerts` Slack channel.
   - If actual spend exceeded 75%, schedule a corrective actions meeting within 3 business days.
6. **Report out:**
   - Summarize findings in the monthly reliability review doc (Section 12 PTRD).
   - Share highlights in `#clarivum-leadership` Slack channel.

## Mid-cycle alert response

When automated alerts fire:

1. **Acknowledge** alert and log timestamp + amount in the runbook log (Notion).
2. **Diagnose** quickly using live dashboards; confirm if spike is transient or sustained.
3. **Mitigate:**
   - Throttle non-essential jobs (feature flag or job configuration).
   - Pause preview environments / heavy analytics tasks if they drive the spike.
4. **Communicate** status and mitigation plan to leadership within 1 hour.
5. **Follow-up** with a retro summary once costs return to baseline.

## Annual tasks

- Review service contracts and renegotiate tiers (CloudFront, Flagsmith, Auth0) based on actual usage.
- Benchmark spend efficiency against industry targets (~27% waste is average; aim for ≤10%).
- Evaluate whether additional cost observability tooling (CloudZero, Finout) is warranted.

Keep this runbook version-controlled. Any change to targets or tools requires approval from the engineering lead and finance partner.
