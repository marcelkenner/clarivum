# Feature Requirements — Habits Tool: Monitor Ciśnienia (Niediagnostyczny)

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Medical advisor: Cardiovascular Specialist (consulting)  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Offer a non-diagnostic log for blood pressure readings, reinforcing lifestyle habits (hydration, stress reduction) without replacing medical care.
- Provide trend insights and reminders aligned with weekly health report and hydration planner.

## Target Outcomes
- Business: Increase hydration calculator engagement by 15%; drive 20% more usage of breath trainer and microbreak timer among users with elevated readings.
- Experience: 70% of users log readings ≥3 times/week; understanding of trend interpretation ≥4.5/5.

## Primary Users & Segments
- Adults monitoring blood pressure per physician guidance.
- Individuals tracking habit impacts (sleep, stress) on readings.
- Habit builders seeking accountability.

## Experience Principles
- Emphasize educational purpose; direct users to healthcare providers for diagnosis/treatment.
- Provide privacy and secure data handling.
- Keep logging process quick (<10 seconds).

## Functional Requirements

### FR1 — Logging Flow
- Input systolic, diastolic, heart rate (optional), measurement posture (sitting/standing), time of day, cuff arm, context (woke up, after exercise).
- Allow photo upload of device reading for verification (stored optional).
- Provide reminders at user-specified times (morning/evening).

### FR2 — Trend Analysis
- Compute weekly averages, highlight readings over thresholds (e.g., ≥135/85 home measurement).
- Provide visual charts with zones (normal, elevated, high) referencing European Society of Cardiology guidelines.
- Offer lifestyle suggestions (hydration, stress reduction, sleep) when elevated but avoid medical advice.
- Encourage contacting physician for repeated high readings (CTA to note down for doctor).

### FR3 — Integrations
- Link elevated readings to hydration calculator adjustments (reduce sodium, maintain fluids).
- Suggest breath trainer sessions when stress likely contributor.
- Include summary in weekly health report with gentle reminders.

## Content & Data Inputs
- Threshold config stored in `bp_guidelines_config` with citations.
- Copy localized with disclaimers; mention medical sources.
- Optional connection to wearable BP devices (future) abiding by data agreements.

## Analytics & KPIs
- Events: `bp_log_created`, `elevated_alert_shown`, `lifestyle_tip_clicked`, `reminder_set`.
- KPI: Adherence to logging schedule ≥65%; tip engagement ≥30%.

## Non-Functional Requirements
- Data encrypted at rest; provide biometric lock on mobile.
- Offline logging allowed; sync later with conflict resolution.
- Accessible charts (text descriptions, high contrast).

## Compliance & Access Control
- Prominent disclaimer: not a diagnostic tool, call emergency services for critical readings.
- Allow export for physician (PDF/CSV); user can delete anytime.
- Staff access limited to aggregated anonymized metrics.

## Launch Readiness Checklist
- Validate thresholds and language with medical advisor.
- QA reminder scheduling, export formatting, and data deletion.
- Update `/habits/tematy/zdrowie-serca/` resources.

## Open Questions & Assumptions
- Should we incorporate medication adherence tracking later?
- Determine approach for detecting hypertensive emergencies (alert with instructions to seek medical help).
