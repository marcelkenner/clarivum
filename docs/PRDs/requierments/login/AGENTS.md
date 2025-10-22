# docs/PRDs/requierments/login · AGENTS Guide

## Scope
- Defines authentication, sign-up, and session management experiences that unlock personalized Clarivum features.
- Covers identity provider integrations, MFA, and guest-to-account upgrade flows.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/profile/feature-requirements.md`, `docs/PRDs/requierments/subscriptions/feature-requirements.md`, and security PRD guidelines.
- Use Context7 to pull identity provider docs (Auth0, Clerk, Supabase Auth) prior to altering assumptions.

## Execution Guardrails
- Maintain secure defaults (hashed credentials, MFA for privileged roles, rate limiting) and capture exceptions with mitigation plans.
- Ensure UI copy communicates benefits and privacy commitments consistently with legal and marketing guidance.
- Keep API contracts and session tokens aligned with Supabase/Profile requirements; document refresh and logout expectations.
- Plan for localization and accessibility from the outset, including error messaging and alternative login methods.

## Handoff Checklist
- QA the full auth lifecycle (sign-up, verification, login, passwordless, reset) across devices and locales.
- Update transactional email templates and notify lifecycle owners when copy or triggers change.
- Record identity provider configuration changes (keys, redirect URIs) in secure runbooks and rotate secrets as required.
