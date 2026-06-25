import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { devpostBase, scrapeDevpost, DevpostBlockedError } from "@/lib/devpost";

function htmlResponse(html: string, status = 200) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => null },
    text: async () => html,
  } as unknown as Response;
}

const GALLERY = `<html><body>
  <a class="link-to-software" href="/software/cool-app">
    <img src="https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_thumbnail_photos/004/699/687/datas/medium.png" />
  </a>
</body></html>`;

const PROJECT = `<html><head>
  <meta name="description" content="Reminds elders to take medication." />
</head><body>
  <h1 id="app-title">Cool App</h1>
  <ul class="app-links">
    <a href="https://github.com/team/cool-app">Repo</a>
    <a href="https://cool-app.vercel.app">Try it out</a>
    <a href="https://discord.gg/xyz">Discord</a>
  </ul>
  <div id="built-with"><span class="cp-tag">React</span><span class="cp-tag">Firebase</span></div>
  <a class="user-profile-link" href="https://devpost.com/jane" title="Jane Doe">Jane Doe</a>
</body></html>`;

beforeEach(() => {
  vi.unstubAllEnvs();
  delete process.env.APIFY_TOKEN;
});
afterEach(() => vi.unstubAllEnvs());

describe("devpostBase", () => {
  it("normalizes a bare subdomain", () => {
    expect(devpostBase("myhack")).toBe("https://myhack.devpost.com");
  });
  it("returns the origin of a full URL", () => {
    expect(devpostBase("https://myhack.devpost.com/project-gallery")).toBe("https://myhack.devpost.com");
  });
  it("keeps an explicit host", () => {
    expect(devpostBase("https://devpost.com/software/x")).toBe("https://devpost.com");
  });
});

describe("scrapeDevpost (fixture HTML, no network)", () => {
  it("extracts only public metadata from a project", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        const u = String(url);
        if (u.includes("project-gallery?page=1")) return htmlResponse(GALLERY);
        if (u.includes("project-gallery")) return htmlResponse("<html></html>"); // page 2 empty → stop
        if (u.includes("/software/cool-app")) return htmlResponse(PROJECT);
        throw new Error(`unexpected fetch ${u}`);
      }),
    );

    const { base, projects } = await scrapeDevpost("myhack");
    expect(base).toBe("https://myhack.devpost.com");
    expect(projects).toHaveLength(1);
    const p = projects[0];
    expect(p.project_name).toBe("Cool App");
    expect(p.description).toContain("Reminds elders");
    expect(p.repo_url).toBe("https://github.com/team/cool-app");
    expect(p.live_url).toBe("https://cool-app.vercel.app"); // discord (non-demo host) ignored
    expect(p.built_with).toEqual(["React", "Firebase"]);
    expect(p.members).toEqual([
      { name: "Jane Doe", username: "jane", profile_url: "https://devpost.com/jane" },
    ]);
    // Only public fields exist on the shape — no emails / private contact data.
    expect(Object.keys(p).sort()).toEqual(
      [
        "built_with",
        "description",
        "devpost_url",
        "live_url",
        "members",
        "project_name",
        "repo_url",
        "screenshots",
        "team_name",
        "video_url",
      ].sort(),
    );
  });

  it("throws DevpostBlockedError on a 403 (route turns this into the graceful message)", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => htmlResponse("blocked", 403)));
    await expect(scrapeDevpost("myhack")).rejects.toBeInstanceOf(DevpostBlockedError);
  });
});
