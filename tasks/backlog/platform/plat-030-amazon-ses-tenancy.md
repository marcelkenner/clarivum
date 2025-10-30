---
id: TSK-PLAT-030
title: Configure Amazon SES Tenancy & Deliverability Guardrails
status: backlog
area: platform
subarea: email-platform
owner: DevOps Lead
collaborators:
  - Security Lead
  - Lifecycle Marketing Lead
effort: medium
created_at: 2025-10-24
updated_at: 2025-10-28
links:
  - docs/PRDs/requierments/newsletter/feature-requirements.md
  - docs/PRDs/technology-stack-catalog.md
  - docs/adr/ADR-013-mailing-platform-and-campaign-automation.md
  - docs/adr/ADR-028-security-and-compliance-baseline.md
  - docs/runbooks/mailing-operations.md
  - docs/policies/security-baseline.md
context7:
  - /aws/aws-cli
  - /aws/aws-sdk-net
  - /knadh/listmonk
tags:
  - ses
  - email
  - compliance
---

## Summary
Move Clarivum out of the Amazon SES sandbox, provision EU-region sending identities, and wire bounce/complaint handling so lifecycle and transactional emails meet deliverability, compliance, and observability commitments.

## Definition of Ready
- [x] Sender domains approved: `clarivum.com` and `mail.clarivum.com` with DKIM/SPF plans and DMARC policy drafted.
- [x] Bounce/complaint pipeline defined: SNS to SQS to Lambda writer persisting in `ses_events` table for audits.
- [x] Budget/rate plan confirmed: production access request prepared with target volume and cost cap noted.
- [x] IAM/secrets approach set: scoped IAM roles with credentials in Secrets Manager; CI distributes templating tokens only.
- [x] Monitoring requirements captured: dashboards for bounce, complaint, delivery rates with alert thresholds agreed.

## Definition of Done
- [ ] SES production access granted with verified domains, DKIM, SPF, and DMARC policies documented.
- [ ] Bounce/complaint/webhook handling implemented, forwarding events to Listmonk, Aurora audit tables, and alerting channels.
- [ ] Sending quotas, suppression list policies, and encryption settings configured; runbooks updated accordingly.
- [ ] Secrets rotated and distributed to Listmonk, Next.js, and automation services without plaintext exposure.
- [ ] Deliverability smoke tests executed (seed inboxes, complaint injection) and results logged with follow-up actions.
- [ ] Acceptance criteria: All relevant README.md, AGENTS.md, and ADR documents are updated to reflect this work.
