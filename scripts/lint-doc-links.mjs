#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");

const PRDS_DIR = path.join(repoRoot, "docs", "PRDs");
const ADR_DIR = path.join(repoRoot, "docs", "adr");
const TASKS_DIR = path.join(repoRoot, "tasks");

async function main() {
  const errors = [];

  const prdFiles = await collectMarkdownFiles(PRDS_DIR, skipPrdFile);
  const adrFiles = await collectMarkdownFiles(ADR_DIR, skipAdrFile);
  const taskFiles = await collectMarkdownFiles(TASKS_DIR, skipTaskFile);

  const prdToAdrs = new Map();
  const adrToPrds = new Map();
  const prdToTasks = new Map();
  const adrToTasks = new Map();

  for (const file of prdFiles) {
    const rel = toPosix(path.relative(repoRoot, file));
    const content = await fs.readFile(file, "utf8");
    const adrs = findMatches(content, /docs\/adr\/ADR-[\w-]+\.md/gi);
    if (adrs.length === 0) {
      errors.push(`${rel}: missing reference to an ADR (docs/adr/ADR-*.md)`);
    } else {
      prdToAdrs.set(rel, new Set(normalizeLinks(adrs)));
    }
  }

  for (const file of adrFiles) {
    const rel = toPosix(path.relative(repoRoot, file));
    const content = await fs.readFile(file, "utf8");
    const prds = findMatches(content, /docs\/PRDs\/[^\s)\]]+/gi);
    if (prds.length === 0) {
      errors.push(`${rel}: missing reference to a PRD (docs/PRDs/...)`);
    } else {
      adrToPrds.set(rel, new Set(normalizeLinks(prds)));
    }
  }

  const tasksData = await Promise.all(
    taskFiles.map(async (file) => {
      const rel = toPosix(path.relative(repoRoot, file));
      const content = await fs.readFile(file, "utf8");
      const { data } = parseFrontMatter(content, rel);
      const links = Array.isArray(data.links) ? data.links : [];
      return { rel, links };
    }),
  );

  for (const { rel, links } of tasksData) {
    for (const rawLink of links) {
      if (typeof rawLink !== "string" || rawLink.trim() === "") {
        continue;
      }
      const normalized = normalizeLink(rawLink);
      if (normalized.startsWith("docs/PRDs/")) {
        addToMap(prdToTasks, normalized, rel);
      }
      if (normalized.startsWith("docs/adr/ADR-")) {
        addToMap(adrToTasks, normalized, rel);
      }
    }
  }

  for (const prd of prdFiles) {
    const rel = toPosix(path.relative(repoRoot, prd));
    const normalized = rel;
    if (!prdToTasks.has(normalized)) {
      errors.push(`${rel}: no task links to this PRD via front matter links`);
    }
  }

  for (const adr of adrFiles) {
    const rel = toPosix(path.relative(repoRoot, adr));
    if (!adrToTasks.has(rel)) {
      errors.push(`${rel}: no task links to this ADR via front matter links`);
    }
    if (!adrToPrds.has(rel)) {
      // Already captured earlier, avoid duplicate message.
      errors.push(`${rel}: missing reference to a PRD (docs/PRDs/...)`);
    }
  }

  if (errors.length > 0) {
    for (const message of errors) {
      console.error(message);
    }
    console.error(`\nDoc link lint failed with ${errors.length} error(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Doc link lint passed for ${prdFiles.length} PRD(s), ${adrFiles.length} ADR(s), and ${taskFiles.length} task(s).`,
  );
}

function skipPrdFile(relPath) {
  const base = path.basename(relPath);
  if (base === "AGENTS.md") return true;
  if (base === "_template.md") return true;
  return false;
}

function skipAdrFile(relPath) {
  const base = path.basename(relPath);
  if (base === "AGENTS.md") return true;
  if (base.startsWith("_template")) return true;
  return false;
}

function skipTaskFile(relPath) {
  const base = path.basename(relPath);
  if (base === "AGENTS.md") return true;
  if (base === "README.md") return true;
  if (!base.endsWith(".md")) return true;
  if (relPath.includes("status-summary.md")) return true;
  return false;
}

async function collectMarkdownFiles(dir, skipPredicate) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectMarkdownFiles(entryPath, skipPredicate)));
      continue;
    }
    const rel = toPosix(path.relative(repoRoot, entryPath));
    if (skipPredicate(rel)) {
      continue;
    }
    if (!entry.name.endsWith(".md")) {
      continue;
    }
    out.push(entryPath);
  }
  return out;
}

function parseFrontMatter(content, relPath) {
  if (!content.startsWith("---\n")) {
    throw new Error(`${relPath}: missing YAML front matter`);
  }
  const closingIndex = content.indexOf("\n---", 4);
  if (closingIndex === -1) {
    throw new Error(`${relPath}: unterminated YAML front matter`);
  }
  const yamlSection = content.slice(4, closingIndex);
  let data;
  try {
    data = yaml.parse(yamlSection) ?? {};
  } catch (error) {
    throw new Error(`${relPath}: invalid YAML front matter: ${error.message}`);
  }
  const body = content.slice(closingIndex + 4).replace(/^\n/, "");
  return { data, body };
}

function findMatches(content, regex) {
  const matches = [];
  let match;
  const global = new RegExp(regex);
  while ((match = global.exec(content)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

function normalizeLinks(links) {
  return links.map((link) => normalizeLink(link));
}

function normalizeLink(link) {
  const trimmed = link.trim();
  const hashIndex = trimmed.indexOf("#");
  const base = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);
  return base.replace(/\\/g, "/");
}

function addToMap(map, key, value) {
  const existing = map.get(key);
  if (existing) {
    existing.add(value);
  } else {
    map.set(key, new Set([value]));
  }
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

main().catch((error) => {
  console.error("Unexpected error while linting documentation links:", error);
  process.exitCode = 1;
});
