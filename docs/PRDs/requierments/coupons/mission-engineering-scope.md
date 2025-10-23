# Mission Engineering Scope — Coupon Missions

> **Canonical decision:** `docs/adr/ADR-026-coupons-and-affiliate-incentives.md` governs incentive platform guardrails. This document details engineering scope aligned with the mission-gated coupon initiative and complements `feature-requirements.md`.

## Overview
- Implement mission-driven coupon unlocks with reusable services that support future mission types.
- Each component must expose TypeScript interfaces for dependency injection and testing.
- Delivery goal: production-ready MVP end of Q2, with weekly increments deployed behind Flagsmith toggles.

## Component Breakdown
### MissionConfigurationEngine (Manager)
- **Responsibility:** Manage mission definitions, fetch configuration from Strapi, and expose typed mission schemas to dependent modules.
- **Deliverables:**
  - `MissionConfigurationManager` class with methods `listActiveMissions()`, `getMissionById()`, `resolveProofSchema()`.
  - Strapi integration layer encapsulated in `MissionConfigRepository` with caching (ISR or Redis).
  - Feature flag guard enabling mission rollout per cohort.
- **Dependencies:** Strapi CMS models, Flagsmith SDK, shared taxonomy service.
- **Milestones:**
  1. Define TypeScript interfaces and DTO validation (Week 1).
  2. Implement Strapi adapter with caching & error handling (Week 2).
  3. Wire into mission gallery API route and expose to MissionViewModel (Week 3).

### MissionProgressService (Manager)
- **Responsibility:** Persist per-user mission state, enforce business rules (streak validation, deadlines), and surface progress snapshots to the UI layer.
- **Deliverables:**
  - `MissionProgressManager` with methods `startMission()`, `recordSubmission()`, `calculateProgress()`, `completeMission()`.
  - Persistence adapter (`MissionProgressRepository`) using existing Supabase/Postgres schema.
  - Policy objects for mission-specific rules (e.g., `StoryStreakPolicy`, `ReferralPolicy`) implementing shared `MissionPolicy` interface.
- **Dependencies:** Authentication service, Supabase client, mission schemas from `MissionConfigurationManager`.
- **Milestones:**
  1. Data model & migrations (Week 2, coordinate with DB owner).
  2. Policy engine implementation with unit tests (Week 3).
  3. Integration with MissionViewModel and webhooks for moderation events (Week 4).

### EvidenceCaptureModule (ViewModel + Manager)
- **Responsibility:** Provide UI-facing models for evidence submission and manage storage flows for uploads and metadata.
- **Deliverables:**
  - `MissionEvidenceViewModel` to orchestrate form state, validation messages, and upload progress.
  - `EvidenceStorageManager` to generate signed URLs, enforce file constraints, and trigger AV scan lambda.
  - API route (`/api/missions/{id}/evidence`) with schema validation (Zod) and rate limiting.
- **Dependencies:** S3-compatible storage, antivirus scanning service, Notification service (submission receipt).
- **Milestones:**
  1. Define Zod schemas and upload limits (Week 3).
  2. Build upload endpoints and storage manager (Week 4).
  3. Integrate with frontend forms and MissionProgressManager (Week 5).

### MissionModerationAPI (Manager)
- **Responsibility:** Serve moderation queue data, expose approve/reject endpoints, and synchronize with MissionRewardCoordinator.
- **Deliverables:**
  - `MissionModerationManager` server module exposing `listSubmissions(filters)`, `approveSubmission()`, `rejectSubmission()`, `flagSubmission()`.
  - Risk scoring plugin architecture (`MissionRiskScorer` interface) supporting heuristics and ML expansion.
  - Admin UI API integration with MissionModerationManager.
- **Dependencies:** Evidence storage metadata, Progress service, Notification system, Support CRM webhooks.
- **Milestones:**
  1. Establish moderation database schema and indexes (Week 4).
  2. Implement risk scoring baseline (Week 5).
  3. Deliver Next.js admin routes with authentication middleware (Week 6).

### MissionRewardCoordinator (Coordinator)
- **Responsibility:** Orchestrate coupon unlocks, notifications, and audit logging once moderation approves evidence.
- **Deliverables:**
  - `MissionRewardCoordinator` with methods `issueReward()`, `scheduleNotification()`, `recordAuditTrail()`.
  - Coupon service integration (existing coupon API) with idempotent operations.
  - Notification templates and dispatch logic (email + in-app).
- **Dependencies:** Coupon service, Notifications manager, Audit logging infrastructure.
- **Milestones:**
  1. Define reward contract interface (`MissionRewardContract`) enabling alternate rewards (Week 5).
  2. Implement coupon issuance with observability hooks (Week 6).
  3. Integrate with MissionModerationManager and mission PRD analytics instrumentation (Week 7).

## Cross-Cutting Concerns
- **Security:** Enforce auth middleware on all mission APIs; implement rate limiting per user.
- **Observability:** Standardize logging via `MissionLogContext` wrapper; add metrics (latency, failure counts) to OpenTelemetry pipeline.
- **Testing Strategy:** Unit tests per manager/ coordinator using dependency injection; contract tests for Strapi and coupon service adapters; smoke tests for mission unlock flow.
- **Feature Flags:** Wrap major flows with Flagsmith toggles (`mission-config-enabled`, `mission-moderation-enabled`, `mission-reward-coordinator-enabled`).
- **Documentation:** Update `docs/architecture.md` once backend services deployed; maintain API docs in `docs/apis/missions.md` (to be created).

## Delivery Plan
- Sprint 1: MissionConfigurationManager foundation + schema definitions.
- Sprint 2: Progress service plus initial EvidenceCapture endpoints.
- Sprint 3: Moderation API baseline and admin UI scaffolding.
- Sprint 4: RewardCoordinator integration, analytics instrumentation, and end-to-end validation.
- Parallel track: QA team prepares automated tests; Operations finalizes moderation runbook (see `docs/runbooks/mission-moderation.md`).

## Dependencies & Risks
- Strapi schema changes must be finalized before Sprint 1 (coordinate with content team).
- AV scanning lambda availability; fallback plan requires manual review if service down beyond 2h.
- Referral purchase verification for Mission C depends on payment provider webhook; identify owner in Payments runbook.
- High risk of queue backlogs during launch week; ensure auto-scaling for API routes and storage.

## Decision Outcomes
- Moderation endpoints will use authenticated API routes (`/api/missions/moderation/*`) to keep logic consolidated with existing REST tooling and simplify permission auditing; server actions reserved for read-only views.
- Data retention automated via nightly cron job (EventBridge) that prunes mission data older than 12 months using Supabase policies; configure table TTL for evidence assets via lifecycle rules.
- Reward issuance retries rely on existing SQS queue + Lambda worker pattern; no additional background worker framework introduced. Monitor retry counts and revisit if throughput exceeds Lambda limits.
