# Feature Requirements — Habits Tool: Indeks Regularności Snu

> Product owner: Habits PM  
> Behavioural science reviewer: Sleep Research Lead  
> Data reviewer: Analytics Lead  
> Last updated: 2025-02-14

## Objective
- Calculate a weekly sleep regularity index that measures consistency in bedtimes and wake times, inspired by metrics like WHOOP sleep consistency (see `sleep_consistency_percentage` in WHOOP API documentation retrieved via Context7).
- Provide actionable nudges to align routines and improve rest quality.

## Target Outcomes
- Business: Increase adoption of digital sunset planner by 20%; improve retention in sleep coaching sequences by 15%.
- Experience: Deliver index updates daily; user comprehension of score drivers ≥4.5/5.

## Primary Users & Segments
- Adults with irregular schedules (shift workers, parents).
- Knowledge workers seeking performance gains through sleep hygiene.
- Users tracking sleep via wearables or manual logs.

## Experience Principles
- Focus on progress, not perfection; highlight small wins.
- Offer clear visualisations (heatmaps) and gentle coaching copy.
- Respect privacy—sleep times can be sensitive health data.

## Functional Requirements

### FR1 — Data Intake
- Sources: manual logging (bedtime, wake time), connected wearables (WHOOP, Apple Health, etc.), chronotype screener baseline.
- Require minimum three days of data per week to calculate index; handle missing days gracefully.
- Sync data nightly; allow manual corrections with audit trail.

### FR2 — Index Calculation
- Compute regularity score using pairwise comparison of bed/wake times across days (0–100 scale).
- Weight recent days higher (exponential decay) to make improvements visible quickly.
- Provide sub-scores:
    - Bedtime consistency (variance in minutes).
    - Wake time consistency.
    - Sleep opportunity variance (time in bed).
- Flag outliers (±120 minutes) and annotate reasons if user provided.

### FR3 — UI & Guidance
- Dashboard card with current score, trend arrow, and percentile vs personal baseline.
- Weekly heatmap showing bedtime/wake deviations.
- Recommendations tailored to chronotype (e.g., “Start wind-down at 22:15”).
- CTA to digital sunset planner, nap planner, and caffeine log adjustments.

### FR4 — Alerts & Coaching
- Send nudges when deviation exceeds threshold (e.g., >90 min later bedtime).
- Provide Sunday summary with progress, highlight nights with best alignment.
- Suggest micro-actions (earlier dinner, limiting blue light) with link to relevant tools.

## Content & Data Inputs
- Coaching scripts stored in Strapi; map to deviation categories.
- Sleep data stored in profile `sleep_sessions`; track source (manual, wearable).
- Chronotype insights adjust target windows.

## Analytics & KPIs
- Events: `sleep_index_calculated`, `sleep_index_alert_sent`, `coaching_tip_clicked`, `data_source_connected`.
- KPI: Score improvement ≥8 points after 4 weeks for users receiving coaching; alert engagement ≥35%.

## Non-Functional Requirements
- Calculations server-side; ensure job runs nightly with <300 ms per user batch.
- Provide offline view of last synced data; display timestamp.
- Accessible charts (text alternatives, keyboard navigation).

## Compliance & Access Control
- Sleep data classified as sensitive; encrypt at rest, enforce RBAC for staff.
- Provide clear consent flow for wearable integrations.
- Offer delete + export functionality compliant with GDPR.

## Launch Readiness Checklist
- Validate algorithm with behavioural science team (simulate irregular schedules).
- QA wearable data ingestion and manual overrides.
- Update documentation and support playbooks for sleep index questions.

## Open Questions & Assumptions
- Should we incorporate sleep duration quality metrics (efficiency) into index next?
- Evaluate real-time updates if wearable APIs support streaming data.
