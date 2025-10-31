# Secrets Management Runbook

## Scope & objectives
- Operate AWS Secrets Manager as the single source of truth for Clarivum credentials per ADR-007.
- Provide onboarding, rotation, synchronization, and incident response procedures covering ECS services, AWS Lambda, CI, and third-party integrations.
- Ensure audits, access reviews, and compliance artifacts stay current.

## Roles & tooling
- **Owner:** Security & Platform Manager.
- **Partners:** DevOps engineer (Terraform), Finance (cost oversight), Privacy officer (audit requests).
- **Tooling:**
  - AWS Secrets Manager (eu-central-1) console + CLI.
- Terraform configurations (`infra/aws/platform` and `infra/strapi`) managed via Terraform Cloud workflows.
  - GitHub Actions secrets sync pipeline.
  - AWS ECS/App Runner deployment tooling for injecting secrets into task definitions.
  - CloudTrail + Grafana for access monitoring.

## Secret lifecycle
1. **Request intake:**
   - Fill secrets request form (Notion) with owner, environment, classification, rotation cadence, usage context.
   - Owner approves and assigns IAM permissions.
2. **Creation steps:**
   - Define name using `/clarivum/<env>/<service>/<secretName>` convention.
     - Platform runtime secrets (`clarivum/platform/<env>/database/*`) are managed by Terraform (`infra/aws/platform`). Never create or edit these secrets manually—open a PR if changes are required.
     - Aurora provisioning (`infra/app-data`) exposes connection metadata only; see outputs for reference.
   - For manually managed secrets (third-party APIs, temporary tokens), use:
     ```bash
     aws secretsmanager create-secret \
       --name "/clarivum/prod/payments/stripe-secret-key" \
       --secret-string '{"value":"sk_live_...","owner":"payments"}'
     ```
   - Tag with `Owner`, `RotationDays`, `Classification`.
   - If the secret is later adopted by Terraform, import it and remove any manual overrides to prevent drift.
3. **Propagation:**
   - Platform Lambda (`platform-<env>-core`) reads database credentials directly from Secrets Manager—Terraform attaches least-privilege policies.
   - GitHub Actions job fetches secrets and syncs to ECS task definitions or Parameter Store (`npm run secrets:sync`) for workloads that cannot assume roles.
   - Document secret in service README and link to this runbook.
   - Document secret in service README and link to this runbook.

## Rotation procedure
1. **Schedule:** Minimum every 90 days for manual secrets. Platform Aurora secrets rotate automatically every 30 days via the AWS managed rotation function (`SecretsManagerRDSPostgreSQLRotationSingleUser`) deployed by Terraform.
2. **Execution (manual secrets only):**
   - Generate new credential; update secret using `put-secret-value`.
   - Run `npm run secrets:sync -- --service payments` (or service-specific sync) to push to consuming runtimes.
   - Restart dependent workloads (redeploy ECS service, trigger Lambda deployment).
3. **Validation:**
   - Confirm health checks succeed (e.g., Stripe ping, Plausible Analytics API).
   - Monitor CloudWatch/Grafana for errors during 1-hour observation window.
4. **Cleanup:** Delete previous secret version if provider revokes old credentials automatically. Otherwise, schedule manual revocation. Terraform-managed secrets will age-out versions automatically following successful rotation.

## Access management
- IAM roles/users:
  - `clarivum-runtime-frontend`: read-only per environment for ECS tasks.
  - `clarivum-runtime-lambda`: scoped to necessary service paths.
  - `clarivum-ci`: limited to CI/CD secrets.
- Quarterly access review:
  - Export secret policies, verify least privilege, remove unused principals.
  - Document review outcome in security log.

## CI/CD integration
- GitHub Actions uses OpenID Connect to assume `clarivum-ci` role.
- Pipeline verifies required secrets via `npm run secrets:verify`.
- Build fails if missing secrets; developer must update runbook if new dependencies introduced.

## Incident response
1. **Indicators:** Unauthorized access alerts, leaked credential reports, failing auth due to compromise.
2. **Immediate steps:**
   - Revoke compromised credentials at provider.
   - Rotate affected secret and sync to environments.
   - Enable feature flag fallback if service disruption expected.
3. **Investigation:**
   - Review CloudTrail logs for access events.
   - Determine blast radius (services, environments).
   - Reset dependent secrets if chain compromise suspected.
4. **Communication:** Notify `#clarivum-leadership`, create incident record with timeline and remediation tasks.
5. **Postmortem:** Update security baseline, add automated detection or guardrails, amend this runbook if needed.

## Audit & compliance
- Maintain secret inventory spreadsheet with owner, rotation date, classification.
- Provide auditors with CloudTrail export and access review evidence.
- Ensure GDPR-related integrations (Auth0, Plausible Analytics) have rotation logs accessible.

## Change log
- **2025-10-30:** Terraform now manages platform runtime secrets with automated rotation (`infra/aws/platform`).
- **2025-11-09:** Updated AWS-only rotation workflow and secret naming conventions after retiring legacy hosting integrations (TSK-PLAT-080).
- **2025-10-23:** Initial secrets management runbook covering lifecycle, rotation, CI sync, and incident handling.
