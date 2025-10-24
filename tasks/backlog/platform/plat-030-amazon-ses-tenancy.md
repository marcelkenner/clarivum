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
created_at: 2025-10-27
updated_at: 2025-10-27
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
- [ ] Approved sender domains, subdomains, and DKIM/SPF configuration captured with legal and brand teams.
- [ ] Decide on bounce/complaint pipeline (SNS → SQS/Lambda) and storage requirements for audit trails.
- [ ] Confirm budget and rate limits for expected monthly email volume; request SES production access if not already filed.
- [ ] Align IAM roles, Secrets Manager entries, and CI distribution with security baseline.
- [ ] Plan monitoring dashboards and alert thresholds with observability owners.

## Definition of Done
- [ ] SES production access granted with verified domains, DKIM, SPF, and DMARC policies documented.
- [ ] Bounce/complaint/webhook handling implemented, forwarding events to Listmonk, Supabase, and alerting channels.
- [ ] Sending quotas, suppression list policies, and encryption settings configured; runbooks updated accordingly.
- [ ] Secrets rotated and distributed to Listmonk, Next.js, and automation services without plaintext exposure.
- [ ] Deliverability smoke tests executed (seed inboxes, complaint injection) and results logged with follow-up actions.
