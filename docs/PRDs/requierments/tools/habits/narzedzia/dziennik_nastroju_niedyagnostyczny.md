# Feature Requirements — Habits Tool: Dziennik Nastroju (Niediagnostyczny)

> Product owner: Habits PM  
> Behavioural science reviewer: Clinical Psychologist (advisor)  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Provide a non-clinical mood tracking experience that helps users correlate energy, sleep, and habits with emotional states.
- Surface supportive resources and promote healthy coping routines without diagnosing conditions.

## Target Outcomes
- Business: Increase engagement with breath trainer and microbreak timer by 15%; drive 20% more usage of weekly health report.
- Experience: 70% of users log mood ≥4 days/week; perceived usefulness ≥4.5/5.

## Primary Users & Segments
- Knowledge workers managing stress.
- Individuals monitoring mood swings tied to sleep or caffeine.
- Habit builders seeking self-awareness.

## Experience Principles
- Use empathetic tone; avoid clinical language.
- Provide privacy-first design with optional journaling.
- Offer actionable insights and support resources.

## Functional Requirements

### FR1 — Logging Flow
- Daily prompt with scale (Very Low → Very High mood) plus optional tags (energy, calmness, irritability).
- Allow quick note (free text) and select relevant contributors (sleep, work, nutrition, social, hormonal).
- Offer ability to add supportive action taken (breathing, walk, talk).
- Provide reminder scheduling; integrate with notifications.

### FR2 — Data Model & Privacy
- Store entries in `mood_log`; mark as sensitive (encrypted).
- Offer PIN/biometric lock for mood history.
- Provide export & delete options (GDPR).

### FR3 — Insights & Coaching
- Weekly mood chart correlated with sleep index, caffeine intake, hydration.
- Highlight triggers (e.g., low sleep leads to low mood) with supportive tips.
- Offer resource links (articles, helplines) when low mood detected multiple days.
- Encourage self-compassion prompts and digital sunset adjustments when mood dips at night.

### FR4 — Safety Protocols
- If user logs “Very Low” mood 3+ consecutive days, prompt supportive resources (non-crisis) and encourage contacting professionals; include disclaimers.
- Provide optional crisis resources (e.g., 112, trusted helpline) with manual activation—no automated escalation.

## Content & Data Inputs
- Emotion tags and copy stored in Strapi; reviewed by psychologist for neutral language.
- Integration with sleep, caffeine, hydration data for correlations.
- Resource list maintained with legal compliance.

## Analytics & KPIs
- Events: `mood_entry_logged`, `insight_viewed`, `resource_link_clicked`, `reminder_set`.
- KPI: Insight engagement ≥35%; supportive action logging ≥30% of entries.

## Non-Functional Requirements
- Logging offline-capable; sync later.
- Fast entry (<3 seconds) with one tap for mood scale.
- Accessible design (color-blind friendly palette, textual labels).

## Compliance & Access Control
- Non-diagnostic, emphasise educational purpose.
- Secure storage with encryption; staff access restricted to aggregated anonymized analytics.
- Provide explicit consent when linking mood data to other habits metrics.

## Launch Readiness Checklist
- Review language and flows with legal and behavioural advisors.
- QA correlations and data privacy features (PIN lock, export/delete).
- Update `/habits/tematy/stres/` with mental health resources.

## Open Questions & Assumptions
- Future integration with wearable HRV data?
- Determine approach for menstrual cycle tagging to contextualize mood (planned).
