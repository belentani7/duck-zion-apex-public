import { writeFile } from "node:fs/promises";
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

const gate = await appRouter.createCaller(context).production.qualityGate();
const report = {
  auditedAt: new Date().toISOString(),
  repositoryTarget: "belentani7/duck-zion-apex-audit-2026-08-18",
  gate,
  publicationAttempted: false,
  publicationReason: gate.publishable
    ? "Gate open; publication may proceed only after final confirmation of remote target."
    : "Blocked: all six dimensions are not 10/10.",
};
await writeFile(
  "docs/audit-final.json",
  JSON.stringify(report, null, 2) + "\n"
);
console.log(JSON.stringify(report, null, 2));
