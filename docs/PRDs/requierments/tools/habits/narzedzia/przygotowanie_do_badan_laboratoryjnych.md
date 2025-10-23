# Feature Requirements — Habits Tool: Przygotowanie do Badań Laboratoryjnych

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Medical advisor: Laboratory Medicine Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide personalized preparation checklists for common lab tests (bloodwork, hormone panels) to improve accuracy and reduce rescheduling.
- Integrate reminders with fasting windows, hydration, and medication notes.

## Target Outcomes
- Business: Increase engagement with intermittent fasting and hydration tools by 15%; drive 20% more newsletter signups for health navigation content.
- Experience: 90% of users feel prepared (post-checklist rating ≥4.6/5); missed instructions decrease (self-report) by 25%.

## Primary Users & Segments
- Adults scheduling routine bloodwork or specialty labs.
- Individuals managing chronic conditions needing frequent tests.
- Caregivers coordinating family appointments.

## Experience Principles
- Provide clear, non-technical language with optional deep dives.
- Offer modular checklists per test type.
- Emphasize collaboration with healthcare provider.

## Functional Requirements

### FR1 — Test Selection
- Users choose tests from catalog (CBC, lipid panel, glucose tolerance, cortisol, thyroid, vitamin D, ferritin, etc.). Provide search + tags (fasting required, morning only).
- Allow adding custom instructions from care team.
- Support multiple tests in one appointment; merge requirements intelligently.

### FR2 — Preparation Logic
- Determine fasting requirements (duration, water allowed) and align with Okno Żywieniowe Planer (suggest window adjustments).
- Provide medication guidance (e.g., “consult doctor about withholding supplements”) with disclaimers.
- Include behaviour instructions: caffeine restrictions, alcohol avoidance, exercise modifications, menstrual cycle timing.
- For tests requiring morning collection, recommend optimal bedtime/wake adjustments via sleep tools.

### FR3 — Checklist & Reminders
- Generate timeline: days prior, day before, morning of, post-test care.
- Offer toggle for reminders (push/email/SMS) with personalized schedule.
- Provide printable/exportable checklist and integration with calendar.

### FR4 — Documentation & Tracking
- Allow storing physician instructions, lab location, appointment time.
- Post-test reflection: note symptoms, follow-up actions.
- Integrate with weekly health report for upcoming tests summary.

## Content & Data Inputs
- Test metadata stored in `lab_prep_rules` with medical citations; reviewed quarterly.
- Localization via Strapi; include disclaimers to follow medical advice.
- Integrate with hydration/caffeine tools for dynamic adjustments.

## Analytics & KPIs
- Events: `lab_prep_created`, `reminder_sent`, `instruction_acknowledged`, `checklist_completed`.
- KPI: Reminder acknowledgment ≥70%; user-reported prep confidence ≥4.6/5.

## Non-Functional Requirements
- Checklist generation server-side; response <300 ms.
- Offline access to saved checklist; display last sync timestamp.
- Accessible design (readable fonts, printable format).

## Compliance & Access Control
- Emphasize that medical advice comes from provider; tool supplements instructions.
- Store sensitive appointment data encrypted; allow deletion/export.
- Staff access limited to aggregated analytics.

## Launch Readiness Checklist
- Validate rules and language with medical advisor and legal.
- QA reminder scheduling, calendar exports, and integration with other tools.
- Update `/habits/tematy/zdrowie/` navigation.

## Open Questions & Assumptions
- Should we integrate lab result uploads later?
- Determine policy for storing provider contact details securely.
