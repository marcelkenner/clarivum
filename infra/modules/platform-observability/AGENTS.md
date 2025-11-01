# infra/modules/platform-observability · AGENTS Guide

## Scope

- Centralise CloudWatch alarms for the platform (Lambda, API Gateway, DynamoDB, Aurora, CloudFront).
- Manage SNS topics/subscriptions for incident response and FinOps cost channels.

## Key Terraform Components

- `aws_sns_topic.incident` and `.finops` host alert notifications; subscriptions are driven by module variables.
- Metrics alarms target specific namespaces/dimensions. Thresholds come from variables (`lambda_duration_threshold_ms`, `aurora_capacity_threshold`).
- CloudFront alarms require the `aws.us_east_1` provider alias; keep provider configuration aligned with `platform-cloudfront`.

## Inputs & Coordination

- Required context: `name_prefix`, `lambda_function_name`, `api_id`, `dynamodb_table_name`, `cloudfront_distribution_id`, `aurora_cluster_identifier`.
- Inject subscription endpoints through `sns_incident_subscriptions` and `sns_finops_subscriptions` (protocol + endpoint).
- Outputs `incident_topic_arn` and `finops_topic_arn` feed cost controls and runtime alerting stacks.

## Implementation Notes

- Keep alarm names deterministic; dashboards parse on `${name_prefix}-<component>`.
- When adding alarms, document metric namespaces/dimensions in ADRs and expose thresholds via module variables.
- Prefer anomaly detection alarms only after baseline metrics exist; they require additional configuration not modelled here.
- SNS topics are global; avoid accidental recreation by maintaining consistent prefixes per environment.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and ensure provider aliases resolve (especially for CloudFront resources).
- After apply, test subscriptions with `aws sns publish` to validate endpoints respond.
- Review CloudWatch alarm states to confirm they initialise as `OK`.
- Execute `npm run ensure:agents` and read CloudWatch/SNS documentation via Context7 before tuning thresholds.
