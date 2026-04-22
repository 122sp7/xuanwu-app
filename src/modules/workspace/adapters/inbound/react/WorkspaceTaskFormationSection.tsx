"use client";

/**
 * WorkspaceTaskFormationSection — workspace.task-formation tab.
 *
 * Task formation keeps only source references in URL/query state, then resolves
 * concrete page/database context through the notion public boundary before
 * sending the source to the extractor.
 *
 * See docs/structure/system/source-to-task-flow.md for the "Notion-like local
 * model" boundary behind this handoff.
 */

import { Badge, Button } from "@packages";
import {
  ListPlus,
  ArrowRight,
  FileText,
  LayoutGrid,
  BookOpen,
  Upload,
  ChevronRight,
  Info,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import type { DatabaseSnapshot, PageSnapshot } from "@/src/modules/notion";
import {
  listWorkspaceKnowledgeDatabases,
  listWorkspaceKnowledgePages,
} from "@/src/modules/notion";
import { startExtractionAction, confirmCandidatesAction } from "@/src/modules/workspace/subdomains/task-formation/adapters/inbound/server-actions/task-formation-actions";
import type { ExtractedTaskCandidate } from "@/src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskCandidate";

interface WorkspaceTaskFormationSectionProps {
  workspaceId: string;
  accountId: string;
  currentUserId?: string;
}

type SelectedSourceKind = "page" | "database" | "research" | null;
type Phase = "idle" | "extracting" | "reviewing" | "confirming" | "done" | "error";

type ConcreteSource = {
  readonly id: string;
  readonly kind: Exclude<SelectedSourceKind, null>;
  readonly title: string;
  readonly description: string;
  readonly sourceText?: string;
};

const PIPELINE_STAGES = [
  { label: "需求收集", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { label: "評估分析", color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
  { label: "任務拆解", color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
  { label: "待指派", color: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" },
] as const;

function buildPageSource(page: PageSnapshot): ConcreteSource {
  const persistedSourceText = page.sourceText?.trim();
  const parts = [
    `頁面標題：${page.title}`,
    page.summary ? `摘要：${page.summary}` : undefined,
    page.sourceLabel ? `來源：${page.sourceLabel}` : undefined,
    page.blockIds.length > 0 ? `內容區塊：${page.blockIds.length}` : undefined,
  ].filter((part): part is string => Boolean(part));

  return {
    id: page.id,
    kind: "page",
    title: page.title,
    description: page.summary ?? "尚未提供摘要，將以頁面標題與來源脈絡作為任務形成輸入。",
    sourceText: persistedSourceText && persistedSourceText.length > 0
      ? persistedSourceText
      : parts.join("\n"),
  };
}

function buildDatabaseSource(database: DatabaseSnapshot, pages: ReadonlyArray<PageSnapshot>): ConcreteSource {
  const persistedSourceText = database.sourceText?.trim();
  const parentPage = database.parentPageId
    ? pages.find((page) => page.id === database.parentPageId)
    : null;
  const parts = [
    `資料庫名稱：${database.title}`,
    database.description ? `描述：${database.description}` : undefined,
    `Parent page：${parentPage?.title ?? "workspace 根目錄"}`,
    `欄位：${database.properties.map((property) => `${property.name}(${property.type})`).join(", ")}`,
  ].filter((part): part is string => Boolean(part));

  return {
    id: database.id,
    kind: "database",
    title: database.title,
    description: database.description ?? `共有 ${database.properties.length} 個欄位可供任務形成使用。`,
    sourceText: persistedSourceText && persistedSourceText.length > 0
      ? persistedSourceText
      : parts.join("\n"),
  };
}

export function WorkspaceTaskFormationSection({
  workspaceId,
  accountId,
  currentUserId,
}: WorkspaceTaskFormationSectionProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSourceOverride, setSelectedSourceOverride] = useState<SelectedSourceKind>(null);
  const [selectedReferenceIdOverride, setSelectedReferenceIdOverride] = useState<string | null>(null);
  const [pages, setPages] = useState<PageSnapshot[]>([]);
  const [databases, setDatabases] = useState<DatabaseSnapshot[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [candidates, setCandidates] = useState<ExtractedTaskCandidate[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;
  const querySelectedSource = searchParams.get("sourceKind");
  const querySelectedReferenceId = searchParams.get("sourceId");
  const selectedSource = selectedSourceOverride
    ?? (querySelectedSource === "page" || querySelectedSource === "database" || querySelectedSource === "research"
      ? querySelectedSource
      : null);
  const selectedReferenceId = selectedReferenceIdOverride ?? querySelectedReferenceId;

  useEffect(() => {
    let mounted = true;
    void Promise.all([
      listWorkspaceKnowledgePages({ accountId, workspaceId }),
      listWorkspaceKnowledgeDatabases(workspaceId),
    ])
      .then(([pageResult, databaseResult]) => {
        if (!mounted) return;
        setPages([...pageResult]);
        setDatabases([...databaseResult]);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : "無法載入任務來源。");
      });
    return () => {
      mounted = false;
    };
  }, [accountId, workspaceId]);

  const pageSources = useMemo(() => pages.map(buildPageSource), [pages]);
  const databaseSources = useMemo(
    () => databases.map((database) => buildDatabaseSource(database, pages)),
    [databases, pages],
  );

  const availableConcreteSources = useMemo(
    () => (selectedSource === "page"
      ? pageSources
      : selectedSource === "database"
        ? databaseSources
        : []),
    [databaseSources, pageSources, selectedSource],
  );

  const selectedConcreteSource = useMemo(
    () => availableConcreteSources.find((source) => source.id === selectedReferenceId) ?? null,
    [availableConcreteSources, selectedReferenceId],
  );

  const sources = [
    {
      id: "page" as SelectedSourceKind,
      label: "知識頁面",
      description: `從 workspace 知識頁面萃取任務（目前 ${pages.length} 項）`,
      icon: <FileText className="size-4 text-blue-500" />,
      href: `${base}?tab=Pages`,
      color: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
      activeColor: "border-blue-500/60 bg-blue-500/15",
    },
    {
      id: "database" as SelectedSourceKind,
      label: "資料庫",
      description: `從結構化知識資料庫萃取任務（目前 ${databases.length} 項）`,
      icon: <LayoutGrid className="size-4 text-purple-500" />,
      href: `${base}?tab=Database`,
      color: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10",
      activeColor: "border-purple-500/60 bg-purple-500/15",
    },
    {
      id: "research" as SelectedSourceKind,
      label: "AI 研究摘要",
      description: "從 notebooklm.research 的 AI 合成結論萃取任務",
      icon: <BookOpen className="size-4 text-emerald-500" />,
      href: `${base}?tab=Research`,
      color: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
      activeColor: "border-emerald-500/60 bg-emerald-500/15",
    },
  ] as const;

  function toggleCandidate(i: number) {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSelectSource(nextSource: SelectedSourceKind) {
    if (selectedSource === nextSource) {
      router.replace(`${base}?tab=TaskFormation`, { scroll: false });
      setSelectedSourceOverride(null);
      setSelectedReferenceIdOverride(null);
      return;
    }
    setSelectedSourceOverride(nextSource);
    setSelectedReferenceIdOverride(null);
  }

  function handleExtract() {
    if (!selectedSource || !currentUserId) return;
    if ((selectedSource === "page" || selectedSource === "database") && !selectedConcreteSource) return;
    setPhase("extracting");
    setErrorMessage(null);
    startTransition(async () => {
      const sourceIds = selectedConcreteSource ? [selectedConcreteSource.id] : [selectedSource];
      const result = await startExtractionAction({
        workspaceId,
        actorId: currentUserId,
        sourceType: "ai",
        sourcePageIds: sourceIds,
        sourceText: selectedConcreteSource?.sourceText,
      });
      if (!result.success) {
        setErrorMessage(result.error.message);
        setPhase("error");
        return;
      }
      setJobId(result.aggregateId);
      const extractedCandidates = (result as { candidates?: ReadonlyArray<ExtractedTaskCandidate> }).candidates ?? [];
      setCandidates([...extractedCandidates]);
      setSelectedIndices(new Set(extractedCandidates.map((_, i) => i)));
      setPhase("reviewing");
    });
  }

  function handleConfirm() {
    if (!jobId || !currentUserId || selectedIndices.size === 0) return;
    setPhase("confirming");
    startTransition(async () => {
      const result = await confirmCandidatesAction({
        jobId,
        workspaceId,
        actorId: currentUserId,
        selectedIndices: [...selectedIndices],
      });
      if (!result.success) {
        setErrorMessage(result.error.message);
        setPhase("reviewing");
        return;
      }
      setConfirmedCount(selectedIndices.size);
      setPhase("done");
    });
  }

  function handleReset() {
    router.replace(`${base}?tab=TaskFormation`, { scroll: false });
    setPhase("idle");
    setSelectedSourceOverride(null);
    setSelectedReferenceIdOverride(null);
    setCandidates([]);
    setSelectedIndices(new Set());
    setJobId(null);
    setErrorMessage(null);
    setConfirmedCount(0);
  }

  const extractDisabled = !currentUserId
    || !selectedSource
    || ((selectedSource === "page" || selectedSource === "database") && !selectedConcreteSource);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">任務形成</h2>
        </div>
        {phase === "idle" && (
          <Button size="sm" variant="outline" disabled={extractDisabled} onClick={handleExtract}>
            <ListPlus className="size-3.5" />
            從選定來源生成任務
          </Button>
        )}
        {(phase === "reviewing" || phase === "error") && (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RefreshCw className="size-3.5" />
            重新選擇
          </Button>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div className="space-y-1 text-xs text-amber-700/90">
          <p className="font-medium">資料閉環說明</p>
          <p>
            任務由知識來源驅動：先上傳文件（
            <Link href={`${base}?tab=Sources`} className="underline underline-offset-2 hover:text-amber-800">
              來源文件
            </Link>
            ）→ AI 解析建立知識（
            <Link href={`${base}?tab=Pages`} className="underline underline-offset-2 hover:text-amber-800">
              頁面
            </Link>
            /
            <Link href={`${base}?tab=Database`} className="underline underline-offset-2 hover:text-amber-800">
              資料庫
            </Link>
            ）→ 執行 AI 研究合成（
            <Link href={`${base}?tab=Research`} className="underline underline-offset-2 hover:text-amber-800">
              研究摘要
            </Link>
            ）→ 在此選定具體來源 reference 並生成任務候選。
          </p>
        </div>
      </div>

      {phase === "idle" && (
        <>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">選擇任務來源</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {sources.map((source) => {
                const isSelected = selectedSource === source.id;
                return (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => handleSelectSource(source.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      isSelected ? source.activeColor : source.color
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {source.icon}
                        <span className="text-sm font-medium">{source.label}</span>
                      </div>
                      {isSelected && <Badge variant="outline" className="text-xs">已選</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{source.description}</p>
                    <Link
                      href={source.href}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      前往查看 <ChevronRight className="size-3" />
                    </Link>
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedSource === "page" || selectedSource === "database") && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">選定具體來源</p>
              {availableConcreteSources.length === 0 ? (
                <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-4 text-sm text-muted-foreground">
                  目前沒有可用的{selectedSource === "page" ? "頁面" : "資料庫"}，請先建立來源後再回來。
                </div>
              ) : (
                <div className="space-y-2">
                  {availableConcreteSources.map((source) => {
                    const isActive = selectedReferenceId === source.id;
                    return (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => setSelectedReferenceIdOverride(source.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          isActive
                            ? "border-primary/40 bg-primary/5"
                            : "border-border/40 bg-card/30 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{source.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{source.description}</p>
                          </div>
                          {isActive && <Badge variant="outline" className="text-xs">已選</Badge>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedSource ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-6 text-center">
              <ListPlus className="mx-auto mb-3 size-8 text-primary/50" />
              <p className="text-sm font-medium">
                {selectedConcreteSource
                  ? `從「${selectedConcreteSource.title}」生成任務候選`
                  : `從「${sources.find((source) => source.id === selectedSource)?.label}」生成任務候選`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {selectedConcreteSource
                  ? "AI 將讀取此來源的摘要、描述或 schema，萃取可執行任務並等待你確認。"
                  : "若選的是頁面或資料庫，請先指定具體來源後再開始。"}
              </p>
              {!currentUserId && (
                <p className="mt-2 text-xs text-destructive/70">需要登入帳號才能執行 AI 萃取。</p>
              )}
              <Button size="sm" className="mt-3" onClick={handleExtract} disabled={extractDisabled}>
                <ListPlus className="size-3.5" />
                生成任務候選
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-6 text-center">
              <Upload className="mx-auto mb-3 size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">請先選定一個知識來源</p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                從上方選擇「知識頁面」、「資料庫」或「AI 研究摘要」作為任務生成的依據。
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Link href={`${base}?tab=Sources`} className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 hover:bg-muted">
                  <Upload className="size-3" /> 上傳來源文件
                </Link>
                <Link href={`${base}?tab=Research`} className="inline-flex items-center gap-1 rounded-md border border-border/60 px-2.5 py-1 hover:bg-muted">
                  <BookOpen className="size-3" /> 執行研究合成
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {phase === "extracting" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-8 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary/60" />
          <p className="text-sm font-medium">AI 正在萃取任務候選…</p>
          <p className="mt-1 text-xs text-muted-foreground/70">正在讀取知識來源並分析可執行任務，請稍候。</p>
        </div>
      )}

      {phase === "reviewing" && (
        <div className="space-y-3">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {errorMessage}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              AI 萃取結果 — {candidates.length} 個候選任務（已選 {selectedIndices.size}）
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedIndices(new Set(candidates.map((_, i) => i)))}>
                全選
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedIndices(new Set())}>
                全取消
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {candidates.map((candidate, index) => (
              <button
                key={`${jobId ?? "task-formation"}-${index}`}
                type="button"
                onClick={() => toggleCandidate(index)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedIndices.has(index)
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/40 bg-card/30 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition ${selectedIndices.has(index) ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                    {selectedIndices.has(index) && <Check className="size-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{candidate.title}</p>
                    {candidate.description && <p className="mt-1 text-xs text-muted-foreground">{candidate.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.dueDate && (
                        <Badge variant="outline" className="text-xs">截止 {candidate.dueDate}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        信心度 {Math.round(candidate.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            size="sm"
            disabled={selectedIndices.size === 0 || isPending}
            onClick={handleConfirm}
          >
            {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
            確認建立 {selectedIndices.size} 個任務
          </Button>
        </div>
      )}

      {phase === "confirming" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-8 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary/60" />
          <p className="text-sm font-medium">正在建立任務…</p>
        </div>
      )}

      {phase === "done" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-6 text-center">
            <Check className="mx-auto mb-3 size-8 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700">已成功建立 {confirmedCount} 個任務</p>
            <p className="mt-1 text-xs text-muted-foreground/70">任務已加入此工作區的任務列表。</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RefreshCw className="size-3.5" /> 再次萃取
              </Button>
              <Link href={`${base}?tab=Tasks`}>
                <Button size="sm">
                  查看任務列表
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-6 text-center">
          <AlertCircle className="mx-auto mb-3 size-8 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">萃取失敗</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{errorMessage ?? "請稍後再試。"}</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={handleReset}>
            <RefreshCw className="size-3.5" /> 重試
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">任務形成管道</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
          {PIPELINE_STAGES.map((stage, index) => (
            <div key={stage.label} className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-stretch">
              <div className={`flex items-center justify-between rounded-xl border px-3 py-3 sm:flex-col sm:items-start sm:gap-2 ${stage.color}`}>
                <p className="text-xs font-medium">{stage.label}</p>
                <Badge variant="outline" className="border-inherit text-xs">0</Badge>
              </div>
              {index < PIPELINE_STAGES.length - 1 && (
                <ArrowRight className="size-3.5 shrink-0 rotate-90 text-muted-foreground/40 sm:rotate-0 sm:self-center" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  ) as React.ReactElement;
}
