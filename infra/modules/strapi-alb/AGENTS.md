# infra/modules/strapi-alb · AGENTS Guide

Terraform module that provisions the Strapi-facing Application Load Balancer, listeners, and Route53 record.

## Key decisions

- Health check path defaults to `/api/healthz` per ADR-010; override via `health_check_path` only if the Strapi service changes its probe.
- ACM certificates must live in the same region (eu-central-1). Use the shared certificate inventory doc before updating `certificate_arn`.
- Access logs are optional—set `access_logs_bucket`/`_prefix` when compliance requires raw ALB logs.

## Inputs/Outputs

- Required inputs: `name`, `vpc_id`, `public_subnet_ids`, `certificate_arn`, `domain_name`, `route53_zone_id`.
- The module exports ALB/target group ARNs and security group IDs; downstream services rely on those for CloudWatch alarms and ECS wiring.

## Validation

1. Ensure `terraform fmt infra/modules/strapi-alb/main.tf`.
2. From `infra/strapi/`, run `terraform plan` with `-var-file=env/dev.tfvars` to confirm schema (module changes propagate through caller).
3. When adjusting listeners, check AWS docs via Context7 (`/aws/elasticloadbalancing`) for the latest TLS policies or required fields.

## Guardrails

- Always enable deletion protection in production (`enable_deletion_protection = true`).
- Keep default ingress CIDRs as `0.0.0.0/0`; any restriction must be signed off by networking owners and mirrored in runbooks.
- Update `docs/runbooks/deployment.md` if you add new alarms or change DNS behavior.
