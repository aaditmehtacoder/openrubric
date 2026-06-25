import { describe, it, expect } from "vitest";
import { importDevpostProjects } from "@/lib/import-pipeline";
import { createFakeSupabase } from "../helpers/supabase-mock";

const project = {
  project_name: "P1",
  team_name: "Team One",
  devpost_url: "https://devpost.com/software/p1",
  repo_url: "https://github.com/o/p1",
  description: "Does a thing",
  members: [{ name: "Alice", username: "alice" }],
};

describe("importDevpostProjects (mocked service)", () => {
  it("inserts fresh projects and their participants", async () => {
    const fake = createFakeSupabase({
      "submissions:select": { data: [] }, // none existing
      tracks: { data: [] },
      "submissions:insert": { data: [{ id: "11111111-1111-1111-1111-111111111111", project_name: "P1" }] },
      "participants:insert": { data: [] },
    });
    const res = await importDevpostProjects(fake as any, "hack-1", "devpost", [project]);
    expect(res.imported).toBe(1);
    expect(res.submissions[0].project_name).toBe("P1");
    // a participant insert happened
    const partInsert = fake.calls.find((c) => c.table === "participants" && c.op === "insert");
    expect(partInsert).toBeTruthy();
    expect((partInsert!.payload as any[])[0]).toMatchObject({ name: "Alice", github_username: "alice" });
  });

  it("is idempotent — skips a project already present by devpost_url", async () => {
    const fake = createFakeSupabase({
      "submissions:select": {
        data: [{ project_name: "old", devpost_url: "https://devpost.com/software/p1" }],
      },
      tracks: { data: [] },
    });
    const res = await importDevpostProjects(fake as any, "hack-1", "devpost", [project]);
    expect(res.imported).toBe(0);
    // no insert attempted
    expect(fake.calls.some((c) => c.table === "submissions" && c.op === "insert")).toBe(false);
  });

  it("returns an error (not a throw) when the insert fails", async () => {
    const fake = createFakeSupabase({
      "submissions:select": { data: [] },
      tracks: { data: [] },
      "submissions:insert": { data: null, error: { message: "boom" } },
    });
    const res = await importDevpostProjects(fake as any, "hack-1", "devpost", [project]);
    expect(res.imported).toBe(0);
    expect(res.error).toBeTruthy();
  });
});
