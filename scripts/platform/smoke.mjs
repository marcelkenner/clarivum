#!/usr/bin/env node
import assert from "node:assert/strict";

const apiBaseUrl = process.env.PLATFORM_API_BASE_URL;

if (!apiBaseUrl) {
  console.error("PLATFORM_API_BASE_URL environment variable is required for smoke tests.");
  process.exit(1);
}

const healthUrl = new URL("/api/health", apiBaseUrl).toString();

async function run() {
  const response = await fetch(healthUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  assert.equal(response.status, 200, `Expected 200 from ${healthUrl}, received ${response.status}`);

  const payload = await response.json();
  assert.equal(payload.status, "ok", "Unexpected health payload");

  console.log("✅ Platform health endpoint responded successfully", payload);
}

run().catch((error) => {
  console.error("❌ Platform smoke test failed", error);
  process.exit(1);
});
