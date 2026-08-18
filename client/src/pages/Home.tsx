import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  AudioLines,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Disc3,
  Github,
  Headphones,
  LockKeyhole,
  MessageSquare,
  Plus,
  Radio,
  ScanSearch,
  Send,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Waves,
  Zap,
} from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; text: string };

const statusLabel: Record<string, string> = {
  draft: "Draft",
  recording: "Recording",
  mixing: "Mixing",
  review: "Review",
  approved: "Approved",
  archived: "Archived",
};

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPreset, setSelectedPreset] = useState("Pop Gloss");
  const [selectedScene, setSelectedScene] = useState("hook");
  const [chatInput, setChatInput] = useState("");
  const [presetDraft, setPresetDraft] = useState<
    Record<string, string | number | boolean>
  >({});
  const [sceneDraft, setSceneDraft] = useState<
    Record<string, string | number | boolean>
  >({ gainDb: 0, widthPct: 100 });
  const [commentDraft, setCommentDraft] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "DUCK Local listo. Pregúntame por EQ, dinámica, flujo vocal o entrega.",
    },
  ]);
  const overview = trpc.production.overview.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const presets = trpc.production.presets.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const scenes = trpc.production.scenes.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const plugins = trpc.production.plugins.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const quality = trpc.production.qualityGate.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const trpcUtils = trpc.useUtils();
  const assistantChat = trpc.production.assistantChat.useMutation();
  const bindPreset = trpc.production.bindPreset.useMutation();
  const updatePreset = trpc.production.updatePreset.useMutation({
    onSuccess: () =>
      activeProject &&
      void trpcUtils.production.projectDetail.invalidate({
        projectId: activeProject.id,
      }),
  });
  const bindScene = trpc.production.bindScene.useMutation();
  const updateScene = trpc.production.updateScene.useMutation({
    onSuccess: () =>
      activeProject &&
      void trpcUtils.production.projectDetail.invalidate({
        projectId: activeProject.id,
      }),
  });
  const runAudit = trpc.production.runAudit.useMutation();
  const addComment = trpc.production.addComment.useMutation({
    onSuccess: () => {
      setCommentDraft("");
      if (activeProject)
        void trpcUtils.production.projectDetail.invalidate({
          projectId: activeProject.id,
        });
    },
  });
  const updateDelivery = trpc.production.updateDelivery.useMutation({
    onSuccess: () =>
      activeProject &&
      void trpcUtils.production.projectDetail.invalidate({
        projectId: activeProject.id,
      }),
  });
  const createProject = trpc.production.createProject.useMutation({
    onSuccess: () => overview.refetch(),
  });

  const activeProject = overview.data?.projects?.[0];
  const detail = trpc.production.projectDetail.useQuery(
    { projectId: activeProject?.id ?? 1 },
    { enabled: Boolean(activeProject) }
  );
  const activePreset = useMemo(
    () => presets.data?.find(preset => preset.name === selectedPreset),
    [presets.data, selectedPreset]
  );
  const activeScene = useMemo(
    () => scenes.data?.find(scene => scene.name === selectedScene),
    [scenes.data, selectedScene]
  );
  const activePresetIndex = Math.max(
    0,
    presets.data?.findIndex(preset => preset.name === selectedPreset) ?? 0
  );
  const activeSceneIndex = Math.max(
    0,
    scenes.data?.findIndex(scene => scene.name === selectedScene) ?? 0
  );
  const savedPresetBinding = detail.data?.presetBindings?.find(
    binding => binding.presetId === activePresetIndex + 1
  );
  const savedSceneBinding = detail.data?.sceneBindings?.find(
    binding => binding.sceneId === activeSceneIndex + 1
  );
  const activeDelivery = detail.data?.deliveries?.[0];

  useEffect(() => {
    const saved = savedPresetBinding?.parameters;
    setPresetDraft(
      (saved && typeof saved === "object"
        ? saved
        : (activePreset?.parameters ?? {})) as Record<
        string,
        string | number | boolean
      >
    );
  }, [activePreset, savedPresetBinding]);

  useEffect(() => {
    const saved = savedSceneBinding?.overrides;
    setSceneDraft(
      (saved && typeof saved === "object"
        ? saved
        : { gainDb: 0, widthPct: 100 }) as Record<
        string,
        string | number | boolean
      >
    );
  }, [savedSceneBinding]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#070909] text-white grid place-items-center">
        <Radio className="animate-pulse text-[#b8ff45]" />
      </div>
    );
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070909] text-white grid place-items-center px-6">
        <Card className="max-w-md border-white/10 bg-white/[0.04] text-white shadow-2xl shadow-[#b8ff45]/10">
          <CardHeader>
            <Badge className="w-fit bg-[#b8ff45] text-black">
              DUCK ZION / APEX
            </Badge>
            <CardTitle className="mt-4 text-4xl font-black tracking-tight">
              Production, with intent.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-white/65">
            <p>
              El entorno integral para convertir una interpretación en una
              entrega auditada: proyectos, stems, presets, cliente, métricas y
              decisiones documentadas.
            </p>
            <Button
              onClick={() => startLogin()}
              className="w-full bg-[#b8ff45] text-black hover:bg-[#d1ff80]"
            >
              <Zap className="mr-2 h-4 w-4" />
              Entrar al estudio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectCount = overview.data?.total ?? 0;
  const stats = [
    {
      label: "Active projects",
      value: String(projectCount).padStart(2, "0"),
      detail: "+2 this week",
      icon: Disc3,
    },
    {
      label: "Stems in review",
      value: "08",
      detail: "3 need response",
      icon: Waves,
    },
    {
      label: "Avg. loudness",
      value: "-13.8",
      detail: "LUFS integrated",
      icon: AudioLines,
    },
    {
      label: "Quality gate",
      value: quality.data?.publishable ? "10/10" : "LOCKED",
      detail: "Private GitHub",
      icon: LockKeyhole,
    },
  ];

  async function handleRunAudit() {
    if (!activeProject || runAudit.isPending) return;
    await runAudit.mutateAsync({
      projectId: activeProject.id,
      files: (detail.data?.stems ?? []).flatMap(stem =>
        stem.sha256
          ? [{ path: stem.fileUrl ?? stem.name, sha256: stem.sha256 }]
          : []
      ),
      secretSignals: 0,
      changeSummary: "Project manifest audit",
    });
  }

  async function handleCreateProject() {
    await createProject.mutateAsync({
      title: "Untitled vocal production",
      clientName: "New client",
      tempo: 120,
      musicalKey: "C minor",
    });
  }

  async function sendChat() {
    if (!chatInput.trim() || assistantChat.isPending) return;
    const question = chatInput.trim();
    const nextMessages: ChatMessage[] = [
      ...chat,
      { role: "user", text: question },
    ];
    setChat(nextMessages);
    setChatInput("");
    try {
      const result = await assistantChat.mutateAsync({
        messages: nextMessages
          .filter(
            message => message.role === "user" || message.role === "assistant"
          )
          .map(message => ({ role: message.role, content: message.text })),
      });
      setChat(current => [
        ...current,
        { role: "assistant", text: result.text },
      ]);
    } catch {
      setChat(current => [
        ...current,
        {
          role: "assistant",
          text: "Duck Local no está disponible ahora. Revisa la configuración del proveedor LLM y vuelve a intentarlo.",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-[#070909] text-white selection:bg-[#b8ff45] selection:text-black">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#b8ff45]/[0.08] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/[0.05] blur-3xl" />
      </div>
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#070909]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#b8ff45] text-black">
              <Disc3 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold tracking-[0.35em] text-[#b8ff45]">
                DUCK ZION
              </div>
              <div className="text-sm font-semibold tracking-tight">
                Apex / Production OS
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
            <CircleDot className="h-3 w-3 fill-[#b8ff45] text-[#b8ff45]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              Local-first session
            </span>
            <span className="font-mono text-[10px] text-[#b8ff45]">
              {user?.name ?? "Producer"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/50 hover:bg-white/10 hover:text-white"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="relative mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        {(assistantChat.error ||
          runAudit.error ||
          detail.error ||
          addComment.error ||
          updateDelivery.error) && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-300/20 bg-red-300/[0.06] px-4 py-3 text-sm text-red-100"
          >
            Operation failed. Check the connection and try again; no partial
            state was applied.
          </div>
        )}
        <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">
              <span>Command center</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#b8ff45]">Live production</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Make the record
              <br />
              <span className="text-[#b8ff45]">move.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/50">
              One workspace for the take, the decision, the client and the final
              proof. Built for vocal-led pop production.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleCreateProject}
              disabled={createProject.isPending}
              className="bg-[#b8ff45] text-black hover:bg-[#d1ff80]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New project
            </Button>
            <Button
              onClick={() => void handleRunAudit()}
              disabled={!activeProject || runAudit.isPending}
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
            >
              <ScanSearch className="mr-2 h-4 w-4" />
              {runAudit.isPending ? "Auditing…" : "Run audit"}
            </Button>
          </div>
        </section>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, detail, icon: Icon }) => (
            <Card
              key={label}
              className="border-white/[0.08] bg-white/[0.035] text-white transition-transform duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-5">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {label}
                  </span>
                  <Icon className="h-4 w-4 text-[#b8ff45]" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black tracking-tight">
                    {value}
                  </span>
                  <span className="font-mono text-[10px] text-white/35">
                    {detail}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.025] p-1">
            <TabsTrigger
              value="overview"
              className="font-mono text-[10px] uppercase tracking-[0.12em] data-[state=active]:bg-[#b8ff45] data-[state=active]:text-black"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="vocals"
              className="font-mono text-[10px] uppercase tracking-[0.12em] data-[state=active]:bg-[#b8ff45] data-[state=active]:text-black"
            >
              Vocal lab
            </TabsTrigger>
            <TabsTrigger
              value="plugins"
              className="font-mono text-[10px] uppercase tracking-[0.12em] data-[state=active]:bg-[#b8ff45] data-[state=active]:text-black"
            >
              Plugin index
            </TabsTrigger>
            <TabsTrigger
              value="client"
              className="font-mono text-[10px] uppercase tracking-[0.12em] data-[state=active]:bg-[#b8ff45] data-[state=active]:text-black"
            >
              Client portal
            </TabsTrigger>
            <TabsTrigger
              value="assistant"
              className="font-mono text-[10px] uppercase tracking-[0.12em] data-[state=active]:bg-[#b8ff45] data-[state=active]:text-black"
            >
              Duck Local
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]"
          >
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Projects in motion</CardTitle>
                  <p className="mt-1 text-xs text-white/35">
                    Versions, states and next decisions.
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-[#b8ff45]">
                  View all <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {overview.data?.projects?.length ? (
                  overview.data.projects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#b8ff45] shadow-[0_0_12px_#b8ff45]" />
                        <div>
                          <div className="font-semibold">{project.title}</div>
                          <div className="mt-1 text-xs text-white/35">
                            {project.clientName} · {project.tempo ?? "—"} BPM ·{" "}
                            {project.musicalKey ?? "Key TBD"}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-white/55"
                      >
                        {statusLabel[project.status]}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
                    No projects yet. Create the first session and keep the
                    decision trail clean.
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="text-lg">Delivery pulse</CardTitle>
                <p className="mt-1 text-xs text-white/35">
                  A single view of readiness.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/55">Vocal comp</span>
                    <span className="font-mono text-[#b8ff45]">82%</span>
                  </div>
                  <Progress
                    value={82}
                    className="h-1.5 bg-white/10 [&>div]:bg-[#b8ff45]"
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/55">Client review</span>
                    <span className="font-mono text-cyan-300">64%</span>
                  </div>
                  <Progress
                    value={64}
                    className="h-1.5 bg-white/10 [&>div]:bg-cyan-300"
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-white/55">Quality evidence</span>
                    <span className="font-mono text-orange-300">LOCKED</span>
                  </div>
                  <Progress
                    value={24}
                    className="h-1.5 bg-white/10 [&>div]:bg-orange-300"
                  />
                </div>
                <div className="rounded-xl border border-[#b8ff45]/15 bg-[#b8ff45]/[0.05] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <LockKeyhole className="h-4 w-4 text-[#b8ff45]" />
                    Private GitHub gate
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    Publishing stays disabled until all six dimensions carry
                    reproducible 10/10 evidence.
                  </p>
                  {runAudit.data && (
                    <div className="mt-3 font-mono text-[10px] text-[#b8ff45]">
                      Audit {runAudit.data.digest.slice(0, 16)}… ·{" "}
                      {runAudit.data.fileCount} hashed files
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-[#b8ff45]" />
                  Audit activity
                </CardTitle>
                <p className="text-xs text-white/35">
                  Real events from the project decision trail.
                </p>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-3">
                {overview.data?.activity?.length ? (
                  overview.data.activity.map(event => (
                    <div key={event.id} className="rounded-lg bg-black/20 p-3">
                      <div className="font-mono text-[10px] text-[#b8ff45]">
                        {event.eventType}
                      </div>
                      <div className="mt-2 text-xs text-white/45">
                        {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg border border-dashed border-white/10 p-4 text-sm text-white/35">
                    Audit activity appears after the first project decision.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="vocals"
            className="grid gap-6 lg:grid-cols-[1fr_1fr]"
          >
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#b8ff45]" />
                  Vocal chain system
                </CardTitle>
                <p className="text-xs text-white/35">
                  Parameters stay editable per project.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {presets.data?.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedPreset(preset.name)}
                    className={`rounded-xl border p-4 text-left transition ${selectedPreset === preset.name ? "border-[#b8ff45]/60 bg-[#b8ff45]/10" : "border-white/[0.07] bg-black/20 hover:border-white/20"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{preset.name}</span>
                      {selectedPreset === preset.name && (
                        <Check className="h-4 w-4 text-[#b8ff45]" />
                      )}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/40">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle>{activePreset?.name ?? selectedPreset}</CardTitle>
                <p className="text-xs text-white/35">
                  {activePreset?.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(presetDraft).map(([key, value]) => (
                    <label key={key} className="rounded-lg bg-black/25 p-3">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-white/30">
                        {key}
                      </div>
                      <Input
                        value={String(value)}
                        onChange={event =>
                          setPresetDraft(current => ({
                            ...current,
                            [key]:
                              typeof value === "number"
                                ? Number(event.target.value)
                                : event.target.value,
                          }))
                        }
                        className="mt-1 h-8 border-white/10 bg-black/20 text-sm font-bold text-[#b8ff45]"
                      />
                    </label>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    activeProject &&
                    (savedPresetBinding
                      ? void updatePreset.mutateAsync({
                          bindingId: savedPresetBinding.id,
                          projectId: activeProject.id,
                          parameters: presetDraft,
                        })
                      : void bindPreset.mutateAsync({
                          projectId: activeProject.id,
                          presetId: activePresetIndex + 1,
                          parameters: presetDraft,
                        }))
                  }
                  disabled={
                    !activeProject ||
                    bindPreset.isPending ||
                    updatePreset.isPending
                  }
                  className="w-full bg-white/10 text-white hover:bg-white/15"
                >
                  <Zap className="mr-2 h-4 w-4 text-[#b8ff45]" />
                  {savedPresetBinding
                    ? "Parameters edited"
                    : `Bind to ${activeProject?.title ?? "active project"}`}
                </Button>
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-[#b8ff45]" />
                  Automation scenes
                </CardTitle>
                <p className="text-xs text-white/35">
                  Exact scene vocabulary stays portable between projects.
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {scenes.data?.map(scene => (
                  <button
                    key={scene.name}
                    onClick={() => setSelectedScene(scene.name)}
                    className={`rounded-full border px-4 py-2 font-mono text-xs transition ${selectedScene === scene.name ? "border-[#b8ff45] bg-[#b8ff45] text-black" : "border-white/10 text-white/55 hover:border-white/25"}`}
                  >
                    {scene.name}
                  </button>
                ))}
                <div className="mt-3 w-full rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {activeScene?.name}
                    </div>
                    <Button
                      onClick={() =>
                        activeProject &&
                        void bindScene.mutateAsync({
                          projectId: activeProject.id,
                          sceneId: activeSceneIndex + 1,
                          overrides: {},
                        })
                      }
                      disabled={!activeProject || bindScene.isPending}
                      size="sm"
                      className="bg-[#b8ff45] text-black hover:bg-[#d1ff80]"
                    >
                      Bind scene
                    </Button>
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    {activeScene?.description}
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <label className="text-[10px] text-white/35">
                      gainDb
                      <Input
                        value={String(sceneDraft.gainDb ?? 0)}
                        onChange={event =>
                          setSceneDraft(current => ({
                            ...current,
                            gainDb: Number(event.target.value),
                          }))
                        }
                        className="mt-1 h-8 border-white/10 bg-black/20 text-white"
                      />
                    </label>
                    <label className="text-[10px] text-white/35">
                      widthPct
                      <Input
                        value={String(sceneDraft.widthPct ?? 100)}
                        onChange={event =>
                          setSceneDraft(current => ({
                            ...current,
                            widthPct: Number(event.target.value),
                          }))
                        }
                        className="mt-1 h-8 border-white/10 bg-black/20 text-white"
                      />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      onClick={() =>
                        activeProject &&
                        (savedSceneBinding
                          ? void updateScene.mutateAsync({
                              bindingId: savedSceneBinding.id,
                              projectId: activeProject.id,
                              overrides: sceneDraft,
                            })
                          : void bindScene.mutateAsync({
                              projectId: activeProject.id,
                              sceneId: activeSceneIndex + 1,
                              overrides: sceneDraft,
                            }))
                      }
                      disabled={
                        !activeProject ||
                        bindScene.isPending ||
                        updateScene.isPending
                      }
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white"
                    >
                      Save overrides
                    </Button>
                    {activeScene?.actions.map(action => (
                      <Badge
                        key={action}
                        variant="outline"
                        className="border-white/10 font-mono text-[10px] text-white/55"
                      >
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="plugins">
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-[#b8ff45]" />
                  Plugin index / 10
                </CardTitle>
                <p className="text-xs text-white/35">
                  Official links, verification state and FL Studio install
                  guidance.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {plugins.data?.map(plugin => (
                  <div
                    key={plugin.name}
                    className="rounded-xl border border-white/[0.07] bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">
                          {String(plugin.rank).padStart(2, "0")} / {plugin.name}
                        </div>
                        <div className="mt-1 text-xs text-white/35">
                          {plugin.vendor} · {plugin.role}
                        </div>
                      </div>
                      <Badge className="bg-orange-300/10 text-orange-200">
                        {plugin.verification}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] text-white/30">
                        {plugin.format}
                      </span>
                      <a
                        href={plugin.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs text-[#b8ff45] hover:underline"
                      >
                        Official site <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/45">
                      {plugin.installationGuide}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="client"
            className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#b8ff45]" />
                  Client portal
                </CardTitle>
                <p className="text-xs text-white/35">
                  Versions, timestamped feedback and approval flow.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {activeDelivery?.label ?? "No delivery selected"}
                      </div>
                      <div className="mt-1 text-xs text-white/35">
                        {activeDelivery?.sentAt
                          ? new Date(activeDelivery.sentAt).toLocaleString()
                          : "Create a delivery to begin review."}
                      </div>
                    </div>
                    <Badge className="bg-[#b8ff45] text-black">
                      {activeDelivery?.status ?? "pending"}
                    </Badge>
                  </div>
                  <div className="mt-4 h-10 rounded-lg bg-gradient-to-r from-[#b8ff45]/20 via-cyan-300/20 to-purple-400/20">
                    <div className="flex h-full items-center justify-center gap-1 opacity-70">
                      {Array.from({ length: 44 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-0.5 rounded-full bg-white/50"
                          style={{ height: `${18 + ((i * 17) % 22)}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() =>
                        activeProject &&
                        activeDelivery &&
                        void updateDelivery.mutateAsync({
                          deliveryId: activeDelivery.id,
                          projectId: activeProject.id,
                          status: "changes_requested",
                        })
                      }
                      disabled={!activeDelivery || updateDelivery.isPending}
                      variant="outline"
                      className="border-white/10 text-white hover:bg-white/10"
                    >
                      Request changes
                    </Button>
                    <Button
                      onClick={() =>
                        activeProject &&
                        activeDelivery &&
                        void updateDelivery.mutateAsync({
                          deliveryId: activeDelivery.id,
                          projectId: activeProject.id,
                          status: "approved",
                        })
                      }
                      disabled={!activeDelivery || updateDelivery.isPending}
                      className="bg-[#b8ff45] text-black hover:bg-[#d1ff80]"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve stem
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle>Feedback timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeDelivery ? (
                  (
                    (detail.data?.deliveryComments?.[activeDelivery.id] ??
                      []) as Array<{
                      id: number;
                      body: string;
                      timestampMs: number | null;
                      createdAt: Date;
                    }>
                  ).map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-[#b8ff45]" />
                      <div>
                        <div className="text-sm text-white/75">
                          {comment.body}
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-white/30">
                          {comment.timestampMs !== null
                            ? `${Math.floor(comment.timestampMs / 60000)}:${String(Math.floor((comment.timestampMs % 60000) / 1000)).padStart(2, "0")}`
                            : "—"}{" "}
                          · {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-white/35">
                    No delivery comments yet.
                  </div>
                )}
                <Textarea
                  value={commentDraft}
                  onChange={event => setCommentDraft(event.target.value)}
                  placeholder="Add a timestamped note…"
                  className="min-h-24 border-white/10 bg-black/20 text-white placeholder:text-white/25"
                />
                <Button
                  onClick={() =>
                    activeDelivery &&
                    commentDraft.trim() &&
                    void addComment.mutateAsync({
                      deliveryId: activeDelivery.id,
                      body: commentDraft,
                      timestampMs: 0,
                    })
                  }
                  disabled={
                    !activeDelivery ||
                    !commentDraft.trim() ||
                    addComment.isPending
                  }
                  variant="outline"
                  className="w-full border-white/10 text-white"
                >
                  Post timestamped note
                </Button>
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AudioLines className="h-4 w-4 text-[#b8ff45]" />
                  Project evidence
                </CardTitle>
                <p className="text-xs text-white/35">
                  Stems, deliveries and loudness history for the active project.
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {detail.data?.stems?.length ? (
                  detail.data.stems.map(stem => (
                    <div key={stem.id} className="rounded-lg bg-black/20 p-3">
                      <div className="font-semibold">{stem.name}</div>
                      <div className="mt-1 font-mono text-[10px] text-[#b8ff45]">
                        {stem.versionLabel} · {stem.status}
                      </div>
                      <div className="mt-2 text-[10px] text-white/30">
                        {stem.sha256
                          ? `SHA ${stem.sha256.slice(0, 12)}…`
                          : "Hash pending"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-white/35">
                    No stem versions in the active project yet.
                  </div>
                )}
                {detail.data?.metrics?.map(metric => (
                  <div
                    key={metric.id}
                    className="rounded-lg bg-[#b8ff45]/[0.06] p-3"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                      Loudness snapshot
                    </div>
                    <div className="mt-2 text-lg font-bold text-[#b8ff45]">
                      {metric.lufs ?? "—"} LUFS
                    </div>
                    <div className="mt-1 text-xs text-white/45">
                      True peak {metric.truePeak ?? "—"} · DR{" "}
                      {metric.dynamicRange ?? "—"}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="assistant"
            className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"
          >
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-[#b8ff45]" />
                  Duck Local
                </CardTitle>
                <p className="text-xs text-white/35">
                  Production dialogue with bounded knowledge and local-first
                  intent.
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4 h-80 space-y-3 overflow-y-auto rounded-xl border border-white/[0.07] bg-black/25 p-4">
                  {chat.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-[#b8ff45] text-black" : "bg-white/[0.06] text-white/75"}`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={event => setChatInput(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === "Enter") sendChat();
                    }}
                    placeholder="Ask about the vocal chain…"
                    className="border-white/10 bg-black/20 text-white placeholder:text-white/25"
                  />
                  <Button
                    onClick={() => void sendChat()}
                    disabled={assistantChat.isPending}
                    size="icon"
                    className="bg-[#b8ff45] text-black hover:bg-[#d1ff80]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/[0.08] bg-white/[0.035] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-[#b8ff45]" />
                  Quality gate
                </CardTitle>
                <p className="text-xs text-white/35">
                  Publication is a consequence of evidence, not a shortcut.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {quality.data?.dimensions.map(dimension => (
                  <div
                    key={dimension.key}
                    className="flex items-center justify-between rounded-lg bg-black/20 p-3"
                  >
                    <div>
                      <div className="text-sm">{dimension.label}</div>
                      <div className="mt-1 text-[10px] text-white/30">
                        {dimension.evidence}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-orange-200">
                      {dimension.score}/10
                    </span>
                  </div>
                ))}
                <Button
                  disabled
                  className="mt-3 w-full bg-[#b8ff45] text-black"
                >
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Publish private repo (locked)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
