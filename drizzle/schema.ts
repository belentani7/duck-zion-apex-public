import {
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  status: mysqlEnum("status", [
    "draft",
    "recording",
    "mixing",
    "review",
    "approved",
    "archived",
  ])
    .default("draft")
    .notNull(),
  tempo: int("tempo"),
  musicalKey: varchar("musicalKey", { length: 32 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const stemVersions = mysqlTable("stemVersions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  versionLabel: varchar("versionLabel", { length: 32 }).notNull(),
  sha256: varchar("sha256", { length: 64 }),
  fileUrl: text("fileUrl"),
  status: mysqlEnum("status", ["working", "review", "approved", "rejected"])
    .default("working")
    .notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vocalPresets = mysqlTable("vocalPresets", {
  id: int("id").autoincrement().primaryKey(),
  name: mysqlEnum("name", [
    "Vocal Clean",
    "Pop Gloss",
    "Urban Tight",
    "Funk Brasil Pulse",
    "Stage Lead",
  ])
    .notNull()
    .unique(),
  description: text("description").notNull(),
  parameters: json("parameters").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const projectPresetBindings = mysqlTable("projectPresetBindings", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  presetId: int("presetId").notNull(),
  parameters: json("parameters").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const automationScenes = mysqlTable("automationScenes", {
  id: int("id").autoincrement().primaryKey(),
  name: mysqlEnum("name", [
    "verse",
    "pre-hook",
    "hook",
    "drop",
    "adlib",
    "final lift",
  ])
    .notNull()
    .unique(),
  description: text("description").notNull(),
  actions: json("actions").notNull(),
});

export const projectAutomationBindings = mysqlTable(
  "projectAutomationBindings",
  {
    id: int("id").autoincrement().primaryKey(),
    projectId: int("projectId").notNull(),
    sceneId: int("sceneId").notNull(),
    overrides: json("overrides").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export const plugins = mysqlTable("plugins", {
  id: int("id").autoincrement().primaryKey(),
  rank: int("rank").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  vendor: varchar("vendor", { length: 160 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  format: varchar("format", { length: 160 }).notNull(),
  officialUrl: text("officialUrl").notNull(),
  verification: mysqlEnum("verification", ["pending", "verified", "blocked"])
    .default("pending")
    .notNull(),
  installationGuide: text("installationGuide").notNull(),
});

export const deliveries = mysqlTable("deliveries", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stemVersionId: int("stemVersionId").notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  status: mysqlEnum("status", [
    "sent",
    "viewed",
    "approved",
    "changes_requested",
  ])
    .default("sent")
    .notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
});

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  deliveryId: int("deliveryId").notNull(),
  authorId: int("authorId").notNull(),
  body: text("body").notNull(),
  timestampMs: int("timestampMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const metrics = mysqlTable("metrics", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  deliveryId: int("deliveryId"),
  lufs: decimal("lufs", { precision: 6, scale: 2 }),
  truePeak: decimal("truePeak", { precision: 6, scale: 2 }),
  dynamicRange: decimal("dynamicRange", { precision: 6, scale: 2 }),
  measuredAt: timestamp("measuredAt").defaultNow().notNull(),
});

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  actorId: int("actorId"),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  payload: json("payload").notNull(),
  sha256: varchar("sha256", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
