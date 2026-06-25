/**
 * Global test setup.
 *
 * - Registers @testing-library/jest-dom matchers (no-op in node env, useful in jsdom).
 * - Provides a default-stubbed global `fetch` so no unit test can accidentally hit the
 *   network. Individual tests override `vi.mocked(fetch)` / `vi.spyOn` as needed.
 * - Resets all mocks between tests for determinism.
 */
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  // Any test that needs the network must explicitly mock fetch. The default throws
  // loudly so an unmocked network call is a test failure, not a silent live request.
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("Unmocked fetch() in a unit test — stub it explicitly.");
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
