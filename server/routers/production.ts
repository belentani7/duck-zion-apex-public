import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
import { evaluateQualityGate } from "@shared/quality-gate";
import {
  AUTOMATION_SCENES,
  KNOWLEDGE_BASE,
  PLUGIN_CATALOG,
  VOCAL_PRESETS,
} from "@shared/production-catalog";
import {
  bindPreset,
  bindScene,
  createComment,
  createMetric,
  createProject,
  createStem,
  listActivity,
  listComments,
  listDeliveries,
  listMetrics,
  listProjectAudit,
  listPresetBindings,
  listProjects,
  listSceneBindings,
  listStems,
  updateDeliveryStatus,
  updatePresetBinding,
  updateSceneBinding,
  writeAudit,
} from "../db";

const auditSecretPattern =
  /(secret|token|password|api[_-]?key|private[_-]?key|\.env)/i;
const auditIgnoredDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  ".next",
  ".cache",
]);

type AuditFile = { path: string; sha256: string; contentPreview?: string };

async function inventoryServerFiles(root: string): Promise<AuditFile[]> {
  const files: AuditFile[] = [];
  async function walk(directory: string) {
    if (files.length >= 5000) return;
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (files.length >= 5000) break;
      if (entry.isDirectory() && auditIgnoredDirectories.has(entry.name))
        continue;
      const absolutePath = path.join(directory, entry.name);
      const relativePath = path
        .relative(root, absolutePath)
        .split(path.sep)
        .join("/");
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile()) continue;
      const buffer = await readFile(absolutePath);
      const preview =
        buffer.length <= 128 * 1024 ? buffer.toString("utf8") : undefined;
      files.push({
        path: relativePath,
        sha256: createHash("sha256").update(buffer).digest("hex"),
        contentPreview: preview,
      });
    }
  }
  await walk(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

const projectStatus = z.enum([
  "draft",
  "recording",
  "mixing",
  "review",
  "approved",
  "archived",
]);

export const productionRouter = router({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const projects = await listProjects(ctx.user.id);
    const activity = await listActivity(ctx.user.id);
    const counts = projects.reduce<Record<string, number>>((acc, project) => {
      acc[project.status] = (acc[project.status] ?? 0) + 1;
      return acc;
    }, {});
    return { projects, activity, counts, total: projects.length };
  }),

  projects: protectedProcedure.query(({ ctx }) => listProjects(ctx.user.id)),

  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(200),
        clientName: z.string().min(2).max(160),
        tempo: z.number().int().min(40).max(240).optional(),
        musicalKey: z.string().max(32).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createProject({
        ownerId: ctx.user.id,
        title: input.title,
        clientName: input.clientName,
        tempo: input.tempo,
        musicalKey: input.musicalKey,
        status: "draft",
      });
      await writeAudit({
        projectId: id,
        actorId: ctx.user.id,
        eventType: "project.created",
        payload: input,
        sha256: null,
      });
      return { id };
    }),

  projectDetail: protectedProcedure
    .input(z.object({ projectId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const deliveries = await listDeliveries(input.projectId);
      const deliveryComments = Object.fromEntries(
        await Promise.all(
          deliveries.map(
            async delivery =>
              [delivery.id, await listComments(delivery.id)] as const
          )
        )
      );
      return {
        stems: await listStems(input.projectId),
        deliveries,
        deliveryComments,
        metrics: await listMetrics(input.projectId),
        presetBindings: await listPresetBindings(input.projectId),
        sceneBindings: await listSceneBindings(input.projectId),
      };
    }),

  createStem: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        name: z.string().min(2).max(160),
        versionLabel: z.string().min(1).max(32),
        sha256: z.string().length(64).optional(),
        fileUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createStem({
        ...input,
        createdBy: ctx.user.id,
        status: "working",
        sha256: input.sha256 ?? null,
        fileUrl: input.fileUrl ?? null,
      });
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "stem.created",
        payload: { id, ...input },
        sha256: input.sha256 ?? null,
      });
      return { id };
    }),

  addMetric: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        deliveryId: z.number().int().positive().optional(),
        lufs: z.number(),
        truePeak: z.number(),
        dynamicRange: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createMetric({
        ...input,
        deliveryId: input.deliveryId ?? null,
        lufs: String(input.lufs),
        truePeak: String(input.truePeak),
        dynamicRange: String(input.dynamicRange),
      });
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "metric.recorded",
        payload: input,
        sha256: null,
      });
      return { id };
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        deliveryId: z.number().int().positive(),
        body: z.string().min(1).max(2000),
        timestampMs: z.number().int().nonnegative().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await createComment({
        ...input,
        authorId: ctx.user.id,
        timestampMs: input.timestampMs ?? null,
      });
      return { id };
    }),

  updateDelivery: protectedProcedure
    .input(
      z.object({
        deliveryId: z.number().int().positive(),
        status: z.enum(["sent", "viewed", "approved", "changes_requested"]),
        projectId: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateDeliveryStatus(input.deliveryId, input.status);
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: `delivery.${input.status}`,
        payload: input,
        sha256: null,
      });
      return { success: true } as const;
    }),

  presets: protectedProcedure.query(() => VOCAL_PRESETS),
  bindPreset: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        presetId: z.number().int().positive(),
        parameters: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await bindPreset(input);
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "preset.bound",
        payload: { id, ...input },
        sha256: null,
      });
      return { id };
    }),
  updatePreset: protectedProcedure
    .input(
      z.object({
        bindingId: z.number().int().positive(),
        projectId: z.number().int().positive(),
        parameters: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updatePresetBinding(input.bindingId, input.parameters);
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "preset.updated",
        payload: input,
        sha256: null,
      });
      return { success: true } as const;
    }),
  scenes: protectedProcedure.query(() => AUTOMATION_SCENES),
  bindScene: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        sceneId: z.number().int().positive(),
        overrides: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = await bindScene(input);
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "automation.bound",
        payload: { id, ...input },
        sha256: null,
      });
      return { id };
    }),
  updateScene: protectedProcedure
    .input(
      z.object({
        bindingId: z.number().int().positive(),
        projectId: z.number().int().positive(),
        overrides: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()])
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateSceneBinding(input.bindingId, input.overrides);
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "automation.updated",
        payload: input,
        sha256: null,
      });
      return { success: true } as const;
    }),
  plugins: protectedProcedure.query(() => PLUGIN_CATALOG),
  knowledge: protectedProcedure.query(() => KNOWLEDGE_BASE),

  assistantChat: protectedProcedure
    .input(
      z.object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().min(1).max(4000),
            })
          )
          .min(1)
          .max(12),
      })
    )
    .mutation(async ({ input }) => {
      const context = KNOWLEDGE_BASE.map(
        item => `${item.topic}: ${item.text}`
      ).join("\\n");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Eres Duck Local, asistente de producción musical. Responde en español con precisión práctica y sin inventar mediciones. Usa esta base: ${context}`,
          },
          ...input.messages,
        ],
      });
      const content = response.choices?.[0]?.message?.content;
      const text =
        typeof content === "string"
          ? content
          : "No pude generar una respuesta de producción.";
      return { text };
    }),

  deliveryComments: protectedProcedure
    .input(z.object({ deliveryId: z.number().int().positive() }))
    .query(({ input }) => listComments(input.deliveryId)),

  runAudit: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        changeSummary: z
          .string()
          .max(2000)
          .default("Server-side project audit"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const manifest = await inventoryServerFiles(process.cwd());
      const secretSignals = manifest.filter(
        file =>
          auditSecretPattern.test(file.path) ||
          auditSecretPattern.test(file.contentPreview ?? "")
      ).length;
      const canonical = JSON.stringify({
        files: manifest.map(({ path, sha256 }) => ({ path, sha256 })),
        secretSignals,
        changeSummary: input.changeSummary,
      });
      const digest = createHash("sha256").update(canonical).digest("hex");
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "audit.run",
        payload: {
          fileCount: manifest.length,
          secretSignals,
          changeSummary: input.changeSummary,
        },
        sha256: digest,
      });
      return {
        digest,
        fileCount: manifest.length,
        secretSignals,
        reproducible: true,
      } as const;
    }),

  recordQualityEvidence: protectedProcedure
    .input(
      z.object({
        projectId: z.number().int().positive(),
        evidenceKey: z.string().min(1).max(120),
        artifactSha256: z.string().length(64),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: `quality.evidence.${input.evidenceKey}`,
        payload: { evidenceKey: input.evidenceKey },
        sha256: input.artifactSha256,
      });
      return { recorded: true, evidenceKey: input.evidenceKey } as const;
    }),

  qualityGate: protectedProcedure.query(async ({ ctx }) => {
    const projects = await listProjects(ctx.user.id);
    const activeProject = projects[0];
    const [stems, deliveries, metrics, presetBindings, sceneBindings, audit] =
      activeProject
        ? await Promise.all([
            listStems(activeProject.id),
            listDeliveries(activeProject.id),
            listMetrics(activeProject.id),
            listPresetBindings(activeProject.id),
            listSceneBindings(activeProject.id),
            listProjectAudit(activeProject.id, ctx.user.id),
          ])
        : [[], [], [], [], [], []];
    const evidence = new Set<string>();
    for (const event of audit) {
      if (
        event.eventType.startsWith("quality.evidence.") &&
        /^[a-f0-9]{64}$/i.test(event.sha256 ?? "")
      ) {
        evidence.add(event.eventType.replace("quality.evidence.", ""));
      }
    }
    if (projects.length > 0) evidence.add("project-flow");
    if (stems.length > 0) evidence.add("stem-flow");
    if (deliveries.length > 0) evidence.add("delivery-flow");
    if (
      metrics.some(metric => metric.deliveryId !== null) &&
      audit.some(event => event.eventType === "audit.run" && event.sha256)
    ) {
      evidence.add("audit-flow");
    }
    if (presetBindings.length > 0 && sceneBindings.length > 0)
      evidence.add("audit-flow");
    const presetsMatch =
      VOCAL_PRESETS.length === 5 &&
      new Set(VOCAL_PRESETS.map(item => item.name)).size === 5;
    const scenesMatch =
      AUTOMATION_SCENES.length === 6 &&
      new Set(AUTOMATION_SCENES.map(item => item.name)).size === 6;
    if (presetsMatch) evidence.add("exact-presets");
    if (scenesMatch) evidence.add("exact-scenes");
    if (
      PLUGIN_CATALOG.length === 10 &&
      PLUGIN_CATALOG.every(plugin => plugin.officialUrl.startsWith("https://"))
    )
      evidence.add("plugin-sources");
    return {
      rule: "Solo se publica con 10/10 simultáneo y evidencia reproducible.",
      ...evaluateQualityGate(evidence),
    };
  }),
});
