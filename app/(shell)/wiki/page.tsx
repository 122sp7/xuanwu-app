"use client";

/**
 * Module: wiki page
 * Purpose: enterprise knowledge hub — organisation knowledge, workspace knowledge,
 *   wiki pages, and RAG search entry point.
 * Responsibilities: tab navigation (知識中樞/Wiki頁面/封存), knowledge health cards,
 *   per-workspace document list, taxonomy browse, RAG search UI, wiki page view.
 * Constraints: RAG search is stubbed until the Genkit flow is wired; wiki page
 *   mutations use Server Actions from modules/wiki.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  Building2Icon,
  ChevronRightIcon,
  FileTextIcon,
  Loader2Icon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useApp } from "@/app/providers/app-provider";
import { isOrganizationAccount } from "@/app/(shell)/organization/_utils";
import type { WorkspaceEntity } from "@/modules/workspace";
import { getWorkspacesForAccount } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import type { WorkspaceKnowledgeSummary } from "@/modules/knowledge";
import { getWorkspaceKnowledgeSummary } from "@/modules/knowledge";
import type { WikiPage as WikiPageEntity, WikiPageScope } from "@/modules/wiki";
import {
  WikiPageCard,
  CreateWikiPageDialog,
  getOrgWikiPages,
  getArchivedWikiPages,
} from "@/modules/wiki";
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
import { Separator } from "@/ui/shadcn/ui/separator";
import { Skeleton } from "@/ui/shadcn/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/ui/select";

// ── Types ────────────────────────────────────────────────────────────────────

interface WorkspaceEntry {
  readonly workspace: WorkspaceEntity;
  readonly summary: WorkspaceKnowledgeSummary;
  readonly docs: readonly RagDocumentRecord[];
}

type MainView = "hub" | "workspace" | "pages" | "archived" | "page-detail";

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

const TAXONOMY_TILES = [
  { key: "規章制度", className: "bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/40" },
  { key: "技術文件", className: "bg-purple-50 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-800/40" },
  { key: "產品手冊", className: "bg-green-50 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40" },
  { key: "流程指引", className: "bg-orange-50 dark:bg-orange-950/30 border-orange-200/60 dark:border-orange-800/40" },
  { key: "教育訓練", className: "bg-pink-50 dark:bg-pink-950/30 border-pink-200/60 dark:border-pink-800/40" },
  { key: "其他", className: "bg-muted/40 border-border/60" },
] as const;

const SCOPE_LABEL: Record<WikiPageScope, string> = {
  organization: "組織共用",
  workspace: "工作區",
  private: "私人",
};

const SCOPE_EMOJI: Record<WikiPageScope, string> = {
  organization: "🏢",
  workspace: "🗂️",
  private: "🔒",
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
          {isSearching ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <SearchIcon className="size-3.5" />
          )}
          搜尋
        </Button>
      </div>
      {workspaceId && (
        <p className="text-[11px] text-muted-foreground">搜尋範圍：目前工作區文件</p>
      )}
      {hasResult && (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">AI 回答（示範）</p>
          <p className="mt-1">
            🚧 RAG 查詢功能尚在建置中。Genkit Flow 串接完成後，此處將顯示 AI 生成回答與引用來源。
          </p>
          <p className="mt-2 font-mono text-[10px]">{query}</p>
        </div>
      )}
    </div>
  );
}

// ── Org KPI row ───────────────────────────────────────────────────────────────

interface OrgKpiRowProps {
  readonly entries: readonly WorkspaceEntry[];
}

function OrgKpiRow({ entries }: OrgKpiRowProps) {
  const totalDocs = entries.reduce((s, e) => s + e.summary.registeredAssetCount, 0);
  const readyDocs = entries.reduce((s, e) => s + e.summary.readyAssetCount, 0);
  const processingDocs = entries.reduce(
    (s, e) => s + e.docs.filter((d) => d.status === "processing").length,
    0,
  );
  const failedDocs = entries.reduce(
    (s, e) => s + e.docs.filter((d) => d.status === "failed").length,
    0,
  );

  const kpis = [
    { label: "文件總數", value: `${totalDocs} 份` },
    { label: "已就緒", value: `${readyDocs} 份` },
    { label: "處理中", value: `${processingDocs} 份` },
    { label: "失敗", value: `${failedDocs} 份` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-xl border border-border/40 px-4 py-3">
          <p className="text-[11px] text-muted-foreground">{k.label}</p>
          <p className="mt-1 text-lg font-semibold">{k.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Taxonomy browse ───────────────────────────────────────────────────────────

interface TaxonomyBrowseProps {
  readonly entries: readonly WorkspaceEntry[];
}

function TaxonomyBrowse({ entries }: TaxonomyBrowseProps) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of entries) {
      for (const doc of entry.docs) {
        const cat = doc.taxonomy ?? "其他";
        map[cat] = (map[cat] ?? 0) + 1;
      }
    }
    return map;
  }, [entries]);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">分類瀏覽</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {TAXONOMY_TILES.map((tile) => (
          <div
            key={tile.key}
            className={`rounded-xl border px-3 py-3 text-center ${tile.className}`}
          >
            <p className="text-xs font-medium">{tile.key}</p>
            <p className="mt-1 text-lg font-semibold">{counts[tile.key] ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">份</p>
          </div>
        ))}
      </div>
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
              <span>
                {ready} / {total} 份文件就緒
              </span>
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
      {doc.chunkCount !== undefined && (
        <span className="shrink-0 text-[10px] text-muted-foreground">{doc.chunkCount} chunks</span>
      )}
    </div>
  );
}

// ── Hub view ──────────────────────────────────────────────────────────────────

interface HubViewProps {
  readonly entries: readonly WorkspaceEntry[];
  readonly loadState: "loading" | "loaded" | "error";
  readonly organizationId: string;
  readonly onSelectWorkspace: (id: string) => void;
  readonly onRefresh: () => void;
}

function HubView({
  entries,
  loadState,
  organizationId,
  onSelectWorkspace,
  onRefresh,
}: HubViewProps) {
  return (
    <div className="space-y-6">
      {/* RAG search */}
      <Card className="border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">知識庫搜尋</CardTitle>
          <CardDescription>向整個組織的企業知識庫提問</CardDescription>
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

      {/* Taxonomy browse */}
      {loadState === "loaded" && entries.length > 0 && (
        <TaxonomyBrowse entries={entries} />
      )}

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
              <WorkspaceHealthCard entry={entry} onSelectWorkspace={onSelectWorkspace} />
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

  const filtered = useMemo(
    () =>
      docs.filter((d) => {
        if (statusFilter !== "all" && d.status !== statusFilter) return false;
        if (
          searchText.trim() &&
          !d.displayName.toLowerCase().includes(searchText.toLowerCase())
        )
          return false;
        return true;
      }),
    [docs, statusFilter, searchText],
  );

  return (
    <div className="space-y-5">
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
        <Badge variant={SUMMARY_STATUS_VARIANT[entry.summary.status]}>
          {entry.summary.status}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline" size="sm" className="h-7 gap-1 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Files`}>
              <UploadIcon className="size-3" />
              上傳文件
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
            <Link href={`/workspace/${workspace.id}?tab=Wiki`}>管理</Link>
          </Button>
        </div>
      </div>

      <RagSearchBar organizationId={organizationId} workspaceId={workspace.id} />

      {/* Status filter pills */}
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

// ── Wiki pages list view ──────────────────────────────────────────────────────

interface WikiPagesListViewProps {
  readonly organizationId: string;
  readonly pages: readonly WikiPageEntity[];
  readonly pagesLoadState: "loading" | "loaded" | "error";
  readonly scopeFilter: WikiPageScope | "all";
  readonly onScopeChange: (v: WikiPageScope | "all") => void;
  readonly onSelectPage: (page: WikiPageEntity) => void;
  readonly onCreated: () => void;
}

function WikiPagesListView({
  organizationId,
  pages,
  pagesLoadState,
  scopeFilter,
  onScopeChange,
  onSelectPage,
  onCreated,
}: WikiPagesListViewProps) {
  const filtered = useMemo(
    () => pages.filter((p) => scopeFilter === "all" || p.scope === scopeFilter),
    [pages, scopeFilter],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Wiki 頁面</h2>
        <div className="flex items-center gap-2">
          <Select
            value={scopeFilter}
            onValueChange={(v) => onScopeChange(v as WikiPageScope | "all")}
          >
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部範圍</SelectItem>
              <SelectItem value="organization">組織共用</SelectItem>
              <SelectItem value="workspace">工作區</SelectItem>
              <SelectItem value="private">私人</SelectItem>
            </SelectContent>
          </Select>
          <CreateWikiPageDialog organizationId={organizationId} onCreated={onCreated} />
        </div>
      </div>

      {pagesLoadState === "loading" && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}

      {pagesLoadState === "error" && (
        <p className="text-sm text-destructive">無法載入 Wiki 頁面，請稍後再試。</p>
      )}

      {pagesLoadState === "loaded" && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <FileTextIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {pages.length === 0
              ? "尚無 Wiki 頁面。建立第一個頁面開始協作 →"
              : "沒有符合篩選條件的頁面。"}
          </p>
          {pages.length === 0 && (
            <div className="mt-3">
              <CreateWikiPageDialog
                organizationId={organizationId}
                onCreated={onCreated}
                trigger={
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <PlusIcon className="size-3.5" />
                    建立第一個頁面
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}

      {pagesLoadState === "loaded" && filtered.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">共 {filtered.length} 個頁面</p>
          {filtered.map((page) => (
            <WikiPageCard key={page.pageId} page={page} onClick={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Archived view ─────────────────────────────────────────────────────────────

interface ArchivedViewProps {
  readonly archivedPages: readonly WikiPageEntity[];
  readonly loadState: "loading" | "loaded" | "error";
  readonly onSelectPage: (page: WikiPageEntity) => void;
}

function ArchivedView({ archivedPages, loadState, onSelectPage }: ArchivedViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">封存</h2>
      {loadState === "loading" && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}
      {loadState === "loaded" && archivedPages.length === 0 && (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <ArchiveIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">沒有封存的頁面或文件。</p>
        </div>
      )}
      {loadState === "loaded" && archivedPages.length > 0 && (
        <div className="space-y-2">
          {archivedPages.map((page) => (
            <WikiPageCard key={page.pageId} page={page} onClick={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Wiki page detail (inline) ─────────────────────────────────────────────────

interface WikiPageDetailViewProps {
  readonly page: WikiPageEntity;
  readonly workspaceName?: string;
  readonly onBack: () => void;
}

function WikiPageDetailView({ page, workspaceName, onBack }: WikiPageDetailViewProps) {
  const scopeLabel =
    page.scope === "workspace" && workspaceName
      ? `工作區：${workspaceName}`
      : SCOPE_LABEL[page.scope];

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={onBack}
          aria-label="返回"
        >
          ← 返回
        </button>
        <Separator orientation="vertical" className="h-5" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold">{page.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              {SCOPE_EMOJI[page.scope]} {scopeLabel}
            </span>
            <span>·</span>
            <span>建立者：{page.createdBy}</span>
          </div>
        </div>
      </div>

      <Separator />

      {page.content.trim() ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border/60 py-12 text-center">
          <p className="text-sm text-muted-foreground">此頁面尚無內容。</p>
        </div>
      )}

      <Separator />

      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span>建立：{new Date(page.createdAtISO).toLocaleDateString("zh-TW")}</span>
        <span>最後更新：{new Date(page.updatedAtISO).toLocaleDateString("zh-TW")}</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WikiPage() {
  const { state: appState } = useApp();
  const { activeAccount } = appState;
  const organizationId = isOrganizationAccount(activeAccount) ? activeAccount.id : null;

  // Knowledge state
  const [entries, setEntries] = useState<readonly WorkspaceEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  // View state
  const [mainView, setMainView] = useState<MainView>("hub");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);

  // Wiki pages state
  const [orgPages, setOrgPages] = useState<readonly WikiPageEntity[]>([]);
  const [archivedPages, setArchivedPages] = useState<readonly WikiPageEntity[]>([]);
  const [pagesLoadState, setPagesLoadState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [pagesRefreshKey, setPagesRefreshKey] = useState(0);
  const [selectedPage, setSelectedPage] = useState<WikiPageEntity | null>(null);
  const [pageScopeFilter, setPageScopeFilter] = useState<WikiPageScope | "all">("all");

  // ── Load knowledge ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!organizationId) {
        if (!cancelled) {
          setEntries([]);
          setLoadState("loaded");
        }
        return;
      }
      if (!cancelled) setLoadState("loading");
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
              getWorkspaceRagDocuments(workspace).catch(
                () => [] as readonly RagDocumentRecord[],
              ),
            ]);
            return { workspace, summary, docs };
          }),
        );
        if (!cancelled) {
          setEntries(results);
          setLoadState("loaded");
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
          setLoadState("error");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [organizationId, refreshKey]);

  // ── Load wiki pages ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function loadPages() {
      if (!organizationId) {
        if (!cancelled) {
          setOrgPages([]);
          setArchivedPages([]);
          setPagesLoadState("loaded");
        }
        return;
      }
      if (!cancelled) setPagesLoadState("loading");
      try {
        const [pages, archived] = await Promise.all([
          getOrgWikiPages(organizationId),
          getArchivedWikiPages(organizationId),
        ]);
        if (!cancelled) {
          setOrgPages(pages);
          setArchivedPages(archived);
          setPagesLoadState("loaded");
        }
      } catch {
        if (!cancelled) setPagesLoadState("error");
      }
    }
    void loadPages();
    return () => {
      cancelled = true;
    };
  }, [organizationId, pagesRefreshKey]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedEntry = useMemo(
    () => entries.find((e) => e.workspace.id === selectedWorkspaceId) ?? null,
    [entries, selectedWorkspaceId],
  );

  const handleSelectWorkspace = useCallback((id: string) => {
    setSelectedWorkspaceId(id);
    setMainView("workspace");
  }, []);

  const handleSelectPage = useCallback((page: WikiPageEntity) => {
    setSelectedPage(page);
    setMainView("page-detail");
  }, []);

  // ── Tab nav ────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "hub" as const, label: "知識中樞" },
    { key: "pages" as const, label: "Wiki 頁面" },
    { key: "archived" as const, label: "封存" },
  ];

  const activeTab =
    mainView === "workspace"
      ? "hub"
      : mainView === "page-detail"
        ? "pages"
        : (mainView as "hub" | "pages" | "archived");

  // ── Content ────────────────────────────────────────────────────────────────
  let content: React.ReactNode;

  if (mainView === "hub") {
    content = (
      <HubView
        entries={entries}
        loadState={loadState}
        organizationId={organizationId ?? ""}
        onSelectWorkspace={handleSelectWorkspace}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
    );
  } else if (mainView === "workspace" && selectedEntry) {
    content = (
      <WorkspaceDocView
        entry={selectedEntry}
        organizationId={organizationId ?? ""}
        onBack={() => {
          setMainView("hub");
          setSelectedWorkspaceId(null);
        }}
      />
    );
  } else if (mainView === "pages") {
    content = (
      <WikiPagesListView
        organizationId={organizationId ?? ""}
        pages={orgPages}
        pagesLoadState={pagesLoadState}
        scopeFilter={pageScopeFilter}
        onScopeChange={setPageScopeFilter}
        onSelectPage={handleSelectPage}
        onCreated={() => setPagesRefreshKey((k) => k + 1)}
      />
    );
  } else if (mainView === "archived") {
    content = (
      <ArchivedView
        archivedPages={archivedPages}
        loadState={pagesLoadState}
        onSelectPage={handleSelectPage}
      />
    );
  } else if (mainView === "page-detail" && selectedPage) {
    const workspaceName = selectedPage.workspaceId
      ? entries.find((e) => e.workspace.id === selectedPage.workspaceId)?.workspace.name
      : undefined;
    content = (
      <WikiPageDetailView
        page={selectedPage}
        workspaceName={workspaceName}
        onBack={() => {
          setSelectedPage(null);
          setMainView("pages");
        }}
      />
    );
  } else {
    content = (
      <HubView
        entries={entries}
        loadState={loadState}
        organizationId={organizationId ?? ""}
        onSelectWorkspace={handleSelectWorkspace}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border/40 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={[
              "rounded-md px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeTab === tab.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            onClick={() => {
              setMainView(tab.key);
              setSelectedPage(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {content}
    </div>
  );
}
