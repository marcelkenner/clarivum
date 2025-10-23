# Feature Requirements — Habits Tool: Ocena Ergonomii Stanowiska

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Habits PM  
> Reviewer: Occupational Ergonomics Specialist  
> Compliance reviewer: Legal & Claims Lead  
> Last updated: 2025-02-14

## Objective
- Assess workspace ergonomics via guided checklist, photos, and posture prompts.
- Deliver tailored adjustments and connect to microbreak timer and standing vs sitting calculator.

## Target Outcomes
- Business: Increase adoption of ergonomic equipment affiliate links by 12%; improve microbreak tool engagement by 15%.
- Experience: 85% of users complete assessment within 5 minutes; recommendation clarity ≥4.5/5.

## Primary Users & Segments
- Remote workers and freelancers.
- Office employees customizing desk setup.
- Students using laptops for extended periods.

## Experience Principles
- Simplify guidance with visuals and clear language.
- Provide prioritized actions (quick wins vs long-term upgrades).
- Respect privacy when capturing workspace photos.

## Functional Requirements

### FR1 — Assessment Flow
- Modules: chair setup, desk height, monitor positioning, keyboard/mouse alignment, lighting/glare, break habits.
- Each module features 3–5 questions with visual aids; allow photo upload for AI-assisted feedback (future).
- Provide “not applicable” option; adjust scoring accordingly.

### FR2 — Scoring & Recommendations
- Score per module (0–100) with weightings; overall ergonomics index.
- Immediate tips with difficulty/impact rating.
- Suggest microbreak frequency adjustments and standing time targets.
- Provide equipment recommendations (desk riser, lumbar support) with affiliate tracking.

### FR3 — Output & Tracking
- Summary dashboard with prioritized tasks (Top 3 actions), estimated time/cost.
- Allow saving baseline and re-assessing; show progress over time.
- Export PDF checklist for employer or occupational health consultation.

### FR4 — Integrations
- Feed results into timer microbreak, standing vs sitting calculator, and weekly health report.
- Link posture-related exercises from breath trainer and batch movement library.

## Content & Data Inputs
- Ergonomics guidelines stored in `ergonomics_rules` config; citations from EU-OSHA and Polish labour standards.
- Visual aids managed via CMS with alt text.
- Affiliate product links maintained by ops team.

## Analytics & KPIs
- Events: `ergonomic_assessment_started`, `module_completed`, `recommendation_saved`, `affiliate_link_clicked`.
- KPI: Implementation of at least one recommendation within 7 days ≥40%; follow-up reassessment rate after 30 days ≥20%.

## Non-Functional Requirements
- Assessment accessible offline (PWA) with sync later.
- Ensure strong privacy for photos (encrypted at rest, auto-delete after analysis).
- Accessible design (large fonts, descriptive labels).

## Compliance & Access Control
- Provide disclaimer: educational tool, not a medical diagnosis.
- Photo handling complies with GDPR (explicit consent, deletion).
- Staff access restricted to anonymized analytics; photos only visible to user.

## Launch Readiness Checklist
- Validate question set with ergonomics specialist.
- QA scoring logic, localization, and affiliate tagging.
- Update `/habits/tematy/ergonomia/` resources.

## Open Questions & Assumptions
- Potential AR measurement aid (future).
- Determine cadence for reminding users to re-run assessment (quarterly?).
