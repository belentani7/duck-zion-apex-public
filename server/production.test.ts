import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { publishPrivateRepository } from "./routers/production";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "quality-user",
      name: "Quality User",
      email: "quality@example.com",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("production catalog contracts", () => {
  it("keeps the five vocal preset names exact", async () => {
    const result = await appRouter
      .createCaller(createContext())
      .production.presets();
    expect(result.map(item => item.name)).toEqual([
      "Vocal Clean",
      "Pop Gloss",
      "Urban Tight",
      "Funk Brasil Pulse",
      "Stage Lead",
    ]);
  });

  it("keeps the six automation scene names exact", async () => {
    const result = await appRouter
      .createCaller(createContext())
      .production.scenes();
    expect(result.map(item => item.name)).toEqual([
      "verse",
      "pre-hook",
      "hook",
      "drop",
      "adlib",
      "final lift",
    ]);
  });

  it("exposes exactly ten plugin records", async () => {
    const result = await appRouter
      .createCaller(createContext())
      .production.plugins();
    expect(result).toHaveLength(10);
    expect(result.every(item => item.officialUrl.startsWith("https://"))).toBe(
      true
    );
  });

  it("returns a reproducible SHA-256 digest for an audit manifest", async () => {
    const caller = appRouter.createCaller(createContext());
    const input = {
      projectId: 1,
      files: [
        {
          path: "vocal.wav",
          sha256:
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
      ],
      secretSignals: 0,
      changeSummary: "test audit",
    } as const;
    const first = await caller.production.runAudit(input);
    const second = await caller.production.runAudit(input);
    expect(first.reproducible).toBe(true);
    expect(first.digest).toHaveLength(64);
    expect(first.digest).toBe(second.digest);
  });

  it("records a quality evidence artifact by SHA-256", async () => {
    const result = await appRouter
      .createCaller(createContext())
      .production.recordQualityEvidence({
        projectId: 1,
        evidenceKey: "build",
        artifactSha256:
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      });
    expect(result).toEqual({ recorded: true, evidenceKey: "build" });
  });

  it("publishes privately through the guarded gh command when the runner succeeds", async () => {
    const output = await publishPrivateRepository(
      "owner/private-repo",
      "/workspace/project",
      async (_file, args) => ({
        stdout: `created ${args[2]}`,
        stderr: "",
      })
    );
    expect(output).toBe("created owner/private-repo");
  });

  it("maps gh authentication failures to a useful typed error", async () => {
    await expect(
      publishPrivateRepository(
        "owner/private-repo",
        "/workspace/project",
        async () => {
          throw new Error("gh auth login required");
        }
      )
    ).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "GitHub CLI is not authenticated for private publication.",
    });
  });

  it("keeps GitHub publishing locked without evidence", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.production.qualityGate();
    expect(result.publishable).toBe(false);
    expect(result.status).toBe("locked");
    expect(result.dimensions).toHaveLength(6);
    expect(result.dimensions.some(item => item.score < 10)).toBe(true);

    const publish = await caller.production.publishPrivateGithub({
      repository: "owner/private-repo",
    });
    expect(publish.published).toBe(false);
    expect(publish.status).toBe("locked");
  });
});
