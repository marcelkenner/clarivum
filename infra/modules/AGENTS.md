# infra/modules · AGENTS Guide

Reusable Terraform modules that back Clarivum infrastructure live here. Every module must stay provider-agnostic apart from AWS specifics explicitly required by ADR-001 and ADR-010.

## Conventions

- Use module namespaces `strapi-*`, `aurora-*`, `app-*`, etc. Keep inputs camel_case to mirror Terraform community style.
- Surface only validated outputs (ARNs, names) that downstream root configs consume; avoid leaking entire resource objects.
- Document required inputs in the module-level README (or AGENTS) and reference governing ADRs.
- Tag all managed resources via a `tags` variable merged with environment defaults.

## Local validation

Run from repo root unless noted:

- `terraform -chdir=infra/modules/<module>` is **not** supported; modules rely on callers. Test using `terraform -chdir=infra/strapi plan` with updated callers.
- Format module files: `terraform fmt infra/modules/<module>` (or run `terraform fmt -recursive`).
- Static analysis: `tflint --chdir infra/strapi` (module code is linted when invoked by the root module).

## Authoring tips

- Declare required provider blocks to lock AWS provider version `>=5.0`.
- Prefer `for_each` loops and locals for derived values instead of inline string concatenation.
- Keep optional features behind feature flags/variables (`enable_firelens`, `enable_http_redirect`) with sane defaults.
- When adding metrics or alarms, document the CloudWatch namespace/dimensions so operators can cross-check dashboards.

Update the per-module AGENTS files alongside module changes for implementation details.
