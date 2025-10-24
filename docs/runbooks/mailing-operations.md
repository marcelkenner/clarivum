# Mailing Operations Runbook

## Scope & objectives
- Operate the Listmonk-based mailing platform adopted in ADR-013.
- Coordinate `MailingCoordinator`, `AudienceSyncManager`, and integration pipelines with Supabase/Flagsmith.
- Provide campaign lifecycle governance (brief → approval → send → postmortem) with GDPR compliance.
- Channel selection guidance describing when to use Listmonk vs Novu lives in `docs/runbooks/communication-channel-selection.md`.

## Roles & tooling
- **Owner:** Lifecycle Marketing Manager.
- **Engineering liaison:** Platform engineer (rotates monthly).
- **Compliance contact:** Legal/Privacy officer.
- **Tooling:** Clarivum Operations Hub (Communications module), Listmonk admin, AWS ECS/Fargate console, Amazon SES dashboard, Grafana mailing dashboard, Context7 `/knadh/listmonk` docs (SMTP config, imports, maintenance).

## Operations Hub integration
- Start day by reviewing the Communications module in `/ops`; confirm Listmonk campaign status, SES quota health, and Kaizen guardrail checklist.
- Trigger retry or resend actions from the hub when feature flags permit; destructive actions are double-confirmed and logged to `ops_audit`.
- Use provided deep links when deeper changes require entering the Listmonk or SES consoles.

## Infrastructure overview
- **Runtime:** Listmonk Docker image deployed on ECS Fargate (eu-central-1).
- **Database:** Dedicated Amazon RDS Postgres instance (`listmonk` schema).
- **Secrets:** AWS Secrets Manager mounts (SMTP creds, admin user).
- **Networking:** Private subnets with ALB + ACM TLS.

## Deployment workflow
1. **Code changes:** Update `infrastructure/mailing/terraform` or configuration repo.
2. **CI pipeline:** Run `npm run infra:mailing:plan` → review plan.
3. **Blue/green deploy:** Terraform applies new task definition; monitor ECS service for steady state.
4. **Health checks:** Verify `/health` endpoint, ensure Listmonk admin accessible behind VPN.
5. **Postgres maintenance:** Schedule `VACUUM ANALYZE;` weekly (per Context7 guidance) using AWS RDS maintenance window.

## Campaign lifecycle
1. **Brief intake:** Marketing submits request (Notion template) with goal, audience, KPIs, copy deadline.
2. **Template preparation:**
   - Use Listmonk template API (`POST /api/templates`) to create or update HTML.
   - Store template version in Git (`mailing/templates/{slug}.html`).
3. **Approval pathway:**
   - Legal/privacy review for compliance (GDPR consent, unsubscribe).
   - Brand design review for visual alignment.
4. **Audience selection:**
   - Use saved segments or run SQL via Listmonk query interface (`subscribers.attribs` filters).
   - Ensure consent flags respected; double-check `marketing_opt_in`.
5. **Test send:** Dispatch to `mailing-testers` list; validate links, plain-text fallback.
6. **Schedule/send:** Launch campaign with throttling to respect SES quotas; monitor send queue.
7. **Post-send analysis:** Export metrics (opens, CTR, bounces) and document in lifecycle scorecard.

## Audience synchronization
1. **Nightly job:** `AudienceSyncManager` pushes Supabase profile changes via Listmonk import API (`POST /api/import/subscribers`).
2. **On-demand sync:** For urgent corrections, run `npm run mailing:sync -- --email user@example.com`.
3. **Bounce handling:** Webhooks from SES update Supabase `email_status`; run periodic cleanup using `DELETE /api/subscribers/{id}/bounces`.
4. **Consent changes:** Listmonk webhooks inform application to update Flagsmith traits, keeping opt-in state consistent.

## Transactional messages
- Use `POST /api/tx` (per Context7 doc) for ebook delivery, receipts, passwordless flows.
- Templates stored separately from campaigns; ensure attachments comply with size limits.
- Monitor transactional failures via Grafana alert (error rate > 1% triggers incident).

## Incident response
1. **Symptoms:** Campaign stuck in queue, bounce spike, API failures, SES quota exhaustion.
2. **Immediate actions:**
   - Pause campaign in Listmonk UI.
   - Inspect ECS logs for SMTP errors; confirm SES status.
   - Check Postgres health (connections, storage; run `VACUUM ANALYZE` if bloat suspected).
3. **Mitigation:**
   - Switch to fallback SMTP account (enable alternate per Listmonk SMTP configuration).
   - Reduce send concurrency (`LISTMONK_smtp__<account>__max_conns`).
4. **Communication:** Notify `#clarivum-leadership` with impact and ETA.
5. **Postmortem:** Document root cause, data impacts, and update runbook if process changes required.

## Backups & retention
- Nightly database snapshots stored in encrypted S3 bucket with 30-day retention.
- Weekly export of subscribers (GDPR portability) via Listmonk export tools.
- Store campaign HTML in Git for auditing; ensure unsub links functional.

## Compliance checklist
- Confirm double opt-in enabled for public lists.
- Honor deletion requests via `/subscription/wipe/<uuid>` template (per Listmonk JS flow).
- Maintain audit of consent changes (Supabase + Listmonk event logs).
- Review suppression list monthly; remove bounced addresses from marketing journeys.

## Change log
- **2025-10-24:** Added Operations Hub integration guidance and updated tooling list.
- **2025-10-23:** Initial runbook outlining deployment, campaign workflow, and incident response for Listmonk operations.
