# infra/modules/platform-api · AGENTS Guide

## Scope

- Provision the shared HTTP API Gateway facade for the Next.js runtime.
- Proxy all routes through a single AWS_PROXY integration to the runtime Lambda.
- Emit structured access logs so observability dashboards remain consistent.

## Key Terraform Components

- `aws_apigatewayv2_api.http` defines the HTTP API surface; avoid renaming without coordinated DNS updates.
- `aws_apigatewayv2_integration.lambda` attaches the runtime Lambda invoke ARN; keep payload format `2.0` for Next.js.
- `aws_apigatewayv2_route.root` and `.proxy` guarantee universal routing; add new routes only when API Gateway-native features are required.
- `aws_apigatewayv2_stage.default` owns throttling, auto deploy, and JSON log formatting. Retune limits via module variables rather than inline edits.
- `aws_cloudwatch_log_group.access` retention comes from `access_log_retention_days`; align with central logging policy.
- `aws_lambda_permission.api_invoke` must reference the Lambda function ARN output by `platform-lambda`; update both modules together.

## Inputs & Outputs

- Required inputs: `name`, `lambda_function_arn`, `lambda_invoke_arn`; they come directly from `platform-lambda`.
- Optional tunables: `throttle_burst_limit`, `throttle_rate_limit`, `metrics_enabled`, `access_log_retention_days`.
- Outputs consumed downstream: `api_id`, `execution_arn`, `invoke_url`. Coordinate with `platform-cloudfront` and routing stacks before renaming.

## Implementation Notes

- Keep the module free of route-specific business logic; place authorisation or routing decisions inside the Lambda handler or dedicated authorizers.
- When adding authorizers, prefer separate modules and inject ARNs through variables to keep composition clean.
- To support canary deployments, create additional stages rather than mutating `$default`; expose stage URLs through new outputs if needed.
- Ensure log fields remain JSON-serialisable; dashboards rely on the current schema (`requestId`, `routeKey`, etc.).

## Validation Checklist

- Run `terraform plan -chdir=infra/dev` (or target workspace) after edits; module-level plans are not supported.
- Confirm throttling values are in sync with WAF rate limits defined in `platform-cloudfront`.
- Verify CloudWatch log retention by inspecting the `retention_in_days` value in the plan.
- Execute `npm run ensure:agents` so documentation stays synchronised.
- For API Gateway specifics, pull AWS documentation via Context7 (`resolve-library-id` + `get-library-docs`).
