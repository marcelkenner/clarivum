# infra/modules/platform-cost-controls · AGENTS Guide

## Scope

- Centralise AWS Budgets and Cost Explorer anomaly detection for the platform account.
- Wire notifications into shared SNS topics so FinOps and incident responders see the same signals.
- Provide tunable defaults for budget amount and alert thresholds without editing caller stacks.

## Key Terraform Components

- `aws_budgets_budget.monthly` issues forecasted and actual spend alerts and publishes to SNS by way of `subscriber_sns_topic_arns`. Budgets rely on the existing account cycle, so duplicate names collide; keep `name_prefix` unique.
- `aws_ce_anomaly_monitor.service` (via `aws.ce` provider alias) tracks spend anomalies by AWS service; the subscription pushes alerts to SNS.
- Notification thresholds cascade from `budget_thresholds`; the first value is FORECASTED, the rest actuals. Keep values ascending.
- `anomaly_absolute_threshold` represents the USD floor for anomaly alerts. Use the AWS docs (Context7) when tuning so you understand the impact of absolute vs. percentage thresholds.

## Inputs & Coordination

- Required: `name_prefix`, `notification_topic_arn`. Optional: `budget_amount`, `budget_thresholds`, `anomaly_absolute_threshold`.
- Caller should pass the `platform-observability` `finops_topic_arn`. Changing target topics requires adjusting both modules.
- Tags flow through `var.tags`; keep them consistent with tagging ADRs so cost allocation reports stay accurate.

## Implementation Notes

- Use distinct `name_prefix` per environment to prevent budget name clashes across workspaces.
- When expanding anomaly detection, prefer additional monitors (e.g., linked accounts) rather than mutating the existing one.
- If you require email notifications alongside SNS, add to the caller stack to keep this module focused on AWS-managed constructs.
- Adding cost categories demands prior creation via AWS console/API; reference ARN inputs rather than defining them here.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` ensuring the Cost Explorer provider alias (`aws.ce`) is configured in the root module.
- Confirm budgets stay within AWS per-account limits (20 by default). Deletions take 24 hours; stagger changes.
- After deployment, verify alerts by triggering a test message in SNS (`aws sns publish`) and by validating `anomaly_absolute_threshold` against recent spend in Cost Explorer.
- Execute `npm run ensure:agents` and consult Cost Explorer/Budgets docs through Context7 when altering thresholds or expression logic.
