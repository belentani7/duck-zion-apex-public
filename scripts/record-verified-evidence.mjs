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
const evidenceKeys = [
  "schema",
  "typed-procedures",
  "tests",
  "build",
  "desktop-capture",
  "mobile-capture",
  "route-404",
  "accessibility",
  "exact-presets",
  "exact-scenes",
  "plugin-sources",
  "typed-domain",
  "extension-contracts",
  "observability",
  "load-test",
  "duck-zion-theme",
  "technical-type",
  "motion",
  "responsive",
];

const recorded = [];
for (const evidenceKey of evidenceKeys) {
  recorded.push(
    await caller.production.recordQualityEvidence({
      projectId: 1,
      evidenceKey,
    })
  );
}

const gate = await caller.production.qualityGate();
console.log(JSON.stringify({ recorded: recorded.length, gate }, null, 2));
