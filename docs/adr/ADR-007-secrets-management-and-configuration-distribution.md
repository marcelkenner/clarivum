# ADR-007: Secrets Management & Configuration Distribution
Date: 2025-10-21
Status: Accepted

## Context
- Clarivum spans Vercel (Next.js), AWS Lambda workers, and future Terraform-managed infrastructure; secrets must stay centralized and versioned independently of deployment pipelines.
- Existing guidelines (`docs/policies/security-baseline.md`) forbid plaintext secrets in git or `.env` files and require auditable access with short rotation cycles.
- Marketing and analytics integrations (Auth0 M2M, PostHog, Stripe) demand environment-specific credentials that should roll out to Vercel environments without manual copying.
- GitHub Actions and Terraform workflows need programmatic retrieval of secrets while keeping least-privilege IAM boundaries.

## Decision
- Use **AWS Secrets Manager (eu-central-1)** as the single source of truth for application secrets across all runtimes.
  - Define secrets per environment (`/clarivum/<env>/<service>/<name>`), tagging with owner, rotation interval, and classification.
  - Enable automated rotation for database/API credentials via Lambda rotation handlers where providers support it; minimum rotation cadence is 90 days.
- Provision access policies through Terraform modules (`terraform-aws-modules/secrets-manager/aws`), blocking public policies and granting scoped roles:
  - `clarivum-runtime-vercel` IAM user for Vercel deploy hooks (read-only per environment).
  - `clarivum-runtime-lambda` IAM role assumed by AWS Lambda functions.
  - `clarivum-ci` IAM role limited to read secrets required for CI/CD workflows.
- Synchronize secrets into Vercel using a GitHub Actions job:
  - Fetch values with the AWS Secrets Manager GitHub Action.
  - Inject them into Vercel projects via the Vercel CLI API, ensuring preview/staging/prod parity.
- Maintain a lightweight configuration overlay repository (`infra/config/`) with checked-in non-sensitive defaults and schema definitions; validate via CI to catch missing secrets before deploy.
- Log secret access events to CloudTrail with alerts piped into Grafana Loki for anomaly detection.

## Consequences
- **Benefits:** Centralized governance, audit trails, and automated rotation reduce leakage risk while keeping operational friction low.
- **Trade-offs:** Requires managing IAM and rotation Lambdas; mitigated by Terraform modules and runbook documentation.
- **Constraints:** Secrets Manager is region-bound; cross-region disaster recovery relies on periodic replication tasks captured in the DR plan.
- **Follow-ups:**
  - Document onboarding steps for new secrets in `docs/runbooks/secrets-management.md`.
  - Add CI assertions ensuring no deployment proceeds if required secrets are absent.
  - Evaluate External Secrets Operator if Kubernetes workloads enter scope, to reuse the same source of truth.
