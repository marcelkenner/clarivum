# infra/modules/platform-network · AGENTS Guide

## Scope

- Build the foundational VPC, subnets, routing, NAT, and optional flow logs for the Clarivum platform.
- Provide opinionated tagging and naming so downstream modules (security groups, Lambda, Aurora) can attach reliably.

## Key Terraform Components

- `aws_vpc.this` sets DNS support/hostnames to true; keep CIDR blocks wide enough for future subnets.
- `aws_subnet.public/private` iterate over maps keyed by AZ; callers must provide AZ-specific CIDR blocks.
- `aws_route_table` resources attach internet/NAT routing; ensure public/private associations stay in sync with subnet definitions.
- `aws_nat_gateway` is single-AZ; `nat_gateway_az` must match one of the public subnet keys.
- Flow logs resources (`aws_cloudwatch_log_group`, IAM role/policy, `aws_flow_log`) are conditionally created via `enable_flow_logs`.

## Inputs & Coordination

- Required: `name`, `cidr_block`, `public_subnets`, `private_subnets`, `nat_gateway_az`.
- Optional: `enable_flow_logs`, `flow_logs_retention_days`, `flow_logs_log_group_name`, `tags`.
- Outputs (`vpc_id`, subnet maps, route tables, flow logs group) feed security groups, Lambda, Aurora, and observability; update consumers if shapes change.

## Implementation Notes

- Do not hardcode AZ suffixes; rely on caller-provided `az` values so environments can span different regions.
- For multi NAT designs, split out a dedicated module to avoid bloating this one; maintain SRP.
- When overriding flow log destinations (e.g., to S3), expose new variables rather than editing the existing log group structure directly.
- Keep tagging consistent (`Tier` public/private). Observability queries depend on these tags.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and ensure CIDR overlaps are not introduced; AWS will reject applies otherwise.
- Verify flow logs IAM policy grants the minimal required permissions.
- After deployment, confirm route tables via `aws ec2 describe-route-tables`.
- Execute `npm run ensure:agents` and consult VPC/NAT docs through Context7 before major topology changes.
