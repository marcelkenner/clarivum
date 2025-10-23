# Clarivum Strapi Requirements — Platform Setup

This document sets the authoritative requirements for provisioning, configuring, and operating the Clarivum Strapi v5 platform across environments. It complements the content-model specs (`basic_pages.md`, `blog.md`, tools PRDs) and must be satisfied before editors ingest production content.

---

## 1. Scope & Objectives

- **Scope**: Infrastructure, environments, build/release workflow, security posture, plugin/config policy, and operations for Strapi (admin + API). Applies to Development, Staging, and Production.
- **Goals**:
  - Deliver a stable headless CMS with reproducible deployments and clear environment parity.
  - Enforce least-privilege access, secure secrets management, and reliable webhooks for frontend revalidation.
  - Provide monitoring, backup, and disaster-recovery guarantees aligned with business-critical content.

---

## 2. Platform Baseline

- **Strapi version**: v5.x (keep within latest LTS minor; document upgrade path).
- **Runtime**: Node.js 20 LTS; Yarn 4 or npm 10 (pick one and lock via `.nvmrc`/`.yarnrc`).
- **Database**: PostgreSQL 15 (managed service preferred). Development may use Dockerized Postgres; staging/prod use managed instances with point-in-time recovery.
- **Cache**: Redis (optional) for session store if admin traffic requires it.
- **Storage**: S3-compatible bucket (e.g., AWS S3) with versioning + lifecycle policies; integrate via upload provider config.[^upload]
- **Hosting**: Containerized deployment (e.g., AWS ECS/Fargate or Render). Admin panel served by Strapi backend behind HTTPS.
- **CI/CD**: Git-based pipeline (GitHub Actions) with environment-specific deploy jobs triggered on branch/tag.

---

## 3. Environment Matrix

| Env | Purpose | Branch | Data | Auth | Notes |
| --- | --- | --- | --- | --- | --- |
| `local` | Developer sandbox | feature branches | Local Postgres | Local admin user | Hot reload, content seeds via fixtures |
| `dev` | Integration testing | `develop` | Reset nightly | SSO via test IdP, fallback admin | Publishes to Dev Next.js preview |
| `staging` | Pre-prod editorial review | `main` staging tag | Sanitized prod clone weekly | SSO (production IdP) + role gating | Hooks to staging Next.js + search index |
| `production` | Live editorial system | `main` release tag | Production | SSO enforced, no local accounts | Webhook to production frontend ISR & analytics |

- No schema changes allowed directly in staging/prod UIs; all model edits originate from git, deployed through pipeline (see §6).[^faq]
- Enforce content freeze windows before releases when migrations occur.

---

## 4. Configuration & Secrets

- **Environment variables** stored in secrets manager (AWS SSM / Doppler) and injected at runtime. Mandatory keys:
  - `NODE_ENV`, `HOST`, `PORT`.[^server]
  - `APP_KEYS` (array) for session middleware.[^appkeys]
  - `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`.
  - `JWT_SECRET` for users-permissions plugin.[^jwt]
  - Database DSN per env (`DATABASE_URL` or discrete vars).
  - Upload provider credentials (`AWS_ACCESS_KEY_ID`, etc.).[^upload]
  - Email provider secrets (Customer.io SMTP or Sendgrid).
  - Webhook secret tokens (`WEBHOOK_TOKEN`) for frontend revalidate and search indexing.[^webhook]
- Use Strapi `config/<env>/` overrides to set host/url and plugin options (e.g., enable Sentry only in prod).[^envconfig]
- Version control never stores secrets; use `.env.example` documenting required keys.

---

## 5. Plugins & Features

- **Core plugins enabled**:
  - Internationalization (i18n) — required for pl/en locales.
  - Draft & Publish — required across content types (default on).
  - Review Workflows — optional; if enabled, create `Writing → Review → Ready` stages aligned with editorial process (see blog requirements).
  - Sentry (or equivalent) for admin error tracking; enabled only when `NODE_ENV=production`.[^sentry]
  - Upload provider plugin for S3 + image optimization.
- **Custom plugins**: Document in ADR before adoption. Guarantee compatibility with Node 20.
- **Admin panel**: Served from same backend origin; `serveAdminPanel` remains `true` unless CDN-hosted admin is required (document separate setup if changed).[^admindeploy]

---

## 6. Build & Deployment Pipeline

1. **Lint & Type Check**: `npm run lint` + `tsc --noEmit`.
2. **Unit Tests** (if present) + schema validation script (ensure Strapi schemas lint).
3. **Build Admin**: `NODE_ENV=production npm run build`.[^build]
4. **Container image**: Multi-stage Dockerfile per Strapi docs (Node 18/20 base, build & runtime stages).[^docker]
5. **Migration step**: Apply database migrations/seeds via Strapi data transfer or custom script before starting app.
6. **Deploy**: Push image + run `npm run start` with `NODE_ENV=production`.[^start]
7. **Smoke checks**: Health endpoint `/api/healthz` returns `status=ok`.
8. **Post-deploy hooks**: Trigger revalidation for homepage + blog index to ensure new content types accessible.

- CI must gate merges to `main` until build & tests pass.
- Staging deploy requires manual approval; production deploy requires release tag.

---

## 7. Security Requirements

- **Access control**:
  - SSO (SAML/OIDC) for admin login; disable local admin accounts in prod.
  - Role matrix: Admin (devops), Editor, Legal, Medical Reviewer, SEO Specialist (as defined in content specs). Use Strapi RBAC to scope permissions per content type.
- **Network**:
  - HTTPS enforced via load balancer; redirect HTTP → HTTPS.
  - Admin reachable only from VPN/IP allowlist if feasible.
- **Middleware**:
  - Enable Strapi security middleware with CSP, HSTS, and frameguard tuned for admin domain.[^security]
  - Configure CORS to allow only frontend domains.
- **Secrets hygiene**:
  - Rotate `APP_KEYS`, JWT secrets annually or on incident.
  - Audit API tokens quarterly; prefer short-lived tokens for automation.
- **Auditing**: Enable Strapi Enterprise audit logs or ingest to SIEM via webhook.
- **Back-office**: Disable content-type builder in production UI.

---

## 8. Integrations & Webhooks

- **Frontend ISR**: POST webhook to Next.js `/api/revalidate` with Bearer token.[^webhook]
- **Search indexing**: POST to search service with content payload (category, tags, locale). Include retry/backoff.
- **Analytics**: Emit publish/unpublish events to data warehouse queue.
- **Monitoring**: Sentry plugin + Datadog/NewRelic integration for runtime metrics.
- **Email**: Configure provider via env variables; ensure from-address verified.
- **Preview**: Provide `/api/preview` endpoint secured with secret; Strapi preview uses environment variable for URL.

---

## 9. Operations

- **Backups**:
  - Database: Automated nightly snapshot + PITR retention 7 days (dev), 30 days (staging), 90 days (prod).
  - Uploads: S3 versioning + weekly integrity check.
  - Config: Git is source of truth; ensure environment config hashed.
- **Restore drills**: Twice per year trigger staging restore from prod snapshot.
- **Monitoring**:
  - Health check cron (synthetic) hitting `/api/healthz`.
  - Alerts on CPU, memory, DB connections, webhook failures.
- **Scaling**:
  - Autoscale tasks/pods based on CPU > 70% or request latency > 500ms.
  - Use read replica for heavy queries if required.
- **Maintenance windows**: Announce schema migrations; ensure zero-downtime by scaling tasks before restart.
- **Disaster recovery**: Document RPO (1 hour) / RTO (4 hours) targets.

---

## 10. Content Mobility & Data Transfer

- Use Strapi Content Transfer or Terraform-like automation to sync baseline data (categories, tool teasers) from staging → prod with approvals.
- Maintain migration scripts for structural changes; version them alongside code (e.g., `/migrations/2025-xx-yy_add_tool_teasers.js`).
- Prevent editors from exporting/importing data without DevOps oversight.

---

## 11. Compliance & Logging

- Adhere to GDPR: ensure personal data (author bios, testimonials) manageable via DSAR request. Provide deletion scripts.
- Log admin actions (create/update/delete) via audit plugin; store logs 1 year.
- DPA with hosting providers; data residency in EU (Frankfurt region).
- Document incident response for Strapi outages referencing `docs/runbooks/incident-response.md`.

---

## 12. Implementation Checklist

- [ ] Provision Postgres instances per environment with retention policies.
- [ ] Configure S3 bucket + upload provider.
- [ ] Set up CI/CD pipeline with build, test, deploy stages.
- [ ] Wire environment variables via secrets manager; document `.env.example`.
- [ ] Enable required plugins (i18n, Draft & Publish, Sentry, Review Workflows if approved).
- [ ] Configure SSO and RBAC roles; disable local admin default user.
- [ ] Implement security middleware, CORS, and CSP settings.
- [ ] Register webhooks (Next.js revalidate, search, analytics) with secret headers.
- [ ] Establish backup + restore automation; verify via drill.
- [ ] Update `docs/architecture.md` with final topology; raise ADR if deviating from plan.

---

## 13. Open Questions

1. Hosting choice finalization (ECS vs. Render vs. Strapi Cloud) — reconcile with infra budget.
2. Confirm whether Review Workflows license is budgeted; otherwise fallback to status flags.
3. Decide on observability stack (Datadog vs. OpenTelemetry collector) for Strapi metrics/logs.

---

[^upload]: Strapi upload provider configuration for production environments (Cloudinary/S3). https://docs.strapi.io/cloud/advanced/upload
[^server]: Strapi server host/port configuration via environment variables. https://docs.strapi.io/dev-docs/deployment
[^appkeys]: Session middleware keys set via `APP_KEYS`. https://docs.strapi.io/dev-docs/migration/v5/migration-guide-5.0.0-to-5.0.1
[^jwt]: Users-permissions JWT secret configuration. https://docs.strapi.io/dev-docs/plugins/users-permissions
[^webhook]: Secure webhook headers using environment variable token. https://docs.strapi.io/dev-docs/backend-customization/webhooks
[^envconfig]: Environment-specific config overrides. https://docs.strapi.io/dev-docs/configurations/environment
[^sentry]: Conditional Sentry plugin enablement. https://docs.strapi.io/dev-docs/plugins/sentry
[^admindeploy]: Admin panel deployment options. https://docs.strapi.io/dev-docs/admin-panel-customization/deployment
[^build]: Production build command (`NODE_ENV=production`). https://docs.strapi.io/dev-docs/deployment
[^docker]: Multi-stage Dockerfile reference. https://docs.strapi.io/dev-docs/installation/docker
[^start]: Production start command. https://docs.strapi.io/dev-docs/deployment
[^security]: Security middleware configuration (helmet). https://docs.strapi.io/dev-docs/configurations/middlewares
[^i18n]: Strapi internationalization workflows (for locale parity). https://docs.strapi.io/user-docs/content-manager/translating-content
[^faq]: Strapi FAQ on not editing models in production. https://docs.strapi.io/dev-docs/faq
