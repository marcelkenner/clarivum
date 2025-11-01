# Clarivum Platform — Terraform Architecture

This directory will hold the infrastructure-as-code definition for the Clarivum **platform** workload (Next.js + API + data tier). The goal is to codify the ad-hoc AWS resources that currently back `platform-dev` and make them repeatable for additional environments.

## Module Layout

| Module | Path | Responsibility | Key Resources |
| --- | --- | --- | --- |
| Network | `modules/platform-network` | VPC, subnets, routing, NAT, flow logs | `aws_vpc`, `aws_subnet`, `aws_route_table`, `aws_nat_gateway`, `aws_flow_log` |
| Security Groups | `modules/platform-security-groups` | Runtime security groups + least-privilege rules | `aws_security_group`, `aws_security_group_rule` |
| Secrets Manager | `modules/platform-secrets` | Database secrets, rotation wiring, CI access policies | `aws_secretsmanager_secret`, `aws_secretsmanager_secret_rotation`, `aws_iam_policy` |
| Data Stores | `modules/platform-data` | DynamoDB table + Aurora references | `aws_dynamodb_table`, outputs re-exporting Aurora info |
| Lambda Runtime | `modules/platform-lambda` | Lambda role, function config, logging, EFS hooks (future) | `aws_iam_role`, `aws_iam_policy`, `aws_lambda_function`, `aws_cloudwatch_log_group` |
| API Gateway | `modules/platform-api-gateway` | HTTP API, integrations, stages, logging | `aws_apigatewayv2_api`, `aws_apigatewayv2_integration`, `aws_apigatewayv2_stage` |
| CloudFront Edge | `modules/platform-cloudfront` | Distribution, origins, behaviors, TLS, WAF binding | `aws_cloudfront_distribution`, `aws_cloudfront_origin_access_control`, `aws_acm_certificate`, `aws_wafv2_web_acl_association` |
| DNS | `modules/platform-dns` | Hosted zone, validation records, environment aliases | `aws_route53_zone`, `aws_route53_record` |
| Observability | `modules/platform-observability` | Dashboards, alarms, SNS routing, log retention | `aws_cloudwatch_metric_alarm`, `aws_cloudwatch_dashboard`, `aws_sns_topic` |
| Cost Guardrails | `modules/platform-cost-controls` | Budgets & anomaly detectors (FinOps blueprint) | `aws_budgets_budget`, `aws_ce_anomaly_subscription` |

The root configuration (`infra/aws/platform`) composes these modules. Each module keeps files below 500 lines by splitting resources into purpose-specific files (`vpc.tf`, `routing.tf`, `outputs.tf`, etc.).

## State & Workspaces

- Remote backend: reuse the S3 + DynamoDB backend described in `infra/README.md`. Provide environment via workspaces (`dev`, `prod`).
- Terraform version: `>= 1.6.0` (matching existing stacks).
- AWS provider: `hashicorp/aws >= 5.0`.

## Existing Resource Inventory (dev)

| AWS service | Identifier | Notes |
| --- | --- | --- |
| VPC | `vpc-0bfe1a3458c531a72` | `platform-dev-vpc` |
| Public subnets | `subnet-00874c5c298320604`, `subnet-06b12c27a3abe5959` | `10.20.1.0/24`, `10.20.2.0/24` |
| Private subnets | `subnet-07958bfe0e465d42e`, `subnet-0b4a2e4455725e8ed` | `10.20.11.0/24`, `10.20.12.0/24` |
| IGW | `igw-05e2c2733ae25a93c` | Attached to VPC |
| NAT Gateway | `nat-04f8a56ed66ed4964` | Tied to EIP `eipalloc-0908ea0b5ca7ae337` |
| Route tables | `rtb-09b3811fba5e6573a` (public), `rtb-08eba3bcb5e8d3677` (private) | Associations already in place |
| Security groups | `sg-07200eefddec7ac38` (ALB), `sg-02fdc33c43d4f74ed` (App), `sg-07cda9d04a455f9b3` (Lambda), `sg-0c15ce9c398884071` (Aurora) | No ingress on Lambda SG |
| CloudFront | `EPHSANK5PAPBA` | Origin access control `E2HXAYNLNBF4IP` |
| API Gateway | `b5snol7qwe` | `$default` stage, Lambda integration `k3uwenm` |
| Lambda | `platform-dev-core` | Currently Python placeholder |
| DynamoDB | `platform-dev-kv` | PAY_PER_REQUEST, KMS `f0172bb9-9e32-467d-a992-07aff4366b85` |
| Aurora cluster | `platform-dev-aurora` | Serverless v2 (2–8 ACU), KMS `f0f8eae9-5742-480a-9160-185d7df17bf0` |
| Secrets Manager | `clarivum/platform/dev/database/*` | `master`, `url` |
| S3 buckets | `clarivum-dev-static-869603330574`, `clarivum-dev-media-869603330574`, `clarivum-dev-cdn-logs-869603330574` | Static assets + logs |

## Import Mapping

Run `terraform import` after scaffolding modules. Sample commands for the dev workspace:

```bash
# Network
terraform -chdir=infra/aws/platform workspace select dev
terraform -chdir=infra/aws/platform import module.platform_network.aws_vpc.this vpc-0bfe1a3458c531a72
terraform -chdir=infra/aws/platform import module.platform_network.aws_internet_gateway.this igw-05e2c2733ae25a93c
terraform -chdir=infra/aws/platform import module.platform_network.aws_eip.nat eipalloc-0908ea0b5ca7ae337
terraform -chdir=infra/aws/platform import module.platform_network.aws_nat_gateway.this nat-04f8a56ed66ed4964
terraform -chdir=infra/aws/platform import 'module.platform_network.aws_subnet.public["eu-central-1a"]' subnet-00874c5c298320604
terraform -chdir=infra/aws/platform import 'module.platform_network.aws_subnet.public["eu-central-1b"]' subnet-06b12c27a3abe5959
terraform -chdir=infra/aws/platform import 'module.platform_network.aws_subnet.private["eu-central-1a"]' subnet-07958bfe0e465d42e
terraform -chdir=infra/aws/platform import 'module.platform_network.aws_subnet.private["eu-central-1b"]' subnet-0b4a2e4455725e8ed
terraform -chdir=infra/aws/platform import module.platform_network.aws_route_table.public rtb-09b3811fba5e6573a
terraform -chdir=infra/aws/platform import module.platform_network.aws_route_table.private rtb-08eba3bcb5e8d3677

# Security groups
terraform -chdir=infra/aws/platform import module.platform_security_groups.aws_security_group.alb sg-07200eefddec7ac38
terraform -chdir=infra/aws/platform import module.platform_security_groups.aws_security_group.app sg-02fdc33c43d4f74ed
terraform -chdir=infra/aws/platform import module.platform_security_groups.aws_security_group.lambda sg-07cda9d04a455f9b3
terraform -chdir=infra/aws/platform import module.platform_security_groups.aws_security_group.database sg-0c15ce9c398884071

# Data + Secrets
terraform -chdir=infra/aws/platform import module.platform_data.aws_dynamodb_table.kv platform-dev-kv
terraform -chdir=infra/aws/platform import module.platform_secrets.aws_secretsmanager_secret.master clarivum/platform/dev/database/master
terraform -chdir=infra/aws/platform import module.platform_secrets.aws_secretsmanager_secret.url clarivum/platform/dev/database/url

# Compute & Edge
terraform -chdir=infra/aws/platform import module.platform_lambda.aws_lambda_function.core platform-dev-core
terraform -chdir=infra/aws/platform import module.platform_lambda.aws_iam_role.core platform-dev-lambda-role
terraform -chdir=infra/aws/platform import module.platform_api.aws_apigatewayv2_api.http b5snol7qwe
terraform -chdir=infra/aws/platform import module.platform_api.aws_apigatewayv2_integration.lambda k3uwenm
terraform -chdir=infra/aws/platform import module.platform_cloudfront.aws_cloudfront_distribution.primary EPHSANK5PAPBA
terraform -chdir=infra/aws/platform import module.platform_cloudfront.aws_cloudfront_origin_access_control.static E2HXAYNLNBF4IP
```

Adjust resource addresses as modules solidify. Additional imports (route table associations, CloudWatch log groups, etc.) will be added alongside the implementation.

## Next Steps

1. Scaffold the root Terraform configuration (`infra/aws/platform`) consuming the modules above.
2. Implement each module, ensuring outputs expose IDs/ARNs needed by dependent modules.
3. Run `terraform plan` with imports to confirm zero-diff.
4. Extend GitHub Actions (`infra-ci`, new deployment workflow) to lint/plan/apply for this stack.
5. Automate Lambda packaging + CloudFront invalidations via CI/CD.

All modules must stay under 200 lines per file and adhere to single responsibility and composable design.
