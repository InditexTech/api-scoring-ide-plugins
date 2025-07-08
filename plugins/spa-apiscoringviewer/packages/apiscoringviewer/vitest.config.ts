import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Use for browser-like tests
    coverage: {
      reporter: ["text", "json", "html"], // Optional: Add coverage reports
    },
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
