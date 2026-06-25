import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Test harness for OpenRubric.
 *
 * - Default environment is `node` (lib + route-handler tests). Component tests opt
 *   into jsdom with a top-of-file `// @vitest-environment jsdom` comment.
 * - `@/` mirrors the tsconfig path alias so imports match the app.
 * - Coverage is scoped to `lib/` (the correctness-critical surface).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      // `server-only` throws on import outside an RSC bundle; stub it for node tests.
      "server-only": fileURLToPath(new URL("./test/helpers/server-only-stub.ts", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      include: ["lib/**/*.ts"],
      exclude: [
        "lib/**/*.tsx",
        "lib/demo-data.ts",
        "lib/tech-icons.ts",
        "lib/ai-icon-names.ts",
        "lib/constants.ts",
        "lib/types.ts",
        "lib/session.tsx",
      ],
      reporter: ["text", "json-summary", "html"],
    },
  },
});
