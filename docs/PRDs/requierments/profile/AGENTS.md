# docs/PRDs/requierments/profile · AGENTS Guide

## Scope
- Defines the account center experience: personal data, ebook library, diagnostics history, subscription management, and privacy controls.
- Coordinates self-service capabilities that reduce support workload while reinforcing trust.

## Must Read
- `feature-requirements.md`, `docs/PRDs/requierments/subscriptions/feature-requirements.md`, `docs/PRDs/requierments/ebooks/feature-requirements.md`, `docs/PRDs/requierments/legal/feature-requirements.md`.
- Consult Supabase platform and auth PRDs for data contracts before changing entitlements or storage decisions.

## Execution Guardrails
- Keep modules modular (profile info, library, diagnostics, subscription) and note ownership for each to avoid a monolithic dashboard.
- Enforce re-authentication for sensitive actions; log security events per the security PRD.
- Ensure personalized recommendations use documented APIs and include fallback plans when data is missing.
- Capture accessibility and performance expectations (≤2 s load, lazy-loaded modules) in requirement updates.

## Handoff Checklist
- Validate key flows (download ebook, update profile, manage subscription, DSAR request) in the dev environment with analytics instrumentation.
- Update support documentation and FAQs when dashboard capabilities change.
- Inform legal/privacy owners if data retention or export behaviors shift.
