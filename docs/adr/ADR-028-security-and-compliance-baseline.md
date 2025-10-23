# ADR-028: Security & Compliance Baseline
Date: 2025-10-24
Status: Accepted

## Context
- Clarivum handles health-adjacent content, personal data, and payments. The security PRD (`docs/PRDs/requierments/security/feature-requirements.md`) and legal/compliance PRD depend on a unified baseline.
- Existing policies (`docs/policies/security-baseline.md`, `docs/policies/error-budget-policy.md`, `docs/policies/work-intake-workflow.md`) set expectations but were not captured in an ADR.
- Without a canonical decision, squads risk inconsistent controls, delayed audits, and regulatory gaps (GDPR, CCPA, EU privacy directives).

## Decision
- Adopt the following security posture:
  - **Identity & Access:** Auth0 (ADR-002) for customer auth, GitHub SSO + enforced MFA for staff, AWS IAM roles limited via least privilege.
  - **Secrets & Config:** Centralized in AWS Secrets Manager with rotation automation (ADR-007).
  - **Data Protection:** Supabase RLS enforced (ADR-001), encryption at rest (managed services), TLS 1.2+ in transit, deterministic encryption for sensitive fields where necessary.
  - **Observability & Incident Response:** Use OpenTelemetry + Grafana (ADR-004) for security signal monitoring; follow incident runbook.
  - **Vulnerability Management:** Monthly dependency scanning, automated npm audit + Snyk; patch high severity within 7 days.
  - **Privacy & Consent:** Klaro! CMP (ADR-014), data subject rights fulfilled within 30 days, audit trail retained per policy.
  - **Secure SDLC:** Threat modeling for new features, PR security checklist, mandatory lint/test coverage (ADR-016, ADR-015).
  - **Third-Party Governance:** Vendor inventory maintained in `technology-stack-catalog.md`; quarterly review of data processors.
- Compliance alignment:
  - Target CIS Controls IG1 + OWASP ASVS L2 as baseline; document compensating controls for gaps.
  - Maintain records of processing activities (RoPA) and DPIA for high-risk workflows.

## Consequences
- **Benefits:** Clear baseline for engineers, alignment with legal requirements, and traceability in audits.
- **Trade-offs:** Increased upfront diligence; requires ongoing policy maintenance.
- **Follow-ups:**
  - Automate security control checks (lint rules, CI scanners).
  - Schedule quarterly security reviews and tabletop exercises.
  - Expand to ISO 27001/SOC 2 readiness as product-market fit solidifies.
