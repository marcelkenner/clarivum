#!/usr/bin/env node

/**
 * Lightweight post-deploy smoke checks for Strapi environments.
 *
 * Reads a newline- or comma-separated list of URLs from STRAPI_SMOKE_TEST_URLS.
 * Falls back to STRAPI_HEALTHCHECK_URL when no explicit list is provided.
 * Each URL must respond with a 2xx status code. Responses with a JSON body
 * containing `{ healthy: true }` are asserted automatically to catch partial
 * failures when the health endpoint is proxied.
 */

import { setTimeout as delay } from "node:timers/promises";
import process from "node:process";

const rawList = process.env.STRAPI_SMOKE_TEST_URLS?.trim();
const fallback = process.env.STRAPI_HEALTHCHECK_URL?.trim();
const timeoutMs = Number.parseInt(process.env.STRAPI_SMOKE_TIMEOUT_MS ?? "", 10);
const effectiveTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 10000;

const urls = normaliseUrls(rawList?.length ? rawList : fallback);

if (urls.length === 0) {
  console.log("No smoke test URLs configured; skipping.");
  process.exit(0);
}

const failures = [];

for (const url of urls) {
  try {
    await runCheck(url, effectiveTimeout);
    console.log(`✔ Smoke check passed: ${url}`);
  } catch (error) {
    failures.push({ url, error });
    console.error(`✖ Smoke check failed: ${url}`);
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
  }
}

if (failures.length > 0) {
  console.error(
    `Smoke checks failed for ${failures.length} URL${failures.length === 1 ? "" : "s"}.
Inspect the logs above and remediate before proceeding.`,
  );
  process.exit(1);
}

function normaliseUrls(input) {
  if (!input) {
    return [];
  }

  return input
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);
}

async function runCheck(url, timeout) {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Expected HTTP 2xx but received ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      if (typeof payload === "object" && payload !== null && "healthy" in payload) {
        if (!payload.healthy) {
          throw new Error(`Health payload reported unhealthy: ${JSON.stringify(payload)}`);
        }
      }
    } else {
      // Drain the body to allow keep-alive reuse, but ignore the content.
      await response.text();
    }
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
    // Give the service a brief breather before the next check.
    await delay(150);
  }
}
