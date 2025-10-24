import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env["PLAYWRIGHT_BASE_URL"] ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./playwright",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "smoke",
      testMatch: /.*\.smoke\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "regression",
      testIgnore: /.*\.smoke\.spec\.ts$/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  outputDir: "playwright-results",
  retries: process.env["CI"] ? 1 : 0,
});
