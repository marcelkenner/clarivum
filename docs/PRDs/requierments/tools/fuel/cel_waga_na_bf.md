# Feature Requirements — Fuel Tool: Cel Waga na % Tkanki Tłuszczowej

> **Canonical references:** Build on `docs/adr/ADR-022-tools-and-calculators-platform.md` for tool architecture and `docs/adr/ADR-019-frontend-platform.md` for delivery patterns.

> Product owner: Fuel PM  
> Science reviewer: Body Composition Specialist  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Translate a desired body fat percentage into target weight and lean mass milestones.
- Help users set realistic expectations and link to nutrition/training plans.

## Target Outcomes
- Business: Increase usage of weight change plan by 12%; drive 15% more signups for macro coaching.
- Experience: 90% of users comprehend the relationship between fat loss/gain and total weight adjustments; satisfaction ≥4.5/5.

## Primary Users & Segments
- Users from body fat calculator wanting to set tangible targets.
- Fitness enthusiasts planning recomposition.
- Individuals advised by professionals to reach specific body fat percentages.

## Experience Principles
- Provide clarity on achievable timelines and necessary fat/lean mass changes.
- Use encouraging language; highlight health ranges rather than aesthetics.
- Offer alternative goals (strength, measurements) to prevent fixation on weight alone.

## Functional Requirements

### FR1 — Input Capture
- Required: current weight, current body fat %, target body fat %.
- Optional: lean body mass (auto-calculated if not provided), timeline preference, expected muscle gain per week, caloric target.
- Validate that target body fat is lower than current when aiming for loss; allow higher target for healthy gain scenarios.

### FR2 — Calculation Logic
- Lean Mass = `weight * (1 - currentBF%)`.
- Target weight = `leanMass / (1 - targetBF%)`.
- Fat to lose/gain = `weight - targetWeight`.
- Provide lean mass retention/gain guidance (if target requires +lean mass, calculate needed gain).
- Estimate timeframe suggestions assuming:
    - Max sustainable fat loss: 0.5–1.0% body weight/week.
    - Muscle gain: 0.25 kg/week advanced, 0.5 kg/week novice.
- Flag unrealistic scenarios (target < essential fat, e.g., <10% men, <18% women).

### FR3 — UI & Messaging
- Summary card: Target weight, total fat change, lean mass change.
- Visual: Stacked bar showing current vs target composition.
- Provide recommended next steps: plan creation, protein targets, strength programming resource.
- Include cautionary notes for fast changes and encourage rest.

### FR4 — Save & Reminder
- Allow saving goal with milestone checkpoints (every 2% BF change).
- Sync with weight plan to align timeline; send reminders when progress updates logged.
- Provide export for coach/trainer (PDF).

### FR5 — Flow Integration
- Auto-prefill from US Navy calculator or manual entry.
- After result, offer quick link to plan generator + macro adjustments.

## Content & Data Inputs
- Body fat category guidance stored in configuration (healthy ranges by sex/age).
- Copy localized via Strapi with disclaimers.
- Motivation prompts to encourage focus on performance and wellbeing.

## Integrations & Dependencies
- Profile service stores target composition.
- Weight plan + macro planner consume outputs.
- Analytics track conversions to follow-up tools.

## Analytics & KPIs
- Events: `bodyfat_goal_tool_open`, `goal_calculated`, `goal_saved`, `followup_tool_clicked`.
- KPI: Goal save rate ≥35%; follow-up plan creation ≥30%.

## Non-Functional Requirements
- Calculations executed client-side; double precision to avoid rounding errors.
- Ensure accessible charts (text equivalents).
- Provide offline view for saved goals.

## Compliance & Access Control
- Display warnings for eating disorders; provide support contact.
- Age restriction: 18+; minors require parental guidance notice.
- Admin edits to category ranges require science + legal approval.

## Launch Readiness Checklist
- Validate sample scenarios (e.g., 80 kg @ 25% → target 18%).
- QA saving and integration with weight plan.
- Update cross-links on body fat calculator and macro planner.

## Open Questions & Assumptions
- Should we integrate bone density or waist measurements for better context? (future).
- Determine best messaging for non-binary users (consult inclusion lead).
