import { createHash } from "node:crypto";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { protectedProcedure, router } from "../_core/trpc";
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
  listPresetBindings,
  listProjects,
  listSceneBindings,
  listStems,
  updateDeliveryStatus,
  updatePresetBinding,
  updateSceneBinding,
  writeAudit,
} from "../db";

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
        files: z
          .array(
            z.object({
              path: z.string().min(1).max(500),
              sha256: z.string().length(64),
            })
          )
          .max(5000),
        secretSignals: z.number().int().nonnegative().max(10000),
        changeSummary: z.string().max(2000).default("Manual audit run"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const manifest = [...input.files].sort((a, b) =>
        a.path.localeCompare(b.path)
      );
      const canonical = JSON.stringify({
        files: manifest,
        secretSignals: input.secretSignals,
        changeSummary: input.changeSummary,
      });
      const digest = createHash("sha256").update(canonical).digest("hex");
      await writeAudit({
        projectId: input.projectId,
        actorId: ctx.user.id,
        eventType: "audit.run",
        payload: {
          fileCount: manifest.length,
          secretSignals: input.secretSignals,
          changeSummary: input.changeSummary,
        },
        sha256: digest,
      });
      return {
        digest,
        fileCount: manifest.length,
        secretSignals: input.secretSignals,
        reproducible: true,
      } as const;
    }),

  qualityGate: protectedProcedure.query(() => ({
    status: "locked" as const,
    publishable: false,
    rule: "Solo se publica con 10/10 simultáneo y evidencia reproducible.",
    dimensions: [
      {
        key: "backend",
        label: "Backend",
        score: 0,
        evidence: "Pendiente de pruebas de procedimientos y persistencia.",
      },
      {
        key: "frontend",
        label: "Frontend",
        score: 0,
        evidence: "Pendiente de verificación visual desktop/móvil.",
      },
      {
        key: "utility",
        label: "Utilidad",
        score: 0,
        evidence: "Pendiente de flujo completo de producción.",
      },
      {
        key: "relevance",
        label: "Relevancia",
        score: 0,
        evidence: "Pendiente de revisión del flujo profesional.",
      },
      {
        key: "potential",
        label: "Potencial",
        score: 0,
        evidence: "Pendiente de auditoría de extensibilidad.",
      },
      {
        key: "identity",
        label: "Identidad",
        score: 0,
        evidence: "Pendiente de revisión DUCK ZION.",
      },
    ],
  })),
});
