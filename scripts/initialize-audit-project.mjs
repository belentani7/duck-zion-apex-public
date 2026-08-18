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
const created = await caller.production.createProject({
  title: "DUCK ZION Apex — Audit Run 2026-08-18",
  clientName: "belentani7",
  tempo: 120,
  musicalKey: "C minor",
});
console.log(JSON.stringify(created));
