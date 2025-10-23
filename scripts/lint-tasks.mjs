#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const tasksRoot = path.join(repoRoot, "tasks");

const VALID_STATUSES = new Set(["backlog", "ready", "in-progress", "blocked", "done"]);

const VALID_AREAS = new Set(["frontend", "backend", "platform", "qa", "business", "shared"]);

const AREA_PREFIXES = {
  frontend: ["fe", "frontend"],
  backend: ["be", "backend"],
  platform: ["plat", "platform", "devops"],
  qa: ["qa"],
  business: ["biz", "business"],
  shared: ["shared", "ops"],
};

const REQUIRED_FIELDS = [
  "id",
  "title",
  "status",
  "area",
  "owner",
  "created_at",
  "updated_at",
  "links",
  "context7",
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ID_PATTERN = /^TSK-[A-Z]+-\d{3}$/;

async function main() {
  const errors = [];
  const warnings = [];
  const files = await collectTaskFiles(tasksRoot);
  const seenIds = new Set();

  for (const file of files) {
    const relPath = path.relative(repoRoot, file);
    try {
      const raw = await fs.readFile(file, "utf8");
      const { data, body } = parseFrontMatter(raw, relPath);
      validateMetadata(data, relPath, errors, warnings, seenIds);
      validateLocation(file, data, relPath, errors);
      validateNaming(data, relPath, errors);
      validateBody(body, relPath, errors);
    } catch (error) {
      errors.push(`${relPath}: ${error.message}`);
    }
  }

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.warn(`Warning: ${warning}`);
    }
  }

  if (errors.length > 0) {
    for (const message of errors) {
      console.error(message);
    }
    console.error(`\nTask lint failed with ${errors.length} error(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Task lint passed for ${files.length} task file(s).`);
}

async function collectTaskFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectTaskFiles(entryPath)));
      continue;
    }
    if (entry.name === "AGENTS.md" || entry.name === "README.md") {
      continue;
    }
    if (entry.name === "status-summary.md") {
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

function validateMetadata(data, relPath, errors, warnings, seenIds) {
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(`${relPath}: missing required field '${field}'`);
    }
  }

  if (data.id) {
    if (!ID_PATTERN.test(data.id)) {
      errors.push(`${relPath}: id '${data.id}' must match pattern TSK-<AREA>-NNN`);
    } else if (seenIds.has(data.id)) {
      errors.push(`${relPath}: duplicate task id '${data.id}'`);
    } else {
      seenIds.add(data.id);
    }
  }

  if (data.status && !VALID_STATUSES.has(data.status)) {
    errors.push(
      `${relPath}: status '${data.status}' must be one of ${Array.from(VALID_STATUSES).join(", ")}`,
    );
  }

  if (data.area && !VALID_AREAS.has(data.area)) {
    errors.push(
      `${relPath}: area '${data.area}' must be one of ${Array.from(VALID_AREAS).join(", ")}`,
    );
  }

  if (data.created_at && !DATE_PATTERN.test(data.created_at)) {
    errors.push(`${relPath}: created_at '${data.created_at}' must be YYYY-MM-DD`);
  }

  if (data.updated_at && !DATE_PATTERN.test(data.updated_at)) {
    errors.push(`${relPath}: updated_at '${data.updated_at}' must be YYYY-MM-DD`);
  }

  if (Array.isArray(data.links)) {
    if (data.links.length === 0) {
      warnings.push(`${relPath}: links array is empty`);
    }
    let hasPrdLink = false;
    let hasAdrLink = false;
    for (const link of data.links) {
      if (typeof link !== "string" || link.trim() === "") {
        errors.push(`${relPath}: links must contain non-empty strings`);
        continue;
      }
      const normalizedLink = link.trim();
      const lowerLink = normalizedLink.toLowerCase();
      if (lowerLink.startsWith("docs/prds/")) {
        hasPrdLink = true;
      }
      if (lowerLink.startsWith("docs/adr/")) {
        hasAdrLink = true;
      }
    }
    if (!hasPrdLink) {
      errors.push(`${relPath}: links must include at least one PRD reference (docs/PRDs/...)`);
    }
    if (!hasAdrLink) {
      errors.push(`${relPath}: links must include at least one ADR reference (docs/adr/...)`);
    }
  } else {
    errors.push(`${relPath}: links must be an array`);
  }

  if (Array.isArray(data.context7)) {
    if (data.context7.length === 0) {
      warnings.push(`${relPath}: context7 array is empty`);
    }
    for (const ref of data.context7) {
      if (typeof ref !== "string" || ref.trim() === "") {
        errors.push(`${relPath}: context7 entries must be non-empty strings starting with '/'`);
        continue;
      }
      if (!ref.startsWith("/")) {
        errors.push(`${relPath}: Context7 reference '${ref}' must start with '/'`);
      }
    }
  } else {
    errors.push(`${relPath}: context7 must be an array`);
  }

  if (data.effort) {
    const allowedEffort = new Set(["tiny", "small", "medium", "large"]);
    if (!allowedEffort.has(String(data.effort))) {
      warnings.push(`${relPath}: effort '${data.effort}' is not one of tiny|small|medium|large`);
    }
  }

  if (typeof data.owner !== "string" || data.owner.trim() === "") {
    errors.push(`${relPath}: owner must be a non-empty string`);
  }
}

function validateLocation(filePath, data, relPath, errors) {
  const relativeToTasks = path.relative(tasksRoot, filePath);
  const segments = relativeToTasks.split(path.sep);
  const status = segments[0];
  const areaFolder = segments[1];

  if (status && data.status && status !== data.status) {
    errors.push(
      `${relPath}: status folder '${status}' does not match metadata status '${data.status}'`,
    );
  }

  if (areaFolder && data.area && areaFolder !== data.area) {
    errors.push(
      `${relPath}: area folder '${areaFolder}' does not match metadata area '${data.area}'`,
    );
  }
}

function validateNaming(data, relPath, errors) {
  const fileName = path.basename(relPath);
  const prefix = fileName.split("-")[0];
  if (data.area && AREA_PREFIXES[data.area]) {
    const allowed = AREA_PREFIXES[data.area];
    if (!allowed.some((candidate) => prefix.toLowerCase() === candidate.toLowerCase())) {
      errors.push(
        `${relPath}: filename prefix '${prefix}' does not match area '${data.area}' (allowed: ${allowed.join(", ")})`,
      );
    }
  }
}

function validateBody(body, relPath, errors) {
  const requiredHeadings = ["## Summary", "## Definition of Ready", "## Definition of Done"];
  for (const heading of requiredHeadings) {
    if (!body.includes(heading)) {
      errors.push(`${relPath}: missing required heading '${heading}'`);
    }
  }

  if (!/## Definition of Ready[\s\S]*?- \[[ xX]\]/.test(body)) {
    errors.push(`${relPath}: Definition of Ready must include at least one checklist item`);
  }

  if (!/## Definition of Done[\s\S]*?- \[[ xX]\]/.test(body)) {
    errors.push(`${relPath}: Definition of Done must include at least one checklist item`);
  }
}

main().catch((error) => {
  console.error("Unexpected error while linting tasks:", error);
  process.exitCode = 1;
});
