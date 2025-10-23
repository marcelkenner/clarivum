# Feature Requirements — Fuel Tool: Kalkulator Stref Tętna (Karvonen)

> Product owner: Fuel PM  
> Science reviewer: Exercise Physiology Lead  
> UX owner: Experience Design Lead  
> Last updated: 2025-02-14

## Objective
- Help users compute personalized heart rate training zones using the Karvonen formula (heart rate reserve) aligned with nutrition and recovery guidance.
- Encourage synergy between Fuel nutrition plans and exercise programming.

## Target Outcomes
- Business: Increase downloads of training nutrition guides by 10%; drive 20% more interactions with sports macro profiles.
- Experience: Users calculate zones in <30 seconds; comprehension of zone purposes ≥4.5/5.

## Primary Users & Segments
- Recreational runners/cyclists.
- Strength trainees incorporating conditioning.
- Individuals monitoring cardiovascular health.

## Experience Principles
- Provide safe guidance: highlight need for medical clearance if heart conditions exist.
- Explain zone purpose (recovery, aerobic, threshold, VO2 max) in approachable language.
- Offer integration with macros + hydration to support training load.

## Functional Requirements

### FR1 — Input Capture
- Required: age, resting heart rate (RHR). Provide method instructions (morning measurement).
- Optional: maximum heart rate (if known), training status (`beginner`, `intermediate`, `advanced`), goal (fat loss, endurance, performance), additional metrics (HRV, recent race results).
- If max HR not provided, estimate using `208 - 0.7 * age`.

### FR2 — Zone Calculation
- Heart Rate Reserve (HRR) = `maxHR - restingHR`.
- Zones (Karvonen):
    - Zone 1 (Recovery): 50–60% HRR + RHR.
    - Zone 2 (Aerobic): 60–70% HRR + RHR.
    - Zone 3 (Tempo): 70–80% HRR + RHR.
    - Zone 4 (Threshold): 80–90% HRR + RHR.
    - Zone 5 (VO2 Max): 90–100% HRR + RHR.
- Provide bpm ranges and percentage of max; highlight if user-supplied max differs.
- Provide suggested duration per week in each zone based on goal.

### FR3 — UI & Coaching
- Display table of zones with BPM ranges, typical session examples, nutritional focus (e.g., carbs before Zone 4).
- Provide hydration/electrolyte reminders for higher zones; link to relevant tools.
- Offer export to Training Peaks/Strava via shareable CSV (future integration) and copy-to-clipboard.

### FR4 — Save & Sync
- Auth users can save zones to Profile (`training_zones`), set review reminders each quarter.
- Provide integration with sports macro profile to adjust carb timing.

### FR5 — Safety & Alerts
- If resting HR indicates potential issue (>100 bpm or <40 without athlete flag), display prompt to consult healthcare professional.
- Provide disclaimers for medications affecting heart rate.

## Content & Data Inputs
- Copy localized via Strapi; zone descriptions validated by exercise physiologist.
- Nutrition tie-ins reference macros planner and hydration calculator.
- Store threshold values in configuration for ease of adjustment.

## Integrations & Dependencies
- Profile service for saved zones.
- Sports macro profile to adjust carbohydrate recommendations.
- Potential integration with wearable APIs for automatic RHR updates (future).

## Analytics & KPIs
- Events: `karvonen_tool_open`, `zones_calculated`, `zones_saved`, `sports_macro_cta_clicked`.
- KPI: Save rate ≥30%; sports macro profile visits from tool ≥25%.

## Non-Functional Requirements
- Calculations executed client-side; ensure rounding to nearest whole BPM.
- Provide accessible tables; allow text export.
- Mobile-friendly layout for quick use at gym.

## Compliance & Access Control
- Display medical disclaimer; require acceptance when saving zones.
- Sensitive health data handled per GDPR; allow deletion.
- Admin changes to zone configuration require approval.

## Launch Readiness Checklist
- Validate calculations with sample data.
- QA integration with sports macro profile.
- Update `/fuel/profil-sportowy-makro/` with cross-links.

## Open Questions & Assumptions
- Should we incorporate HRV readiness data once wearable integration exists?
- Determine if zone naming should follow Polish training conventions (consult coaches).
