# Security Baseline (Startup Scale)

Clarivum adopts the following minimum security controls from day one. They align with OWASP, CIS Controls IG1, and internal compliance needs (GDPR, CCPA readiness).

## Identity & access management

- **MFA:** Enforced for all admin/editor accounts through Auth0. Member MFA optional but supported.
- **RBAC:** Roles (`member`, `editor`, `admin`, `ops`) defined centrally in Auth0 and mirrored in Supabase RLS policies.
- **Session hygiene:** 
  - HttpOnly + Secure + SameSite=Lax cookies.
  - Session rotation on privilege escalation or password change.
  - Automatic logout after 12 hours of inactivity.

## Secrets management

- No plaintext secrets in source control. All secrets stored in AWS Secrets Manager and surfaced to runtime via Vercel environment variables or Lambda parameter injection.
- Secrets rotated at least every 90 days or immediately after suspected compromise.
- Access to secrets limited to least privilege IAM roles; access logs reviewed monthly.

## Application security

- Follow the OWASP Top 10 mitigation checklist for every PR (see `docs/checklists/pull-request.md`).
- Input validation with Zod schemas for all API endpoints.
- Output encoding to prevent XSS (Next.js auto-escaping, additional sanitization for user-generated content).
- CSRF protection via SameSite cookies and double-submit tokens for state-changing requests.
- Passwords (if stored) hashed with Argon2id. No reversible storage.

## Infrastructure hardening

- Infrastructure as Code (Terraform) with peer review.
- Vercel, Supabase, AWS accounts protected by SSO + MFA and audited quarterly.
- Cloud resources tagged with `clarivum:environment` for governance.
- Enable AWS GuardDuty and CloudTrail; review findings monthly.

## Data protection & privacy

- GDPR-compliant consent capture; data residency in EU (Supabase `eu-central-1`).
- PII stored encrypted at rest using Postgres `pgcrypto`; keys rotated annually.
- Data retention policy: anonymize inactive leads after 12 months; delete user data within 30 days of deletion request.
- Audit access to PII via database logs; anomalies trigger security review.

## Monitoring & incident response

- Centralized logging via Grafana Loki with 30-day retention (extendable for audits).
- Security alerts integrated into PagerDuty (`clarivum-security` schedule).
- Incident response follows `docs/runbooks/incident-response.md`.

## Vendor management

- Maintain inventory of vendors (Auth0, Vercel, Supabase, Flagsmith, AWS). Review security posture annually.
- Ensure DPAs signed where applicable and store them in the shared legal repository.

## Compliance roadmap

- Target SOC 2 readiness in 18 months; begin control gap analysis once headcount allows.
- Conduct annual penetration test; track remediation tasks in Jira with explicit SLAs.

This baseline is reviewed quarterly. Deviations require explicit approval from the security lead and must be documented with compensating controls.
