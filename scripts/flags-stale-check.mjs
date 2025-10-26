#!/usr/bin/env node

/**
 * Flagsmith stale flag detector.
 *
 * Fetches feature metadata from the Flagsmith Admin API, finds any entries whose
 * `sunset_date` tag lives in the past, persists a JSON snapshot for dashboards,
 * and optionally sends Slack + GitHub issue notifications.
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const {
  FLAGSMITH_API_URL = "https://api.flagsmith.com/api/v1",
  FLAGSMITH_PROJECT_ID,
  FLAGSMITH_API_TOKEN,
  FLAGS_STALE_OUTPUT_PATH = "metrics/feature-flags/stale-report.json",
  FLAGS_STALE_GRACE_DAYS = "0",
  FLAGS_STALE_CREATE_ISSUES = "false",
  FLAGS_STALE_ISSUE_LABELS = "type:guardrail,feature-flags",
  FLAGSMITH_PROJECT_DASHBOARD_URL,
  SLACK_WEBHOOK_URL,
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_API_URL = "https://api.github.com",
} = process.env;

const REQUIRED_ENV = ["FLAGSMITH_PROJECT_ID", "FLAGSMITH_API_TOKEN"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[flags:stale] Missing required env vars: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const config = {
  apiUrl: FLAGSMITH_API_URL.replace(/\/$/, ""),
  projectId: FLAGSMITH_PROJECT_ID,
  apiToken: FLAGSMITH_API_TOKEN,
  slackWebhook: SLACK_WEBHOOK_URL,
  dashboardUrl: FLAGSMITH_PROJECT_DASHBOARD_URL,
  outputPath: FLAGS_STALE_OUTPUT_PATH,
  graceDays: Number.parseInt(FLAGS_STALE_GRACE_DAYS, 10) || 0,
  createIssues: FLAGS_STALE_CREATE_ISSUES.toLowerCase() === "true",
  issueLabels: FLAGS_STALE_ISSUE_LABELS.split(",")
    .map((label) => label.trim())
    .filter(Boolean),
  githubToken: GITHUB_TOKEN || process.env.GH_TOKEN,
  githubRepo: GITHUB_REPOSITORY,
  githubApi: (GITHUB_API_URL || "https://api.github.com").replace(/\/$/, ""),
};

if (config.createIssues && (!config.githubToken || !config.githubRepo)) {
  console.error(
    "[flags:stale] GitHub issue creation requested but GITHUB_TOKEN or GITHUB_REPOSITORY is missing.",
  );
  process.exit(1);
}

async function main() {
  console.log("[flags:stale] Starting stale flag audit…");
  const features = await fetchAllFeatures();
  const summary = buildSummary(features);
  await persistSummary(summary);

  if (summary.staleFlags.length === 0) {
    console.log("[flags:stale] No stale flags detected. ✅");
  } else {
    console.log(`[flags:stale] Found ${summary.staleFlags.length} stale flag(s).`);
  }

  if (summary.staleFlags.length > 0) {
    if (config.slackWebhook) {
      await postToSlack(summary);
    } else {
      console.warn("[flags:stale] SLACK_WEBHOOK_URL is not set; skipping Slack alert.");
    }
    if (config.createIssues) {
      await ensureGithubIssues(summary.staleFlags);
    }
  }
}

async function fetchAllFeatures() {
  const features = [];
  const pageSize = 200;
  let nextUrl = `${config.apiUrl}/projects/${config.projectId}/features/?page_size=${pageSize}&ordering=name`;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Api-Key ${config.apiToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const body = await safeJson(response);
      throw new Error(
        `[flags:stale] Flagsmith request failed (${response.status}): ${JSON.stringify(body)}`,
      );
    }

    const payload = await response.json();
    if (Array.isArray(payload)) {
      features.push(...payload);
      break;
    }

    if (Array.isArray(payload.results)) {
      features.push(...payload.results);
    }
    nextUrl = payload.next ? absolutiseUrl(payload.next) : null;
  }

  return features;
}

function buildSummary(features) {
  const now = new Date();
  const staleFlags = [];
  const missingSunset = [];

  for (const feature of features) {
    const metadata = extractMetadata(feature);
    if (!metadata.sunsetDate) {
      missingSunset.push({
        id: feature.id,
        name: feature.name,
        tags: metadata.rawTags,
      });
      continue;
    }

    const daysPast = daysBetween(metadata.sunsetDate, now);
    if (daysPast > config.graceDays) {
      staleFlags.push({
        id: feature.id,
        name: feature.name,
        description: feature.description,
        owner: metadata.owner,
        sunsetDate: metadata.sunsetDate.toISOString().slice(0, 10),
        daysPast,
        taskReference: metadata.task,
        dashboardUrl: buildFlagDashboardUrl(feature),
      });
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    projectId: config.projectId,
    totalFlags: features.length,
    staleCount: staleFlags.length,
    graceDays: config.graceDays,
    staleFlags: staleFlags.sort((a, b) => b.daysPast - a.daysPast),
    missingSunset,
  };
}

function extractMetadata(feature) {
  const tags = Array.isArray(feature.tags) ? feature.tags : [];
  const tagLabels = tags
    .map((entry) => {
      if (!entry) {
        return null;
      }
      if (typeof entry === "string") {
        return entry;
      }
      if (typeof entry.label === "string") {
        return entry.label;
      }
      if (entry.tag && typeof entry.tag.label === "string") {
        return entry.tag.label;
      }
      return null;
    })
    .filter(Boolean);

  const metadata = { rawTags: tagLabels, owner: null, sunsetDate: null, task: null };

  for (const label of tagLabels) {
    const { key, value } = parseTag(label);
    if (!key || !value) {
      continue;
    }
    if (key === "sunset_date" && !metadata.sunsetDate) {
      metadata.sunsetDate = parseDate(value);
      metadata.sunsetDateRaw = value;
    } else if (key === "owner" && !metadata.owner) {
      metadata.owner = value;
    } else if (key === "task" && !metadata.task) {
      metadata.task = value;
    }
  }

  return metadata;
}

function parseTag(label) {
  const separatorIndex = label.indexOf(":");
  if (separatorIndex === -1) {
    return { key: null, value: null };
  }
  const key = label.slice(0, separatorIndex).trim().toLowerCase();
  const value = label.slice(separatorIndex + 1).trim();
  return { key, value };
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  let iso = trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    iso = `${trimmed}T00:00:00Z`;
  }
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(earlier, later) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((later - earlier) / msPerDay);
}

async function persistSummary(summary) {
  const resolvedPath = path.resolve(config.outputPath);
  await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
  await fs.writeFile(
    resolvedPath,
    JSON.stringify(
      {
        schemaVersion: summary.schemaVersion,
        generatedAt: summary.generatedAt,
        projectId: summary.projectId,
        totalFlags: summary.totalFlags,
        staleCount: summary.staleCount,
        graceDays: summary.graceDays,
        staleFlags: summary.staleFlags,
        missingSunset: summary.missingSunset,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`[flags:stale] Wrote snapshot to ${path.relative(process.cwd(), resolvedPath)}`);
}

async function postToSlack(summary) {
  const topEntries = summary.staleFlags.slice(0, 5);
  const additionalCount = summary.staleFlags.length - topEntries.length;
  const lines = topEntries.map((flag) => {
    const owner = flag.owner ? `owner: ${flag.owner}` : "owner: unknown";
    const url = flag.dashboardUrl ? `<${flag.dashboardUrl}|${flag.name}>` : flag.name;
    return `• ${url} — ${owner}, sunset ${flag.sunsetDate} (${flag.daysPast}d past)`;
  });

  if (additionalCount > 0) {
    lines.push(`…and ${additionalCount} more.`);
  }

  const payload = {
    text: `⚠️ ${summary.staleFlags.length} Flagsmith flag(s) past sunset`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `⚠️ *${summary.staleFlags.length} flag(s) past sunset* (grace ${summary.graceDays}d)`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: lines.join("\n") || "No stale entries.",
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Snapshot: ${summary.generatedAt}`,
          },
        ],
      },
    ],
  };

  const response = await fetch(config.slackWebhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[flags:stale] Slack webhook failed (${response.status}): ${body}`);
  }
  console.log("[flags:stale] Posted Slack alert.");
}

async function ensureGithubIssues(staleFlags) {
  for (const flag of staleFlags) {
    const marker = `flagsmith-feature-id:${flag.id}`;
    const exists = await issueExists(marker);
    if (exists) {
      console.log(`[flags:stale] Existing issue already tracks ${flag.name} (feature ${flag.id}).`);
      continue;
    }
    await createIssue(flag, marker);
  }
}

async function issueExists(marker) {
  const query = `repo:${config.githubRepo}+in:body+"${marker}"+state:open`;
  const response = await fetch(`${config.githubApi}/search/issues?q=${encodeURIComponent(query)}`, {
    headers: githubHeaders(),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[flags:stale] GitHub issue search failed (${response.status}): ${body}`);
  }
  const data = await response.json();
  return Number(data.total_count) > 0;
}

async function createIssue(flag, marker) {
  const issueTitle = `[flags] Sunset overdue · ${flag.name}`;
  const lines = [
    `<!-- ${marker} -->`,
    `Flag **${flag.name}** is ${flag.daysPast} day(s) past its documented sunset date (${flag.sunsetDate}).`,
    "",
    `- Owner: ${flag.owner || "_unspecified_"}`,
    `- Task reference: ${flag.taskReference || "_missing_"}`,
    `- Flagsmith link: ${flag.dashboardUrl || "_add FLAGSMITH_PROJECT_DASHBOARD_URL_"} `,
    "",
    "### Action items",
    "- [ ] Remove or replace the flag in code",
    "- [ ] Update Flagsmith metadata with new sunset date (if still required)",
    "- [ ] Close this issue once clean-up is merged",
  ];

  const response = await fetch(`${config.githubApi}/repos/${config.githubRepo}/issues`, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: issueTitle,
      body: lines.join("\n"),
      labels: config.issueLabels,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[flags:stale] GitHub issue creation failed (${response.status}): ${body}`);
  }

  const issue = await response.json();
  console.log(`[flags:stale] Created follow-up issue #${issue.number} for ${flag.name}.`);
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.githubToken}`,
    "User-Agent": "clarivum-stale-flags-script",
  };
}

function absolutize(value) {
  if (!value) {
    return null;
  }
  if (value.startsWith("http")) {
    return value;
  }
  return `${config.apiUrl.replace(/\/$/, "")}${value}`;
}

function absolutiseUrl(url) {
  return absolutize(url);
}

function buildFlagDashboardUrl(feature) {
  if (!config.dashboardUrl) {
    return null;
  }
  const cleanBase = config.dashboardUrl.replace(/\/$/, "");
  return `${cleanBase}#feature-${feature.id}`;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
