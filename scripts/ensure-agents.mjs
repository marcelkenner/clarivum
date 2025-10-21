#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

const SKIP_DIR_NAMES = new Set([
  ".git",
  ".husky",
  ".next",
  ".turbo",
  ".vercel",
  ".vscode",
  "node_modules",
  "coverage",
  "dist",
  "out",
  "build",
  "tmp",
  "temp",
]);

const SKIP_RELATIVE_PATHS = new Set(["public"]);

const templates = createTemplates();

const created = [];

try {
  await ensureAgents(repoRoot);
  if (created.length > 0) {
    console.log(
      `[ensure-agents] Generated AGENTS.md for: ${created
        .map((entry) => (entry === "." ? "." : `./${entry}`))
        .join(", ")}`
    );
  }
} catch (error) {
  console.error("[ensure-agents] Failed to ensure AGENTS.md files.");
  console.error(error);
  process.exitCode = 1;
}

async function ensureAgents(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const relPath = normalise(path.relative(repoRoot, directory) || ".");

  if (SKIP_RELATIVE_PATHS.has(relPath)) {
    return;
  }

  const hasAgents = entries.some(
    (entry) => entry.isFile() && entry.name.toLowerCase() === "agents.md"
  );

  if (!hasAgents) {
    const template = getTemplate(relPath);
    const targetPath = path.join(directory, "AGENTS.md");
    await fs.writeFile(targetPath, template, "utf8");
    created.push(relPath);
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (entry.name.startsWith(".") && entry.name !== ".") {
      continue;
    }
    if (SKIP_DIR_NAMES.has(entry.name)) {
      continue;
    }
    const childPath = path.join(directory, entry.name);
    await ensureAgents(childPath);
  }
}

function getTemplate(relPath) {
  const template = templates.get(relPath);
  if (template) {
    return template;
  }
  return defaultTemplate(relPath);
}

function normalise(rel) {
  return rel.split(path.sep).filter(Boolean).join("/") || ".";
}

function createTemplates() {
  const rootTemplate = `# Clarivum · AGENTS Guide

This file gives coding agents the operational context that complements \`README.md\`, the PTRD, and the ADRs. Read this before making changes.

## Project orientation

- Stack: Next.js 15 (App Router) with React 19, Tailwind CSS 4, TypeScript 5. Runs on Vercel (see \`docs/architecture.md\`).
- Decision history lives in \`docs/adr/ADR-001…005\`. Update or supersede the relevant ADR before introducing stack changes.
- Product & brand context is in \`docs/PRDs/\` (\`first_steps.md\`, \`clarivum_brand.md\`, etc.). Keep feature work aligned with those documents.
- **Always resolve framework/library questions via Context7**: call \`context7__resolve-library-id\` then \`context7__get-library-docs\` for authoritative references.

## Build & verification commands

| Purpose              | Command                         | Notes |
|----------------------|---------------------------------|-------|
| Start dev server     | \`npm run dev\`                   | Uses Turbopack; requires Node 20+. |
| Production build     | \`npm run build\`                 | Run before shipping infra changes. |
| Lint (required)      | \`npm run lint\`                  | ESLint config mirrors CI gate. |
| Ensure agent guides  | \`npm run ensure:agents\`         | Auto-generates \`AGENTS.md\` for new directories. |

There are no automated tests yet. When you add them (Vitest/Playwright, etc.), extend scripts and update this guide.

## Workflow expectations

- Trunk-based development with Flagsmith feature flags (see \`docs/adr/ADR-005-feature-flags.md\`).
- Follow the PR checklist in \`docs/checklists/pull-request.md\`; the CI gate expects those tasks to be complete.
- Respect reliability guardrails in \`docs/policies/error-budget-policy.md\` and deployment steps in \`docs/runbooks/deployment.md\`.
- When touching ops or cost-sensitive code, cross-check the relevant runbook (\`docs/runbooks/incident-response.md\`, \`docs/runbooks/cost-review.md\`).

## Documentation duties

- Update \`docs/architecture.md\` if architecture or integrations change.
- Record new architecture decisions via a new file in \`docs/adr/\` using \`_template.md\`. Set status and link to superseded ADRs when relevant.
- Keep PRDs and policies in sync with code. If a change contradicts existing docs, update the docs in the same PR.

## Coding conventions

- Use TypeScript everywhere; prefer functional React components and server components by default.
- Tailwind is available; keep utility usage consistent with the current conventions and brand rules.
- Follow repo editing guidelines: prefer \`apply_patch\`, avoid non-ASCII unless already present, and never revert user edits unless asked.
- Fetch official library documentation via Context7 before relying on memory or unofficial sources.

## Before finishing a task

1. Run \`npm run lint\`.
2. Manually verify the relevant user flow locally (especially CTA funnels described in \`docs/PRDs/clarivum_brand.md\`).
3. Summarize doc updates and note any follow-up ADRs or runbook changes.

Agents should treat this file as living guidance. Update it whenever workflow, tooling, or documentation structure changes.
`;

  const docsTemplate = `# Documentation · AGENTS Guide

Agents editing the \`docs/\` tree should follow this guidance to keep Clarivum’s documentation authoritative and consistent.

## Orientation

- Start at \`docs/README.md\` for the documentation map.
- \`docs/PRDs/\` contains product, brand, and architecture readiness artifacts. Coordinate with stakeholders before major edits.
- \`docs/architecture.md\` mirrors the current C4 view; update it whenever components, data flows, or SLO alignments change.
- Architecture decisions live in \`docs/adr/\`. New decisions require a dedicated ADR using \`_template.md\`; superseded ones must link forward/backward.
- **Use Context7 for any library or platform references** so documentation cites current guidance.

## Editing guidelines

- Keep documentation in Markdown with ASCII characters unless a PRD already includes localized content (e.g., Polish terms).
- Reference sources explicitly (PTRD sections, ADR IDs, runbooks) so humans can trace changes.
- When updating a policy or runbook, cross-link related documents (deployment, incident response, cost review).
- Maintain checklists and tables for quick scanning; avoid duplicating content across docs—link instead.

## Key documents & triggers

- **PRD updates:** Align with \`docs/PRDs/first_steps.md\` exit criteria before coding work begins.
- **Runbooks:** \`docs/runbooks/\` covers deployment, incident response, and cost reviews. Modify when operational procedures change.
- **Policies:** \`docs/policies/\` (error budget, security baseline) inform CI gates and on-call responses. Update alongside code or process changes.
- **Checklists:** \`docs/checklists/pull-request.md\` must mirror CI expectations.

## Review checklist for doc changes

- [ ] Cross-checked context with the latest ADRs and PTRD sections.
- [ ] Updated related docs and links to avoid drift.
- [ ] Included effective date or version markers where relevant.
- [ ] Noted required follow-up actions (e.g., schedule runbook training).
- [ ] Verified references via Context7 when citing external libraries or APIs.

Keep this file current as the documentation set evolves. If you add new directories under \`docs/\`, either extend this automation or provide localized guidance.
`;

  const adrTemplate = `# ADRs · AGENTS Guide

Architecture Decision Records document Clarivum’s significant technical choices. Use this guidance when authoring or updating files in \`docs/adr/\`.

## Writing a new ADR

1. Copy \`_template.md\` into a new file named \`ADR-0XX-short-slug.md\`.
2. Fill in \`Date\`, \`Status\` (usually \`Proposed\` until reviewed), and the required sections (\`Context\`, \`Decision\`, \`Consequences\`).
3. Reference related PRDs, runbooks, or policies to ground the decision.
4. Add “Follow-ups” when additional work remains; track those tasks separately in the issue tracker.
5. Use Context7 to confirm any library/service recommendations before documenting them.

## Updating existing ADRs

- If superseding, mark the old ADR as \`Superseded by ADR-0YY\` and link to the new record.
- Keep numbering sequential. Do not reuse ADR numbers.
- Update the root \`AGENTS.md\` or documentation index when major architecture shifts occur.

## Review checklist

- [ ] Decision aligns with PTRD guardrails (\`docs/PRDs/first_steps.md\`).
- [ ] Impacts to reliability, security, or cost mapped back to runbooks/policies.
- [ ] Links to supporting evidence (benchmarks, RFCs, Context7 references) included.
- [ ] Consequences section clearly states trade-offs and rollback plan.

Treat ADRs as immutable snapshots of decisions—only append amendments or supersede through new records.
`;

  const srcTemplate = `# Frontend · AGENTS Guide

Clarivum’s frontend lives under \`src/\` using the Next.js App Router. Follow this guide when working on application code.

## Structure & routing

- Directory layout follows App Router conventions: route segments under \`src/app/\`.
- Use server components by default; introduce client components only when interactivity requires it.
- Maintain vertical taxonomy alignment with \`docs/PRDs/clarivum_brand.md\` and the sitemap in \`first_configuration.md\`. Route names and slugs must match those docs.

## Styling & UI

- Styling uses Tailwind CSS 4. Prefer utility classes; extract components into shared files if patterns repeat.
- Follow brand colors and CTA patterns defined in \`docs/PRDs/clarivum_brand.md\` and \`brand_design_system.md\`.

## Data & integrations

- Until Supabase data access is implemented, prefer typed placeholder data with clear TODOs referencing the relevant ADR or task.
- When integrating APIs or background jobs, ensure contracts align with ADR-001 (Supabase), ADR-003 (queues), and ADR-004 (observability).
- Consult Context7 for Next.js/React/Tailwind best practices before adopting new APIs.

## Telemetry

- Instrument meaningful spans and metrics per ADR-004. Even for UI-only changes, ensure logging/analytics hooks remain intact.
- Surface Core Web Vitals issues and keep p95/p99 targets from \`docs/README.md\` in mind (p95 < 300 ms, p99 < 800 ms).

## Developer checklist

- [ ] Update or create components in TypeScript with strict typing.
- [ ] Add accessibility attributes (semantic tags, \`aria\` labels) for new UI.
- [ ] Run \`npm run lint\` before submitting changes.
- [ ] Update docs if routes or user flows change (e.g., sitemap or runbooks).
- [ ] Verify any new library usage against Context7 documentation.

Add new section(s) to this guide if additional tooling or architectural layers are introduced under \`src/\`.
`;

  const prdTemplate = `# PRDs · AGENTS Guide

Product Requirement Documents capture discovery and alignment before code begins. Handle files in \`docs/PRDs/\` with extra care.

## Editing principles

- Obtain explicit stakeholder approval (product + marketing) before material edits.
- Preserve localized language (Polish copy) as authored; consult stakeholders for changes.
- Cross-reference updates with the PTRD (\`first_steps.md\`) to keep scope, constraints, and outcomes aligned.
- For architectural implications, create or update ADRs and note the linkage in the PR description.
- If you cite libraries or frameworks, confirm statements via Context7 docs.

## Review checklist

- [ ] Rationale and scope remain accurate; no contradictions with other PRDs.
- [ ] CTAs, funnels, and sitemap references align with \`clarivum_brand.md\`.
- [ ] Any resulting engineering work has clear TODOs or tickets.
- [ ] Document version/date updated in the header if significant.

These documents are canonical—avoid speculative edits or premature implementation details.
`;

  return new Map([
    [".", rootTemplate],
    ["docs", docsTemplate],
    ["docs/adr", adrTemplate],
    ["docs/PRDs", prdTemplate],
    ["src", srcTemplate],
  ]);
}

function defaultTemplate(relPath) {
  return `# ${relPath === "." ? "Project" : relPath} · AGENTS Guide

This directory does not yet have tailored agent guidance. Use these defaults until you add project-specific notes.

- Keep changes aligned with the PTRD (\`docs/PRDs/first_steps.md\`) and relevant ADRs.
- Run \`npm run ensure:agents\` after restructuring to keep agent docs in sync.
- Follow coding standards from the root \`AGENTS.md\`.
- Always resolve library and framework questions via Context7 (\`context7__resolve-library-id\` + \`context7__get-library-docs\`).
- Update this file with localized best practices as soon as the directory gains dedicated responsibilities.
`;
}
