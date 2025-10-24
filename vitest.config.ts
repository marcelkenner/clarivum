import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: path.resolve(__dirname, "coverage"),
    },
    css: false,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
