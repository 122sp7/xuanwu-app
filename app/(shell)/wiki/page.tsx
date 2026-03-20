"use client";

/**
 * Module: wiki page
 * Purpose: enterprise knowledge hub — organisation knowledge, workspace knowledge,
 *   wiki pages, and RAG search entry point.
 * Responsibilities: render knowledge-navigation sidebar, document health cards,
 *   per-workspace document list, and RAG query search UI.
 * Constraints: RAG search is stubbed until the Genkit flow is wired; all data
 *   fetching uses existing module queries (no new network calls introduced).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  BookOpenIcon,
  Building2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  FilePlusIcon,
  FolderIcon,
  HomeIcon,
  Loader2Icon,
  LockIcon,
  RefreshCwIcon,
  SearchIcon,
  Share2Icon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";

import { useApp } from "@/app/providers/app-provider";
import { isOrganizationAccount } from "@/app/(shell)/organization/_utils";
import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspacesForAccount } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import type { WorkspaceKnowledgeSummary } from "@/modules/knowledge";
import { getWorkspaceKnowledgeSummary } from "@/modules/knowledge";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import { Input } from "@/ui/shadcn/ui/input";
import { Progress } from "@/ui/shadcn/ui/progress";
import { ScrollArea } from "@/ui/shadcn/ui/scroll-area";
import { Separator } from "@/ui/shadcn/ui/separator";
import { Skeleton } from "@/ui/shadcn/ui/skeleton";

// ── Types ───────────────────────────────────────────────────────────────────

interface WorkspaceEntry {
  readonly workspace: WorkspaceEntity;
  readonly summary: WorkspaceKnowledgeSummary;
  readonly docs: readonly RagDocumentRecord[];
}

type MainView = "hub" | "workspace";

// ── Constants ────────────────────────────────────────────────────────────────

const RAG_STATUS_VARIANT: Record<
  RagDocumentRecord["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  uploaded: "outline",
  processing: "secondary",
  ready: "default",
  failed: "destructive",
  archived: "outline",
};

const RAG_STATUS_LABEL: Record<RagDocumentRecord["status"], string> = {
  uploaded: "已上傳",
  processing: "處理中",
  ready: "已就緒",
  failed: "失敗",
  archived: "已封存",
};

const SUMMARY_STATUS_VARIANT: Record<
  WorkspaceKnowledgeSummary["status"],
  "default" | "secondary" | "outline"
> = {
  "needs-input": "outline",
  staged: "secondary",
  ready: "default",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function mimeLabel(mime: string): string {
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("word") || mime.includes("docx") || mime.includes("doc")) return "DOCX";
  if (mime.includes("html")) return "HTML";
  if (mime.includes("text")) return "TXT";
  if (mime.includes("markdown")) return "MD";
  return mime.split("/").pop()?.toUpperCase() ?? "FILE";
}

// ── Sidebar sub-components ────────────────────────────────────────────────────

interface SidebarSectionProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly count?: number;
  readonly active?: boolean;
  readonly defaultOpen?: boolean;
  readonly onClick?: () => void;
  readonly children?: React.ReactNode;
}

function SidebarSection({
  icon,
  label,
  count,
  active,
  defaultOpen = false,
  onClick,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        className={[
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ")}
        onClick={() => {
          onClick?.();
          if (children) setOpen((o) => !o);
        }}
      >
        {icon}
        <span className="flex-1 truncate text-left">{label}</span>
        {count !== undefined && (
          <Badge variant="secondary" className="h-4 px-1 text-[10px]">
            {count}
          </Badge>
        )}
        {children &&
          (open ? (
            <ChevronDownIcon className="size-3 shrink-0" />
          ) : (
            <ChevronRightIcon className="size-3 shrink-0" />
          ))}
      </button>
      {open && children && <div className="ml-2 mt-0.5 space-y-0.5">{children}</div>}
    </div>
  );
}

interface SidebarLeafProps {
  readonly icon?: React.ReactNode;
  readonly label: string;
  readonly count?: number;
  readonly active?: boolean;
  readonly onClick?: () => void;
}

function SidebarLeaf({ icon, label, count, active, onClick }: SidebarLeafProps) {
  return (
    <button
      type="button"
      className={[
        "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs transition",
        active
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
      onClick={onClick}
    >
      {icon}
      <span className="flex-1 truncate text-left">{label}</span>
      {count !== undefined && (
        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{count}</span>
      )}
    </button>
  );
}

// ── RAG Search bar ────────────────────────────────────────────────────────────

interface RagSearchBarProps {
  readonly organizationId: string | null;
  readonly workspaceId?: string | null;
}

function RagSearchBar({ organizationId, workspaceId }: RagSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query.trim() || !organizationId) return;
    setIsSearching(true);
    setHasResult(false);
    // Stub: replace with Genkit flow invocation when RAG backend is wired.
    setTimeout(() => {
      setIsSearching(false);
      setHasResult(true);
    }, 800);
  }, [query, organizationId]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-9 pl-8 text-sm"
            placeholder="向知識庫提問，例如：特休天數如何計算？"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={handleSearch}
          disabled={!query.trim() || !organizationId || isSearching}
        >
          {isSearching ? <Loader2Icon className="size-3.5 animate-spin" /> : <SearchIcon className="size-3.5" />}
          搜尋
        </Button>
      </div>
      {workspaceId && (
        <p className="text-[11px] text-muted-foreground">
          搜尋範圍：目前工作區文件
          <button
            type="button"
            className="ml-1 text-primary underline-offset-2 hover:underline"
            onClick={() => {}}
          >
            切換至全組織
          </button>
        </p>
      )}
      {hasResult && (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">AI 回答（示範）</p>
          <p className="mt-1">
            🚧 RAG 查詢功能尚在建置中。Genkit Flow 串接完成後，此處將顯示 AI 生成回答與引用來源。
          </p>
          <p className="mt-2 text-[10px]">
            查詢：<span className="font-mono">{query}</span>
            {workspaceId ? ` · 工作區：${workspaceId}` : ` · 組織：${organizationId}`}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Org knowledge KPI row ─────────────────────────────────────────────────────

interface OrgKpiRowProps {
  readonly entries: readonly WorkspaceEntry[];
}

function OrgKpiRow({ entries }: OrgKpiRowProps) {
  const kpis = useMemo(() => {
    let totalDocs = 0;
    let totalReady = 0;
    let readyWorkspaces = 0;
    for (const { summary, docs } of entries) {
      totalDocs += docs.length;
      totalReady += docs.filter((d) => d.status === "ready").length;
      if (summary.status === "ready") readyWorkspaces += 1;
    }
    const readyRatio =
      totalDocs > 0 ? Math.round((totalReady / totalDocs) * 100) : 0;
    return { totalDocs, totalReady, readyWorkspaces, readyRatio, totalWorkspaces: entries.length };
  }, [entries]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "工作區", value: `${kpis.readyWorkspaces} / ${kpis.totalWorkspaces}` },
        { label: "知識文件", value: `${kpis.totalReady} / ${kpis.totalDocs}` },
        { label: "就緒比例", value: `${kpis.readyRatio}%` },
        { label: "總文件數", value: String(kpis.totalDocs) },
      ].map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Workspace health card ─────────────────────────────────────────────────────

interface WorkspaceHealthCardProps {
  readonly entry: WorkspaceEntry;
  readonly onSelectWorkspace: (id: string) => void;
}

function WorkspaceHealthCard({ entry, onSelectWorkspace }: WorkspaceHealthCardProps) {
  const { workspace, summary, docs } = entry;
  const ready = docs.filter((d) => d.status === "ready").length;
  const total = docs.length;
  const ratio = total > 0 ? Math.round((ready / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border/40 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:underline"
              onClick={() => onSelectWorkspace(workspace.id)}
            >
              {workspace.name}
            </button>
            <Badge variant={SUMMARY_STATUS_VARIANT[summary.status]}>{summary.status}</Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{ready} / {total} 份文件就緒</span>
              <span>{ratio}%</span>
            </div>
            <Progress value={ratio} className="h-1.5" />
          </div>
          {summary.blockedReasons.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-amber-600 dark:text-amber-400">
              {summary.blockedReasons.slice(0, 2).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 text-xs"
            onClick={() => onSelectWorkspace(workspace.id)}
          >
            <ChevronRightIcon className="size-3" />
            文件
          </Button>
          <Button asChild variant="outline" size="sm" className="h-6 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              <UploadIcon className="size-3" />
              上傳
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Document row ──────────────────────────────────────────────────────────────

interface DocRowProps {
  readonly doc: RagDocumentRecord;
}

function DocRow({ doc }: DocRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 px-4 py-3 hover:bg-muted/30">
      <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium">{doc.displayName}</span>
          <Badge variant={RAG_STATUS_VARIANT[doc.status]} className="text-[10px]">
            {RAG_STATUS_LABEL[doc.status]}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {mimeLabel(doc.mimeType)}
          </Badge>
          {doc.taxonomy && (
            <Badge variant="secondary" className="text-[10px]">
              {doc.taxonomy}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span>{formatBytes(doc.sizeBytes)}</span>
          {doc.department && <span>{doc.department}</span>}
          {doc.language && <span>{doc.language}</span>}
          <span>v{doc.versionNumber}</span>
          <span>{formatDate(doc.createdAtISO)}</span>
        </div>
        {doc.statusMessage && (
          <p className="text-[11px] text-destructive">{doc.statusMessage}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-1 text-right">
        {doc.chunkCount !== undefined && (
          <span className="text-[10px] text-muted-foreground">{doc.chunkCount} chunks</span>
        )}
      </div>
    </div>
  );
}

// ── Hub view (default) ────────────────────────────────────────────────────────

interface HubViewProps {
  readonly entries: readonly WorkspaceEntry[];
  readonly loadState: "loading" | "loaded" | "error";
  readonly organizationId: string;
  readonly onSelectWorkspace: (id: string) => void;
  readonly onRefresh: () => void;
}

function HubView({ entries, loadState, organizationId, onSelectWorkspace, onRefresh }: HubViewProps) {
  return (
    <div className="space-y-6">
      {/* RAG search */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">知識庫搜尋</CardTitle>
              <CardDescription>向整個組織的企業知識庫提問</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RagSearchBar organizationId={organizationId} />
        </CardContent>
      </Card>

      {/* KPI */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">知識庫總覽</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onRefresh}
            disabled={loadState === "loading"}
          >
            <RefreshCwIcon className="size-3" />
            重新整理
          </Button>
        </div>
        {loadState === "loading" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : (
          <OrgKpiRow entries={entries} />
        )}
      </div>

      {/* Workspace health */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">工作區知識庫狀態</h2>
        {loadState === "loading" && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        )}
        {loadState === "error" && (
          <p className="text-sm text-destructive">無法載入知識摘要，請稍後再試。</p>
        )}
        {loadState === "loaded" && entries.length === 0 && (
          <div className="rounded-xl border border-border/40 px-4 py-8 text-center">
            <Building2Icon className="mx-auto mb-2 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">目前沒有工作區。</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href="/organization/workspaces">建立工作區</Link>
            </Button>
          </div>
        )}
        {loadState === "loaded" &&
          entries.map((entry) => (
            <div key={entry.workspace.id} className="mb-3">
              <WorkspaceHealthCard
                entry={entry}
                onSelectWorkspace={onSelectWorkspace}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

// ── Workspace doc view ────────────────────────────────────────────────────────

interface WorkspaceDocViewProps {
  readonly entry: WorkspaceEntry;
  readonly organizationId: string;
  readonly onBack: () => void;
}

function WorkspaceDocView({ entry, organizationId, onBack }: WorkspaceDocViewProps) {
  const { workspace, docs } = entry;
  const [statusFilter, setStatusFilter] = useState<RagDocumentRecord["status"] | "all">("all");
  const [searchText, setSearchText] = useState("");

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (searchText.trim() && !d.displayName.toLowerCase().includes(searchText.toLowerCase()))
        return false;
      return true;
    });
  }, [docs, statusFilter, searchText]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          ← 返回
        </button>
        <Separator orientation="vertical" className="h-4" />
        <h2 className="text-base font-semibold">{workspace.name}</h2>
        <Badge variant={SUMMARY_STATUS_VARIANT[entry.summary.status]}>{entry.summary.status}</Badge>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              <UploadIcon className="size-3" />
              上傳文件
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Knowledge`}>管理</Link>
          </Button>
        </div>
      </div>

      {/* RAG search scoped to workspace */}
      <RagSearchBar organizationId={organizationId} workspaceId={workspace.id} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "ready", "processing", "uploaded", "failed", "archived"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={[
              "rounded-full border px-3 py-1 text-xs transition",
              statusFilter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            ].join(" ")}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "全部" : RAG_STATUS_LABEL[s]}
          </button>
        ))}
        <div className="relative ml-auto">
          <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-7 w-44 pl-6 text-xs"
            placeholder="搜尋檔案名稱…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      {/* Doc list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/40 px-4 py-8 text-center">
          <FileTextIcon className="mx-auto mb-2 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {docs.length === 0 ? "此工作區尚無知識文件。" : "沒有符合條件的文件。"}
          </p>
          {docs.length === 0 && (
            <Button asChild variant="outline" size="sm" className="mt-3 gap-1.5">
              <Link href={`/workspace/${workspace.id}?tab=Files`}>
                <UploadIcon className="size-3" />
                上傳文件
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">共 {filtered.length} 筆</p>
          {filtered.map((doc) => (
            <DocRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WikiPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;

  const organizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [entries, setEntries] = useState<readonly WorkspaceEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [mainView, setMainView] = useState<MainView>("hub");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  // ── Data loading ───────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!organizationId) {
      setEntries([]);
      setLoadState("loaded");
      return;
    }
    setLoadState("loading");
    try {
      const workspaces: WorkspaceEntity[] = await getWorkspacesForAccount(organizationId);
      const results: WorkspaceEntry[] = await Promise.all(
        workspaces.map(async (workspace) => {
          const [summary, docs] = await Promise.all([
            getWorkspaceKnowledgeSummary(workspace).catch(() => ({
              registeredAssetCount: 0,
              readyAssetCount: 0,
              supportedSourceCount: 0,
              status: "needs-input" as const,
              blockedReasons: ["摘要載入失敗"],
              nextActions: [],
              visibleSurface: "workspace-tab-live" as const,
              contractStatus: "contract-live" as const,
            })),
            getWorkspaceRagDocuments(workspace).catch(() => [] as readonly RagDocumentRecord[]),
          ]);
          return { workspace, summary, docs };
        }),
      );
      setEntries(results);
      setLoadState("loaded");
    } catch {
      setEntries([]);
      setLoadState("error");
    }
  }, [organizationId]);

  useEffect(() => {
    void load();
  }, [load]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedEntry = useMemo(
    () => entries.find((e) => e.workspace.id === selectedWorkspaceId) ?? null,
    [entries, selectedWorkspaceId],
  );

  const handleSelectWorkspace = useCallback((id: string) => {
    setSelectedWorkspaceId(id);
    setMainView("workspace");
  }, []);

  const handleBackToHub = useCallback(() => {
    setMainView("hub");
    setSelectedWorkspaceId(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full min-h-0 gap-0">
      {/* ── Left: knowledge navigation sidebar ── */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-border/50 bg-background/50">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-1.5">
            <BookOpenIcon className="size-4 text-primary" />
            <span className="text-sm font-semibold">Wiki</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
            <button
              type="button"
              onClick={() => {}}
              aria-label="新增頁面"
              title="新增頁面"
            >
              <FilePlusIcon className="size-3.5" />
            </button>
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <nav className="space-y-0.5 px-2 pb-4" aria-label="知識庫導覽">
            {/* 首頁 */}
            <SidebarLeaf
              icon={<HomeIcon className="size-3.5 shrink-0" />}
              label="首頁"
              active={mainView === "hub" && !selectedWorkspaceId}
              onClick={handleBackToHub}
            />

            <div className="py-1.5">
              <Separator />
            </div>

            {/* ── 知識庫 ── */}
            <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              知識庫
            </p>

            {/* 組織知識庫 */}
            <SidebarSection
              icon={<Building2Icon className="size-3.5 shrink-0" />}
              label="組織知識庫"
              count={entries.reduce((n, e) => n + e.docs.length, 0)}
              active={mainView === "hub"}
              defaultOpen
              onClick={handleBackToHub}
            >
              {loadState === "loading" && (
                <div className="space-y-1 pl-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              )}
              {loadState === "loaded" && entries.length === 0 && (
                <p className="pl-2 text-[10px] text-muted-foreground">無工作區</p>
              )}
            </SidebarSection>

            {/* 工作區知識 */}
            <SidebarSection
              icon={<FolderIcon className="size-3.5 shrink-0" />}
              label="工作區知識"
              defaultOpen
            >
              {loadState === "loading" && (
                <div className="space-y-1 pl-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 rounded" />
                  ))}
                </div>
              )}
              {loadState === "loaded" &&
                entries.map((entry) => (
                  <SidebarLeaf
                    key={entry.workspace.id}
                    icon={
                      <span
                        className={[
                          "inline-block size-1.5 shrink-0 rounded-full",
                          entry.summary.status === "ready"
                            ? "bg-green-500"
                            : entry.summary.status === "staged"
                              ? "bg-amber-400"
                              : "bg-muted-foreground/40",
                        ].join(" ")}
                      />
                    }
                    label={entry.workspace.name}
                    count={entry.docs.length}
                    active={selectedWorkspaceId === entry.workspace.id}
                    onClick={() => handleSelectWorkspace(entry.workspace.id)}
                  />
                ))}
              {loadState === "loaded" && entries.length === 0 && (
                <p className="pl-2 text-[10px] text-muted-foreground">無工作區</p>
              )}
            </SidebarSection>

            <div className="py-1.5">
              <Separator />
            </div>

            {/* ── 頁面 ── */}
            <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              頁面
            </p>

            <SidebarLeaf
              icon={<Share2Icon className="size-3.5 shrink-0" />}
              label="共用頁面"
              count={0}
            />
            <SidebarLeaf
              icon={<LockIcon className="size-3.5 shrink-0" />}
              label="私人頁面"
              count={0}
            />

            <div className="py-1.5">
              <Separator />
            </div>

            <SidebarLeaf
              icon={<ArchiveIcon className="size-3.5 shrink-0" />}
              label="封存"
              count={0}
            />
          </nav>
        </ScrollArea>

        {/* Sidebar footer */}
        {!organizationId && (
          <div className="border-t border-border/50 px-3 py-2">
            <p className="text-[10px] text-muted-foreground">請切換至組織帳戶以查看知識庫。</p>
          </div>
        )}
      </aside>

      {/* ── Right: main content ── */}
      <main className="min-w-0 flex-1 overflow-auto">
        <div className="px-6 py-5">
          {mainView === "hub" || !selectedEntry ? (
            <HubView
              entries={entries}
              loadState={loadState}
              organizationId={organizationId ?? ""}
              onSelectWorkspace={handleSelectWorkspace}
              onRefresh={() => void load()}
            />
          ) : (
            <WorkspaceDocView
              entry={selectedEntry}
              organizationId={organizationId ?? ""}
              onBack={handleBackToHub}
            />
          )}
        </div>
      </main>
    </div>
  );
}
