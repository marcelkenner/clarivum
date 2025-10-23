---
title: Clarivum Analytics Event Catalogue
status: draft
owner: Analytics Lead
updated_at: 2025-10-21
---

This catalogue captures the canonical analytics events for Clarivum’s web experience. Keep it synchronized with the implementation tracked in Flagsmith feature flags, Supabase, and the PostHog project.

## Conventions

- **Naming:** Use `ContextActionOutcome` (e.g., `SkinEbookDownloadStarted`).
- **Context:** Always attach `vertical`, `pillar_category`, and `cta_variant` properties.
- **User identifiers:** Never send PII. Use hashed member ID + Flagsmith cohort tags.
- **Lifecycle:** Flag gated experiments with `flag_key` + `flag_variant`.

## Event inventory

| Event key                  | Trigger                                           | Required properties                                                          | Destination |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------- | ----------- |
| `SkinEbookDownloadStarted` | User clicks primary CTA on `/skin/*` pages        | `vertical`, `pillar_category`, `cta_variant`, `lead_source`                  | PostHog     |
| `FuelToolLaunched`         | Tool modal/form opens under `/fuel/*`             | `vertical`, `tool_slug`, `cta_variant`, `session_region`, `flag_variant`     | PostHog     |
| `HabitsQuizCompleted`      | Diagnostics flow completes on `/habits/diagnose` | `vertical`, `result_segment`, `time_to_complete`, `question_version`, `ab_test` | PostHog     |
| `LeadSubmitSucceeded`      | Supabase lead insert + CRM handoff succeeds       | `vertical`, `offer_slug`, `form_variant`, `flagsmith_flag`, `crm_destination` | Supabase → PostHog |
| `PreviewDeploymentViewed`  | Internal QA opens preview URL                     | `branch_name`, `vercel_url`, `build_id`, `feature_flags_enabled`             | PostHog     |

## Maintenance checklist

- [ ] Review with analytics + product each sprint planning session.
- [ ] Update this file before shipping new funnels; link tasks in `Notes`.
- [ ] Regenerate dashboard mappings when events change (PostHog insights + Supabase syncs).
- [ ] Validate instrumentation via Playwright smoke flows when adding events.
