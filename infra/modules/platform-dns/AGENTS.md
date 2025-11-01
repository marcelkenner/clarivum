# infra/modules/platform-dns · AGENTS Guide

## Scope

- Manage the Route53 hosted zone for Clarivum domains when Terraform owns DNS.
- Create CloudFront alias records that map platform hostnames to the distribution managed by `platform-cloudfront`.

## Key Terraform Components

- `aws_route53_zone.this` is optional; gated behind `create_zone`. Callers must pass an existing zone ID for shared accounts.
- `aws_route53_record.aliases` iterates over `var.aliases` and always targets the CloudFront distribution domain/zone; records are type `A` alias.
- `local.hosted_zone_id` centralises zone selection and feeds module outputs.

## Inputs & Coordination

- Required when creating records: `zone_name`, `aliases`, `cloudfront_domain_name`, `cloudfront_hosted_zone_id`.
- Set `create_zone=false` in environments where DNS resides elsewhere and wire `existing_zone_id` to that zone.
- Whenever adding hostnames, update CloudFront `alternate_domain_names` simultaneously and ensure certificates cover them.

## Implementation Notes

- Keep alias names fully qualified (e.g., `app.clarivum.com.`). Relative names may behave differently depending on the hosted zone.
- If non-CloudFront records are needed (MX/TXT), add a new Terraform module dedicated to DNS miscellany to keep this one focused on distribution aliases.
- Route53 records propagate globally; avoid unnecessary churn by batching related changes.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` and double-check record previews before applying.
- For new hosted zones, confirm name servers are delegated at the registrar.
- After deployment, use `aws route53 test-dns-answer` to validate alias resolution.
- Execute `npm run ensure:agents` and consult Route53 docs via Context7 prior to changing record strategies.
