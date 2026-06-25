import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/** Config for the live functional (e2e) checks — separate so they never run in `npm run test`. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["e2e/**/*.e2e.ts"],
    testTimeout: 30_000,
  },
});
