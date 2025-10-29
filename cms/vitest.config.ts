import path from "path";

import { defineConfig } from "vitest/config";

const isCI = Boolean(process.env["CI"]);

const reporters = isCI ? ["default", "junit"] : ["default"];

const junitOutputFile: Record<string, string> = {
  junit: path.join("tests", "reports", "junit.xml"),
};

export default defineConfig({
  root: __dirname,
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    globals: false,
    pool: "vmThreads",
    reporters,
    ...(isCI ? { outputFile: junitOutputFile } : {}),
  },
  resolve: {
    alias: {
      "@cms": path.join(__dirname, "src"),
    },
  },
});
