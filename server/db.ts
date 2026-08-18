import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  auditLogs,
  comments,
  deliveries,
  metrics,
  plugins,
  projectAutomationBindings,
  projectPresetBindings,
  projects,
  stemVersions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function listProjects(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.updatedAt));
}

export async function createProject(input: typeof projects.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(projects).values(input);
  return Number(result[0].insertId);
}

export async function listStems(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(stemVersions)
    .where(eq(stemVersions.projectId, projectId))
    .orderBy(desc(stemVersions.createdAt));
}

export async function listPresetBindings(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(projectPresetBindings)
    .where(eq(projectPresetBindings.projectId, projectId))
    .orderBy(desc(projectPresetBindings.createdAt));
}

export async function updatePresetBinding(
  id: number,
  parameters: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db
    .update(projectPresetBindings)
    .set({ parameters })
    .where(eq(projectPresetBindings.id, id));
}

export async function listSceneBindings(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(projectAutomationBindings)
    .where(eq(projectAutomationBindings.projectId, projectId))
    .orderBy(desc(projectAutomationBindings.createdAt));
}

export async function updateSceneBinding(
  id: number,
  overrides: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db
    .update(projectAutomationBindings)
    .set({ overrides })
    .where(eq(projectAutomationBindings.id, id));
}

export async function bindPreset(
  input: typeof projectPresetBindings.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(projectPresetBindings).values(input);
  return Number(result[0].insertId);
}

export async function bindScene(
  input: typeof projectAutomationBindings.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(projectAutomationBindings).values(input);
  return Number(result[0].insertId);
}

export async function createStem(input: typeof stemVersions.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(stemVersions).values(input);
  return Number(result[0].insertId);
}

export async function createMetric(input: typeof metrics.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(metrics).values(input);
  return Number(result[0].insertId);
}

export async function createComment(input: typeof comments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(comments).values(input);
  return Number(result[0].insertId);
}

export async function updateDeliveryStatus(
  id: number,
  status: "sent" | "viewed" | "approved" | "changes_requested"
) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db
    .update(deliveries)
    .set({ status, approvedAt: status === "approved" ? new Date() : null })
    .where(eq(deliveries.id, id));
}

export async function listDeliveries(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(deliveries)
    .where(eq(deliveries.projectId, projectId))
    .orderBy(desc(deliveries.sentAt));
}

export async function listComments(deliveryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(comments)
    .where(eq(comments.deliveryId, deliveryId))
    .orderBy(desc(comments.createdAt));
}

export async function listMetrics(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(metrics)
    .where(eq(metrics.projectId, projectId))
    .orderBy(desc(metrics.measuredAt));
}

export async function listActivity(actorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.actorId, actorId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(12);
}

export async function writeAudit(input: typeof auditLogs.$inferInsert) {
  if (process.env.NODE_ENV === "test") return;
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLogs).values(input);
}
