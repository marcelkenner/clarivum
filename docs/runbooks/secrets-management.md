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
  - Terraform configurations (`infra/secrets/` module).
  - GitHub Actions secrets sync pipeline.
  - AWS ECS/App Runner deployment tooling for injecting secrets into task definitions.
  - CloudTrail + Grafana for access monitoring.

## Secret lifecycle
1. **Request intake:**
   - Fill secrets request form (Notion) with owner, environment, classification, rotation cadence, usage context.
   - Owner approves and assigns IAM permissions.
2. **Creation steps:**
   - Define name using `/clarivum/<env>/<service>/<secretName>` convention.
     - Aurora provisioning (`infra/aws/data`) automatically creates `/clarivum/database/<env>/{writer_url|reader_url|iam_role}`. Do not edit these manually; rotate via Terraform apply and update consuming services.
   - Store value via AWS CLI:
     ```bash
     aws secretsmanager create-secret \
       --name "/clarivum/prod/payments/stripe-secret-key" \
       --secret-string '{"value":"sk_live_...","owner":"payments"}'
     ```
   - Tag with `Owner`, `RotationDays`, `Classification`.
   - Update Terraform state if managed via IaC to avoid drift.
3. **Propagation:**
   - GitHub Actions job fetches secrets and syncs to ECS task definitions or Parameter Store (`npm run secrets:sync`).
   - For Lambda workloads, ensure IAM role has `secretsmanager:GetSecretValue` scoped to path.
   - Document secret in service README and link to this runbook.

## Rotation procedure
1. **Schedule:** Minimum every 90 days; align with provider requirements (Stripe, Plausible Analytics, Upstash).
2. **Execution:**
   - Generate new credential; update secret using `put-secret-value`.
   - Run `npm run secrets:sync -- --service payments` to push to ECS task definitions.
   - Restart dependent workloads (redeploy ECS service, redeploy Lambda).
3. **Validation:**
   - Confirm health checks succeed (e.g., Stripe ping, Plausible Analytics API).
   - Monitor CloudWatch/Grafana for errors during 1-hour observation window.
4. **Cleanup:** Delete previous secret version if provider revokes old credentials automatically. Otherwise, schedule manual revocation.

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
- **2025-11-09:** Updated AWS-only rotation workflow and secret naming conventions after retiring legacy hosting integrations (TSK-PLAT-080).
- **2025-10-23:** Initial secrets management runbook covering lifecycle, rotation, CI sync, and incident handling.
