import { describe, expect, it, vi } from "vitest";
import { QUALITY_DIMENSIONS } from "@shared/quality-gate";

const ghState = vi.hoisted(() => ({
  mode: "success" as "success" | "failure",
}));

vi.mock("node:child_process", () => ({
  execFile: (_file: string, _args: string[], callback: Function) => {
    if (ghState.mode === "failure") {
      callback(
        new Error("remote: repository already exists"),
        "",
        "repository already exists"
      );
      return;
    }
    callback(null, "https://github.com/owner/private-repo", "");
  },
}));

vi.mock("./db", () => {
  const project = { id: 7, ownerId: 1, status: "mixing" };
  const delivery = { id: 9, projectId: 7, label: "v03", version: "03" };
  const audit = QUALITY_DIMENSIONS.flatMap(dimension =>
    dimension.requiredEvidence.map(evidenceKey => ({
      id: evidenceKey,
      projectId: 7,
      actorId: 1,
      eventType: `quality.evidence.${evidenceKey}`,
      payload: { evidenceKey },
      sha256: "a".repeat(64),
      createdAt: new Date(),
    }))
  );
  const noop = async () => 1;
  return {
    listProjects: async () => [project],
    listStems: async () => [{ id: 1, projectId: 7, sha256: "b".repeat(64) }],
    listDeliveries: async () => [delivery],
    listMetrics: async () => [
      {
        id: 1,
        projectId: 7,
        deliveryId: 9,
        lufs: "-14",
        truePeak: "-1",
        dynamicRange: "8",
      },
    ],
    listPresetBindings: async () => [{ id: 1, projectId: 7 }],
    listSceneBindings: async () => [{ id: 1, projectId: 7 }],
    listProjectAudit: async () => audit,
    listActivity: async () => [],
    listComments: async () => [],
    bindPreset: noop,
    bindScene: noop,
    createComment: noop,
    createMetric: noop,
    createProject: noop,
    createStem: noop,
    updateDeliveryStatus: noop,
    updatePresetBinding: noop,
    updateSceneBinding: noop,
    writeAudit: vi.fn(async () => undefined),
  };
});

import { appRouter } from "./routers";

describe("publishPrivateGithub procedure", () => {
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

  it("publishes only after the mocked gate reaches 10/10", async () => {
    ghState.mode = "success";
    const result = await appRouter
      .createCaller(context)
      .production.publishPrivateGithub({ repository: "owner/private-repo" });
    expect(result.published).toBe(true);
    expect(result.status).toBe("published");
    expect(result.gate.publishable).toBe(true);
  });

  it("returns a typed conflict when gh reports an existing repository", async () => {
    ghState.mode = "failure";
    await expect(
      appRouter
        .createCaller(context)
        .production.publishPrivateGithub({ repository: "owner/private-repo" })
    ).rejects.toMatchObject({
      code: "CONFLICT",
      message: expect.stringContaining("already exists"),
    });
  });
});
