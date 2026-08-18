import { describe, expect, it, vi } from "vitest";

const ghCalled = vi.hoisted(() => ({ value: false }));

vi.mock("node:child_process", () => ({
  execFile: (_file: string, _args: string[], _callback: Function) => {
    ghCalled.value = true;
  },
}));

vi.mock("./db", () => ({
  listProjects: async () => [{ id: 7, ownerId: 1 }],
  listStems: async () => [],
  listDeliveries: async () => [],
  listMetrics: async () => [],
  listPresetBindings: async () => [],
  listSceneBindings: async () => [],
  listProjectAudit: async () => [
    {
      id: 1,
      projectId: 7,
      actorId: 1,
      eventType: "quality.evidence.build",
      payload: { evidenceKey: "build" },
      sha256: "b".repeat(64),
      createdAt: new Date(),
    },
  ],
  writeAudit: vi.fn(async () => undefined),
}));

import { appRouter } from "./routers";

describe("publishPrivateGithub provenance guard", () => {
  it("keeps publication locked when evidence has no server provenance", async () => {
    ghCalled.value = false;
    const context = {
      user: {
        id: 1,
        openId: "quality-user",
        name: "Quality User",
        email: "quality@example.com",
        loginMethod: "test",
        role: "admin" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as never,
      res: {} as never,
    };
    const result = await appRouter
      .createCaller(context)
      .production.publishPrivateGithub({ repository: "owner/private-repo" });
    expect(result.published).toBe(false);
    expect(result.status).toBe("locked");
    expect(result.gate.publishable).toBe(false);
    expect(ghCalled.value).toBe(false);
  });
});
