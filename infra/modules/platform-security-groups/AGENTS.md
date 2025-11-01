# infra/modules/platform-security-groups · AGENTS Guide

## Scope

- Define the shared security groups governing edge, application, Lambda, and database traffic inside the platform VPC.
- Encode least-privilege ingress paths between components while keeping egress permissive for bootstrapping.

## Key Terraform Components

- `aws_security_group.alb/app/lambda/database` each focus on a single layer; avoid piling multiple responsibilities into one group.
- Ingress rules are explicit resources (`aws_security_group_rule.alb_to_app`, etc.) to make dependencies and descriptions clear.
- Tags annotate `Component` and `Layer`; observability filters depend on this metadata.

## Inputs & Coordination

- Required: `name`, `vpc_id`. Optional: `alb_ingress_cidrs`, `app_port`, `database_port`, `lambda_egress_cidrs`, `tags`.
- Outputs (`*_security_group_id`) feed ALB, ECS/Lambda, Aurora, and rotation functions. Update consumers when renaming or splitting groups.

## Implementation Notes

- Keep ALB ingress CIDRs tight in non-production environments if possible; default `0.0.0.0/0` is acceptable only when paired with WAF/CloudFront.
- When adding new east-west flows, prefer creating dedicated security groups and linking them here rather than expanding existing ones.
- For compliance, consider swapping Lambda egress CIDRs from `0.0.0.0/0` to VPC CIDRs plus specific external endpoints; document trade-offs.
- If you need security group references from other accounts, expose dedicated outputs instead of reusing internal ones.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and confirm rule diffs match expectations (look for `security_group_rule` updates).
- After apply, verify connectivity with VPC Reachability Analyzer or manual smoke tests.
- Keep egress `0.0.0.0/0` flagged in ADRs if left open.
- Execute `npm run ensure:agents` and reference EC2 security group docs through Context7 prior to structural changes.
