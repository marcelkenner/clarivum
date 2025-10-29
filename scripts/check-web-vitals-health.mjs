#!/usr/bin/env node
import process from "node:process";

const DEFAULT_STATS_BASE_URL = "https://plausible.io/api/v1";

async function main() {
  const apiKey = readEnv("PLAUSIBLE_API_KEY");
  if (!apiKey) {
    console.warn(
      "[analytics] Skipping Web Vitals health check because PLAUSIBLE_API_KEY is not configured.",
    );
    return;
  }

  const domain = resolveDomain();
  const statsBaseUrl =
    readEnv("PLAUSIBLE_API_STATS_URL")?.replace(/\/$/u, "") ?? DEFAULT_STATS_BASE_URL;
  const endpoint = `${statsBaseUrl}/stats/aggregate?site_id=${encodeURIComponent(domain)}&metrics=events&period=6h&filters=${encodeURIComponent("event==WebVitalsMetric")}`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await safeReadBody(response);
    console.error(
      `[analytics] Plausible stats endpoint returned ${response.status}. Body: ${body ?? "<empty>"}`,
    );
    process.exit(1);
  }

  const results = await response.json();
  const eventsCount = Number(results?.results?.events?.value ?? 0);

  if (Number.isNaN(eventsCount) || eventsCount === 0) {
    console.error(
      `[analytics] No WebVitalsMetric events detected for ${domain} in the last six hours. Verify that ingestion is healthy.`,
    );
    process.exit(1);
  }

  console.log(
    `[analytics] WebVitalsMetric events in the last six hours for ${domain}: ${eventsCount}`,
  );
}

function resolveDomain() {
  const explicitDomain = readEnv("PLAUSIBLE_DOMAIN");
  if (explicitDomain) {
    return explicitDomain;
  }

  const siteUrl = readEnv("NEXT_PUBLIC_SITE_URL") ?? "https://clarivum.com";
  try {
    return new URL(siteUrl).hostname;
  } catch {
    return siteUrl.replace(/^https?:\/\//u, "");
  }
}

function readEnv(key) {
  const value = process.env[key];
  return value ? value.trim() : undefined;
}

async function safeReadBody(response) {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}

main().catch((error) => {
  console.error("[analytics] Failed to verify Web Vitals ingestion.", error);
  process.exit(1);
});
