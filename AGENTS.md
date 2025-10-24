# AGENTS.md

Audience: coding agents, CI bots, and maintainers who ship Clarivum software.

Purpose: operational rules, commands, and templates that embed the Finnish continuous-improvement mindset (jatkuva parantaminen, Sisu debugging, Metsa cadence) into day-to-day work. This file supersedes older guidance while preserving Clarivum-specific expectations (Next.js 15, npm scripts, Flagsmith).

**Note on commands:** the reference model assumes pnpm/turbo/vitest. Clarivum currently uses npm + Next.js + ESLint + TypeScript. Whenever this guide calls out pnpm/turbo/vitest, substitute the equivalent npm script already provided in `package.json`. Update this document if the tooling evolves.

Always resolve framework or library questions with Context7: call `context7__resolve-library-id`, then `context7__get-library-docs` for authoritative references.

---

## 0) What matters most (agent summary)

- Protect one 3h deep-work block per developer in the local morning. No review requests, meetings, or direct mentions during that time.
- Run the Kaizen Minute every day: log one slowdown, land one <=60m guardrail, assign an owner, and state how to verify success.
- Apply Sisu Debugging for incidents and bugs: stabilize fast, add a guardrail within 48h, and write a seven-line root-cause note.
- Follow the Metsa cadence (Finnish: Mets\u00e4): Winter = debt and hardening, Spring = design and prototypes, Summer = feature build, Autumn = stabilize and plan.
- Track flow, quality, and sustainability metrics together. Throughput without reliability or focus is not success.

---

## 1) Repo structure and special files

Agents should ensure the following structure exists (add missing items via PR):

```
.github/
  CODEOWNERS
  PULL_REQUEST_TEMPLATE.md
  ISSUE_TEMPLATE/
    01_bug.yml
    02_kaizen.yml
    03_guardrail.yml
    04_forest_day.yml
  workflows/
    ci.yml
    check-pr-size.yml
    kaizen-daily.yml
    forest-day-monthly.yml
    sisu-on-bug.yml
docs/
  role-guides/
    continuous-improvement.md
  runbooks/
    sisu-debugging.md
  playbooks/
    kaizen-minute.md
    metsa-cadence.md
sisu-log/                   # append-only incident notes (markdown files)
metrics/                    # JSON snapshots produced by scheduled jobs
AGENTS.md                   # this file
```

Clarivum already holds related guidance in `docs/role-guides/continuous-improvement.md` and `docs/runbooks/sisu-debugging.md`. The playbooks directory can reference or cross-link those documents to avoid duplication.

Each feature area must include its own `AGENTS.md` describing local build/test/lint commands. Agents always consult the nearest `AGENTS.md` in the directory tree.

---

## 2) Dev environment tips (npm + Next.js)

- Install dependencies: `npm install`
- Start dev server (Turbopack): `npm run dev`
- Build production bundle: `npm run build`
- Run validation suite: `npm run validate` (lint + typecheck + format check)
- Lint code only: `npm run lint:code`
- Type-check only: `npm run typecheck`
- Regenerate agent scaffolding: `npm run ensure:agents`
- Tasks summary: `npm run tasks:summary`

If a package-level override uses pnpm/turbo/vitest, map to the local scripts or create npm equivalents. Document any deviations in the package-level `AGENTS.md`.

---

## 3) Build and test commands (agents must run)

Run from the repo root unless stated otherwise:

- Full CI mirror: `npm run validate` (runs lint, typecheck, and format check)
- Code lint only: `npm run lint:code`
- Task lint only: `npm run lint:tasks`
- Docs lint (if defined): `npm run lint:docs`
- Diagram lint (if defined): `npm run lint:diagrams`
- Format source: `npm run format`
- Ensure agent files exist: `npm run ensure:agents`

When new tooling is introduced (e.g., Vitest), extend `package.json` and update this section.

---

## 4) PR and commit policy

- PR title format: `[area] concise title`
- Target PR size: fewer than 300 net changed lines (automation issues a warning above that threshold)
- Required checks: lint, typecheck, format check, docs/runbook touch when code changes
- Doc requirement: if `src/**` changes, update a doc, runbook, or task file in the same PR
- Labels: apply at least one of `type:feature`, `type:bug`, `type:refactor`, `type:guardrail`, `type:docs`
- Definition of Done: code + tests/guardrails + docs/runbooks updated
- Review SLA: first review returned during the 2h collaboration window (outside deep-work)

---

## 5) Daily "6+1" rhythm (agent behaviors)

- Deep focus (3h, morning local): block calendars and Slack; no meetings or review requests
- Kaizen Minute (15-20m): update the daily Kaizen issue with slowdown, guardrail, owner, verification method
- Improvement hour (60m): deliver the guardrail (test, check, limit, alert, or script)
- Collaboration window (2h): reviews, pairing, async stand-up, stakeholder sync
- Documentation and learning (1h): update READMEs/runbooks/ADRs or record micro-learnings
- Use the `#kaizen-minute` and `#sisu-log` Slack channels to log work; mirror entries in tasks

---

## 6) Sisu Debugging (root-cause first)

When a bug or incident occurs (label `type:bug` or equivalent):

1. Stabilize quickly with a hotfix or rollback.
2. Within 48 hours, merge a guardrail change (test, limit, lint rule, alert, or script) that prevents recurrence.
3. Append a seven-line Sisu note in `sisu-log/YYYY-MM-DD-<short-id>.md` using the template:

```
# SISU DEBUGGING NOTE
Feature/Service:
Incident/Bug:
Impact:
What broke:
Why it escaped:
Guardrail added (link):
Process bottleneck found:
Owner & due date:
Follow-up check (date):
```

Also update `docs/runbooks/sisu-debugging.md` with any new bottleneck patterns uncovered.

---

## 7) Metsa cadence (seasonal focus)

- Winter (Jan-Mar): remove debt, simplify, raise test coverage, enforce SLOs
- Spring (Apr-Jun): produce design docs, RFCs, and prototypes
- Summer (Jul-Sep): build customer-visible value, minimize risky migrations
- Autumn (Oct-Dec): stabilize, run retrospectives, plan and de-risk next year

Block one Forest Day per month (no meetings). On that day: delete or simplify at least one item, update a runbook, share a recorded learning session, and merge a guardrail PR.

---

## 8) Issue and PR templates

Drop the following templates under `.github/ISSUE_TEMPLATE/` (adapted for ASCII friendliness).

`01_bug.yml`
```yaml
name: "Bug"
description: Report a defect that needs Sisu Debugging
labels: ["type:bug", "needs:sisu"]
body:
  - type: textarea
    id: impact
    attributes: {label: Impact, description: "User/system impact and scope"}
    validations: {required: true}
  - type: textarea
    id: repro
    attributes: {label: Reproduction, description: "Steps, logs, commit range"}
    validations: {required: true}
  - type: textarea
    id: suspected
    attributes: {label: Suspected cause, description: "What broke and why it escaped?"}
  - type: checkboxes
    id: guardrail
    attributes:
      label: Guardrail plan
      options:
        - label: "Will add a preventing test/check/limit within 48h"
          required: true
```

`02_kaizen.yml`
```yaml
name: "Kaizen Minute"
description: Daily slowdown to smallest guardrail
labels: ["type:kaizen", "good-first-guardrail"]
body:
  - type: input
    id: slowdown
    attributes: {label: Todays slowdown, placeholder: "One sentence"}
    validations: {required: true}
  - type: input
    id: fix
    attributes: {label: Smallest fix (<=60m), placeholder: "Test/script/check/limit/alert"}
    validations: {required: true}
  - type: input
    id: owner
    attributes: {label: Owner}
    validations: {required: true}
  - type: input
    id: verify
    attributes: {label: How we will know it worked}
```

`03_guardrail.yml`
```yaml
name: "Guardrail"
description: Prevention change linked to a bug or slowdown
labels: ["type:guardrail"]
body:
  - type: input
    id: source
    attributes: {label: Links, placeholder: "Bug/Kaizen/PR links"}
    validations: {required: true}
  - type: dropdown
    id: kind
    attributes:
      label: Type
      options: ["test", "static-check", "limit/quota", "alert/monitor", "script"]
    validations: {required: true}
```

`04_forest_day.yml`
```yaml
name: "Forest Day Task"
description: Once-a-month structural improvement
labels: ["forest-day", "type:refactor"]
body:
  - type: textarea
    id: task
    attributes: {label: Target, description: "What we will delete, simplify, or harden"}
    validations: {required: true}
  - type: input
    id: success
    attributes: {label: Success check, placeholder: "Metric or test proving success"}
```

Pull request template `.github/PULL_REQUEST_TEMPLATE.md`
```md
## Summary
<!-- what and why -->

## Checklist
- [ ] Lint and tests pass locally (`npm run validate`)
- [ ] Docs or runbook updated (link)
- [ ] Small PR (<300 net lines) or justified below
- [ ] If bug fix: Sisu note added and guardrail PR linked

## Links
Issue(s): #
Sisu note (if bug): #
Guardrail: #
```

`CODEOWNERS`
```
# Require at least one owner review per area
/src/app/ @frontend-team
/src/config/ @platform-team
/tasks/ @product-team
```

Update owner handles to match actual GitHub teams.

---

## 9) GitHub Actions automation

### `.github/workflows/ci.yml`

```yaml
name: CI
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm install --ignore-scripts
      - run: npm run lint:code
      - run: npm run typecheck
      - run: npm run format:check
```

Extend with additional commands (e.g., `npm run lint:tasks`) as the repo matures.

### `.github/workflows/check-pr-size.yml`

```yaml
name: PR Hygiene
on: [pull_request]
jobs:
  hygiene:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - name: Compute net lines changed
        id: size
        run: |
          ADDED=$(git diff --numstat origin/${{ github.base_ref }}...HEAD | awk '{a+=$1} END {print a+0}')
          DELETED=$(git diff --numstat origin/${{ github.base_ref }}...HEAD | awk '{d+=$2} END {print d+0}')
          echo "net=$((ADDED+DELETED))" >> $GITHUB_OUTPUT
      - name: Warn if large
        if: steps.size.outputs.net > 300
        run: echo "::warning::PR is large (net ${{ steps.size.outputs.net }} lines). Prefer <300."
      - name: Require docs when src changes
        run: |
          if git diff --name-only origin/${{ github.base_ref }}...HEAD | grep '^src/'; then
            if ! git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -E 'docs/|README|runbook|tasks/'; then
              echo "::error::Code changed without docs or tasks update." && exit 1
            fi
          fi
```

### `.github/workflows/kaizen-daily.yml`

```yaml
name: Kaizen Daily
on:
  schedule: [{ cron: "0 8 * * 1-5" }]
  workflow_dispatch:
jobs:
  open-kaizen:
    runs-on: ubuntu-latest
    permissions: { issues: write }
    steps:
      - name: Open daily issue
        uses: actions/github-script@v7
        with:
          script: |
            const today = new Date().toISOString().slice(0,10);
            const query = `repo:${context.repo.owner}/${context.repo.repo} in:title "Kaizen ${today}"`;
            const {data} = await github.search.issuesAndPullRequests({ q: query });
            if (data.total_count === 0) {
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `Kaizen ${today}`,
                labels: ['type:kaizen'],
                body: "Log one slowdown and land one guardrail (<=60m)."
              });
            }
```

### `.github/workflows/forest-day-monthly.yml`

```yaml
name: Forest Day Scheduler
on:
  schedule: [{ cron: "0 9 1 * *" }]
  workflow_dispatch:
jobs:
  plan-forest-day:
    runs-on: ubuntu-latest
    permissions: { issues: write }
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Forest Day - ${month}`,
              labels: ['forest-day','type:refactor'],
              body: "- Pick one or two debts to delete or simplify\n- Update a runbook\n- Share a 15 minute learning (recorded)\n- Merge at least one delete or simplify PR"
            });
```

### `.github/workflows/sisu-on-bug.yml`

```yaml
name: Sisu Guardrail Check
on:
  pull_request:
    types: [opened, edited, synchronize, labeled]
jobs:
  sisu:
    if: contains(join(github.event.pull_request.labels.*.name, ','), 'type:bug')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.pull_request.body || "";
            const hasSisu = /Sisu note/i.test(body);
            const hasGuardrail = /Guardrail:/i.test(body);
            if (!hasSisu || !hasGuardrail) {
              core.setFailed("Bug fix PRs must link a Sisu note and a guardrail PR.");
            }
```

Adjust these workflows as actual automation is put in place (e.g., using `npm run validate` instead of separate lint/typecheck commands).

---

## 10) Playbooks and documentation upkeep

- `docs/runbooks/sisu-debugging.md`: maintain the Sisu steps, bottleneck catalog, and guardrail examples.
- `docs/role-guides/continuous-improvement.md`: keep the daily, weekly, monthly cadence aligned with this file.
- `docs/playbooks/kaizen-minute.md`: store the daily form, examples under 60 minutes, and scoreboard. Create this file if missing.
- `docs/playbooks/metsa-cadence.md`: define seasonal boards, entry/exit criteria, and sample tasks. Create if missing.
- All documentation changes must cite source ADRs, PRDs, or tasks and be cross-checked via Context7.

---

## 11) Metrics agents compute

Schedule jobs or run local scripts to populate `metrics/`:

- `metrics/flow.json`: PR lead time, review latency, deploy frequency
- `metrics/quality.json`: change failure rate, bug recurrence rate (same area within 30 days)
- `metrics/sustainability.json`: after-hours commit ratio, deep-work protection percentage, PTO uptake (if tracked)
- `metrics/coverage.json`: test coverage trends by package or feature

Example (using GitHub CLI) to compute PR lead time for the last 30 merged PRs:

```bash
gh pr list --state merged --limit 30 --json createdAt,mergedAt | \
  node -e 'let buf="";process.stdin.on("data",d=>buf+=d).on("end",()=>{const prs=JSON.parse(buf);const hrs=prs.map(p=>(new Date(p.mergedAt)-new Date(p.createdAt))/36e5);const mean=hrs.reduce((s,v)=>s+v,0)/Math.max(hrs.length,1);console.log(JSON.stringify({mean, count:hrs.length},null,2));})' \
  > metrics/flow.json
```

Store additional fields as needed (median, percentiles).

---

## 12) Meeting and collaboration rules

- No review requests, meetings, or @mentions during deep-work blocks.
- Emergency bypass only via the `#urgent-oncall` channel with clear escalation criteria.
- All recurring meetings expire after six weeks unless explicitly renewed with agenda and outcomes.
- Stand-ups favor async updates posted before the collaboration window opens.

---

## 13) Security and compliance

- Guardrails may include limits, static checks, or alerts; never log secrets or personal data.
- GitHub Actions should run with least privilege (`permissions: read-all` unless writes are required).
- Store tokens in GitHub Secrets and reference them via workflow inputs, never committing credentials.
- Coordinate policy changes with owners in `docs/policies/` and document approvals.

---

## 14) Task triage patterns

- Bug: label `type:bug`, open/update Sisu note, create or link a guardrail issue, log follow-up, ensure recurrence test or limit.
- Feature: confirm PRD/ADR approvals, slice into small PRs (<300 lines), add telemetry, update docs/runbooks.
- Refactor: link to Forest Day or seasonal board, ensure behavior invariants tested, document outcomes.
- Docs-only: run relevant lint (`npm run lint:docs` when available) and skip build-only checks if code is untouched.

Tasks live under `tasks/` following the YAML schema in `tasks/AGENTS.md`. Always update status folders and regenerate `tasks/status-summary.md` after significant progress.

---

## 15) Monorepo notes

- Seek the nearest `AGENTS.md` for package-level scripts and guardrails.
- Respect each package's `package.json#name` when running commands. Use `npm run -- <script>` with workspaces once introduced.
- Document any package-specific deviations (e.g., Vitest usage) in the local guide.

---

## 16) Quickstart checklists

New PR:
- [ ] Under 300 net lines or justification provided
- [ ] Tests or guardrails added/updated
- [ ] Docs/runbook/task updated
- [ ] Labels set (type:*)
- [ ] Issue, Sisu note (if bug), and guardrail links included

Forest Day:
- [ ] Deleted or simplified at least one thorny area
- [ ] Updated one runbook
- [ ] Shared a recorded 15 minute learning
- [ ] Merged at least one guardrail or simplification PR

---

## 17) Extending this file

Subprojects may ship their own `AGENTS.md` with overrides for:

- Build/test/lint commands
- Language or framework specifics
- Additional guardrails and templates
- Package-specific metrics or cadences

Always read the closest `AGENTS.md` before making changes. Keep file length under 500 lines; split into multiple documents or directories once a section approaches 400 lines.

---

## 18) Clarivum orientation (project-specific context)

- Stack: Next.js 15 (App Router) with React 19, Tailwind CSS 4, TypeScript 5. Runs on Vercel (see `docs/architecture.md`).
- Decision history: `docs/adr/ADR-001` through `ADR-005`. Supersede or extend via new ADRs before altering architecture.
- Product and brand context: `docs/PRDs/` (`first_steps.md`, `clarivum_brand.md`, etc.). Keep features aligned with these documents.
- Role guides: `docs/role-guides/` (frontend, backend, devops, planning, etc.) plus `docs/role-guides/continuous-improvement.md`.
- Policies and runbooks: `docs/policies/`, `docs/runbooks/`. Update them alongside any code or process change.
- Tasks board: `tasks/` folder with status lanes; run `npm run lint:tasks` before merging updates.
- Finish every task by running `npm run validate`, performing a local manual check of relevant flows, and summarizing doc updates or follow-up ADRs.

Update this guide whenever workflow, tooling, or documentation structure changes. If anything is unclear, open an issue tagged `[Docs]` or ask in `#clarivum-dev`.
