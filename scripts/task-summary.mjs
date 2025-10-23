#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const tasksRoot = path.join(repoRoot, "tasks");
const outputPath = path.join(tasksRoot, "status-summary.md");

const STATUS_ORDER = ["backlog", "ready", "in-progress", "blocked", "done"];
const AREA_ORDER = ["frontend", "backend", "platform", "qa", "business", "shared"];

async function main() {
  const files = await collectTaskFiles(tasksRoot);
  const tasks = [];

  for (const file of files) {
    const relPath = path.relative(repoRoot, file);
    const raw = await fs.readFile(file, "utf8");
    const { data } = parseFrontMatter(raw, relPath);
    tasks.push({
      file: relPath,
      ...data,
    });
  }

  const grouped = groupTasks(tasks);
  const summary = renderSummary(grouped);
  await fs.writeFile(outputPath, summary, "utf8");
  console.log(`Wrote ${outputPath.replace(repoRoot + path.sep, "")} (${tasks.length} tasks).`);
}

async function collectTaskFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectTaskFiles(entryPath)));
    } else if (
      entry.name.endsWith(".md") &&
      entry.name !== "AGENTS.md" &&
      entry.name !== "README.md" &&
      entry.name !== "status-summary.md"
    ) {
      out.push(entryPath);
    }
  }
  return out;
}

function parseFrontMatter(content, relPath) {
  if (!content.startsWith("---\n")) {
    throw new Error(`${relPath} missing YAML front matter`);
  }
  const closingIndex = content.indexOf("\n---", 4);
  if (closingIndex === -1) {
    throw new Error(`${relPath} has unterminated YAML front matter`);
  }
  const yamlSection = content.slice(4, closingIndex);
  const data = yaml.parse(yamlSection) ?? {};
  return { data };
}

function groupTasks(tasks) {
  const result = new Map();
  for (const status of STATUS_ORDER) {
    result.set(status, new Map());
    for (const area of AREA_ORDER) {
      result.get(status).set(area, []);
    }
  }

  for (const task of tasks) {
    const status = STATUS_ORDER.includes(task.status) ? task.status : "backlog";
    const area = AREA_ORDER.includes(task.area) ? task.area : "shared";
    result.get(status).get(area).push(task);
  }

  for (const status of STATUS_ORDER) {
    for (const area of AREA_ORDER) {
      result
        .get(status)
        .get(area)
        .sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  return result;
}

function renderSummary(grouped) {
  const now = new Date().toISOString().slice(0, 10);
  let output = "# Task Status Summary\n\n";
  output += `Generated ${now} via \`npm run tasks:summary\`.\n\n`;

  for (const status of STATUS_ORDER) {
    output += `## ${toTitle(status)}\n\n`;
    const areaMap = grouped.get(status);
    let hasTasks = false;
    for (const area of AREA_ORDER) {
      const list = areaMap.get(area);
      if (list.length === 0) {
        continue;
      }
      hasTasks = true;
      output += `### ${toTitle(area)}\n`;
      for (const task of list) {
        const owner = task.owner ?? "Unassigned";
        const effort = task.effort ?? "unspecified";
        const updated = task.updated_at ?? "n/a";
        const link = Array.isArray(task.links) && task.links.length > 0 ? task.links[0] : null;
        const linkText = link ? ` ([link](${link}))` : "";
        output += `- \`${task.id}\` · ${task.title} — Owner: ${owner}; Effort: ${effort}; Updated: ${updated}${linkText}\n`;
      }
      output += "\n";
    }
    if (!hasTasks) {
      output += "_No tasks._\n\n";
    }
  }

  output += "---\n\n";
  output += "Need changes? Update task files and re-run `npm run tasks:summary`.\n";
  return output;
}

function toTitle(value) {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

main().catch((error) => {
  console.error("Failed to generate task summary:", error);
  process.exitCode = 1;
});
