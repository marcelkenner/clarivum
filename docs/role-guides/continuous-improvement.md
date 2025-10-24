# Continuous Improvement & Sisu Guide

This guide operationalizes Clarivum's continuous improvement program ("jatkuva parantaminen") with a Nordic cadence that balances throughput, quality, and sustainability. Pair it with the root `AGENTS.md` overview and the `docs/runbooks/sisu-debugging.md` playbook.

## Vocabulary & Principles

- **Jatkuva parantaminen** - continuous improvement. Expect a guardrail or learning every day.
- **Sisu** - resilient follow-through; use it to frame root-cause discipline and sustain improvements.
- **Metsa (Finnish: Mets\u00e4)** - forest. Applies to monthly "Forest Days" and seasonal resets.
- **Monozukuri** - craftsmanship mindset that complements Kaizen; reference when pairing craft + guardrails.

## Daily "6+1" Cadence

- **3h Deep Focus** (local morning): Calendar block with auto-decline; Slack on DND with only `#urgent-oncall` bypass.
- **15-20m Kaizen Minute**: Post in `#kaizen-minute` with three fields - slowdown, smallest guardrail, owner + due date.
- **1h Improvement Pairing**: Land a guardrail (test, script, lint, alert) - aim for <=60m and merge same day.
- **2h Collaboration Window**: Reviews, pairing, async stand-up, stakeholder syncs concentrated here.
- **1h Documentation & Learning ("+1")**: Refresh READMEs/runbooks, capture lessons, or log quick learnings.

## Weekly Rhythm

- **Monday**: Pick 3-5 "paper cuts" per squad; record them as tasks or notes with owners.
- **Tuesday-Thursday**: Ship the improvements inside the daily improvement slot; note progress in `#kaizen-minute`.
- **Friday Sisu Review (30m)**: Share 3 wins, 1 learning, 1 experiment to keep/drop. Update `#sisu-log` plus weekly scorecard.

## Monthly & Seasonal "Metsa" Cadence

- **Forest Day (monthly)**: No roadmap work or meetings. Focus on debt repayment, CI pruning, writing/refreshing runbooks, shipping one "delete or simplify" PR, recording a knowledge share, and updating `sisu-log/` when the work stems from an incident.
- **Seasonal Emphasis**:
  - **Winter (Jan-Mar)** - cleanup & hardening (tech debt, test coverage, simplification).
  - **Spring (Apr-Jun)** - design & prototyping (RFCs, spikes, architectural decisions).
  - **Summer (Jul-Sep)** - feature build (customer-visible value, minimal risky migrations).
  - **Autumn (Oct-Dec)** - stabilize & plan (retros, capacity planning, de-risk next year).
- Track seasonal themes on the planning board (Notion/Jira) and mirror the state in `tasks/status-summary.md`.

## Sisu Debugging Overview

- Apply the runbook in `docs/runbooks/sisu-debugging.md` within 48h of any escaped bug/incident.
- Ensure the Sisu Log (Slack channel `#sisu-log` and repository folder `sisu-log/`) links to the guardrail PR, tasks created, and follow-up date.
- Use the debugging process to identify overloaded queues (PR review, flaky tests, alerts) and relieve the bottleneck.

## 90-Day Rollout

- **Week 0 (Baseline & Enablement)**: Capture baseline metrics (PR lead time, change-failure rate, recurrence rate, after-hours commits, deep-work hours, interruption minutes) and enable calendar focus templates + Slack DND automations. Update Definitions of Done to require a doc edit + test for code changes.
- **Weeks 1-4 (Pilot)**: Roll the cadence to 6-8 engineers. Keep stand-ups async. Ship 1-2 guardrail improvements per day. Measure weekly (deep work, review latency, bugs).
- **Weeks 5-8 (Expand)**: Extend to all squads. Rotate a Kaizen Captain each sprint. Add Forest Day. Launch seasonal board for upcoming quarter themes.
- **Weeks 9-12 (Normalize)**: Make the improvement hour non-negotiable org-wide. Enforce time-to-live (TTL) on recurring meetings (expire after six weeks). Publish a lightweight playbook recap.

## Metrics to Track

- **Flow**: PR lead time, review latency (time to first review), deployment frequency.
- **Quality**: Change-failure rate, bug recurrence (<30 days), module "survival" (% untouched modules staying stable 6-12 months).
- **Sustainability**: After-hours commit ratio, average deep-work hours/day, PTO uptake, eNPS pulse.
- **Interruption Load**: Slack pings during focus windows, % days where focus block stayed protected.

## Operating Rules

- Only `#urgent-oncall` may break focus blocks; all other pings wait for the collaboration window.
- Reviews respond inside 24h during collaboration time. Prefer PRs <300 lines.
- Recurring meetings auto-expire after six weeks unless renewed with purpose/outcomes.
- "Docs every day": any code or process change must update at least one doc or runbook.
- "One guardrail per day": every team ships a tangible guardrail (test, alert, limit, script) daily.

## Ready-to-Use Artifacts

- **Kaizen Minute form**:
  ```
  Today's slowdown (1-2 sentences):
  Smallest fix (<=60m effort):
  Owner:
  When we'll know it worked:
  ```
- **Forest Day checklist**:
  - Pick 1-2 structural debts (flaky test, slow build step, missing observability).
  - Write or refresh one runbook.
  - Deliver a 15-minute knowledge share (recorded).
  - Merge one "delete or simplify" PR.
- **Collaboration window agenda (2h)**:
  - 10m async stand-up review (Kaizen wins).
  - 60m code reviews and pairing.
  - 20m unblock high-risk items.
  - 30m stakeholder touchpoints as needed.
- **Seasonal planning board columns**: Debt to remove | Guardrails to add | Refactors | Prototypes | Build | Stabilize.

## Risks & Mitigations

- **Firefighting culture**: Reward guardrail PRs in demos; route everything non-critical through standard windows.
- **Meeting creep**: Enforce auto-decline during deep focus; keep TTL on recurring invites.
- **Global time zones**: Offer two focus windows (AM local + 90m PM local) and ensure async artifacts are complete.
- **On-call collisions**: Schedule a secondary on-call to shield focus blocks; rotate weekly.

## Leadership Talking Points

- Reinforce that we are trading slight short-term velocity for sustained throughput and lower rework.
- Share a weekly one-page scorecard covering flow, quality, and sustainability metrics.
- Target outcomes in 6-10 weeks: lower review latency, fewer recurring bugs, fewer after-hours commits.

## References

- Finland Working Hours Act (flex scheduling): Ministry of Economic Affairs and Employment.
- Sisu overview: https://en.wikipedia.org/wiki/Sisu
- Metsa term lineage (Finnish: Mets\u00e4): https://en.wiktionary.org/wiki/mets%C3%A4
- Monozukuri craft ethos: https://en.wikipedia.org/wiki/Monozukuri
