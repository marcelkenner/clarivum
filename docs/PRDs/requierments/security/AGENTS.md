# docs/PRDs/requierments/security · AGENTS Guide

## Scope
- Establishes Clarivum’s security controls: secrets management, RBAC, vulnerability response, and secure infrastructure practices.
- Connects product requirements with incident response, compliance, and observability needs.

## Must Read
- `feature-requirements.md`, `docs/runbooks/incident-response.md`, `docs/policies/error-budget-policy.md`, and ADRs covering platform/security tooling.
- Pull Context7 documentation for any security tooling (Auth provider, WAF, scanning services) before updating requirements.

## Execution Guardrails
- Apply defense-in-depth: document how each feature enforces least privilege, encryption, and auditing.
- Capture dependencies on observability and analytics stacks for security monitoring; avoid duplicative instrumentation.
- Specify remediation SLAs, owner roles, and escalation paths whenever new threat surfaces are introduced.
- Ensure security UX aligns with accessibility and localization guidance (e.g., MFA prompts, error states).

## Handoff Checklist
- Verify security runbooks reflect updated controls, including secret rotation schedules and alert routing.
- Notify legal/compliance partners when requirements affect regulatory posture or vendor contracts.
- Align with engineering managers on backlog items for remediation; tag high-severity issues in tasks.
