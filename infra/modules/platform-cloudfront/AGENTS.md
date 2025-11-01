# infra/modules/platform-cloudfront · AGENTS Guide

## Scope

- Front the platform with a CloudFront distribution that fans out to static S3 content and the HTTP API.
- Issue and validate the us-east-1 ACM certificate required for custom domains.
- Enforce perimeter protection through WAF managed rule sets and geo/rate limits.
- Deliver detailed access logs into the shared logs bucket.

## Key Terraform Components

- `aws_cloudfront_distribution.primary` defines behaviour stacks (static default, api/\* ordered rule) and logging; keep origins in sync with `platform-storage` and `platform-api` outputs.
- `aws_cloudfront_origin_access_control.static` replaces legacy OAI; ensure referenced bucket policies accept SigV4 requests only.
- `aws_acm_certificate` + validation records must stay in us-east-1; use the `aws.us_east_1` provider alias consistently.
- `aws_wafv2_web_acl.this` ships with AWS managed rule sets plus custom geo + rate rules. Adjust priorities when adding new statements to avoid collisions.
- Logging writes to `${logs_bucket_name}`; confirm that bucket lifecycle in `platform-storage` covers the `cloudfront/` prefix.

## Inputs & Coordination

- Required: `domain_name`, `static_bucket_domain_name`, `api_domain_name`, `logs_bucket_name`, `route53_zone_id`.
- Optional tunables: `alternate_domain_names`, cache policy IDs, `blocked_countries`, `waf_rate_limit`, `price_class`.
- DNS aliases are created in `platform-dns`; when adding new hostnames, update both modules in the same change set.

## Implementation Notes

- Preserve `origin_request_policy_id` for the API origin to forward headers Next.js needs (host, auth). Deviations require app changes.
- Keep behaviours tightly scoped; if additional paths are needed, prefer new ordered behaviours rather than widening the default.
- When adding response headers policies, reuse AWS managed IDs when possible to avoid bespoke infra drift.
- Any new WAF rules should emit to CloudWatch metrics; align metric names with the `${var.name}` convention for dashboards.

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` with both `aws` and `aws.us_east_1` providers configured.
- Confirm certificate validation records in the plan target the correct hosted zone.
- Ensure CloudFront logging buckets exist and versioning/encryption are enabled (`platform-storage`).
- After changes deploy, validate behaviours with `aws cloudfront get-distribution-config` if drift is suspected.
- Execute `npm run ensure:agents` and fetch CloudFront/ACM/WAF references through Context7 before deep changes.
