import { appRouter } from "../server/routers.ts";

const context = {
  user: {
    id: 1,
    openId: "belentani7",
    name: "belentani7",
    email: "",
    loginMethod: "audit",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {},
  res: {},
};

const caller = appRouter.createCaller(context);
const projectId = 1;
const stem = await caller.production.createStem({
  projectId,
  name: "Lead Vocal — audit take",
  versionLabel: "v01",
});
const delivery = await caller.production.createDelivery({
  projectId,
  stemVersionId: stem.id,
  label: "Audit delivery v01",
});
await caller.production.addMetric({
  projectId,
  deliveryId: delivery.id,
  lufs: -14,
  truePeak: -1,
  dynamicRange: 8,
});
await caller.production.bindPreset({
  projectId,
  presetId: 1,
  parameters: { gain: 0, presence: 1 },
});
await caller.production.bindScene({
  projectId,
  sceneId: 1,
  overrides: { intensity: 0.8 },
});
const audit = await caller.production.runAudit({
  projectId,
  changeSummary: "Complete functional audit workflow",
});
const gate = await caller.production.qualityGate();
console.log(JSON.stringify({ stem, delivery, audit, gate }, null, 2));
