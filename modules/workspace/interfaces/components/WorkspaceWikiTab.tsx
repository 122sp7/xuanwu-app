"use client";

/**
 * Module: workspace
 * Purpose: workspace-level wiki and knowledge hub — wiki pages list + RAG document health.
 * Responsibilities: wiki page list/search/filter + knowledge document KPIs + doc list with
 *   version history. Stub create actions until wiki domain is ready.
 * Constraints: UI components only — no business logic.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  FilterIcon,
  LockIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import type { WorkspaceKnowledgeSummary } from "@/modules/wiki";
import { getWorkspaceKnowledgeSummary } from "@/modules/wiki";
import { Badge } from '@ui-shadcn';
import { Button } from '@ui-shadcn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui-shadcn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@ui-shadcn';
import { Input } from '@ui-shadcn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui-shadcn';
import { Separator } from '@ui-shadcn';

interface WorkspaceWikiTabProps {
  readonly workspace: WorkspaceEntity;
}

// ── Wiki pages types ──────────────────────────────────────────────────────────

type PageVisibility = "public" | "private" | "archived";

interface WikiPage {
  id: string;
  title: string;
  visibility: PageVisibility;
  updatedAt: string;
  updatedByName: string;
}

const VISIBILITY_LABELS: Record<PageVisibility, string> = {
  public: "公開",
  private: "私人",
  archived: "封存",
};

const VISIBILITY_TABS: Array<{ key: PageVisibility | "all"; label: string }> = [
  { key: "all", label: "全部" },
  { key: "public", label: "公開" },
  { key: "private", label: "私人" },
  { key: "archived", label: "封存" },
];

/** Stub pages — replace with real Firestore query when wiki domain is ready. */
const STUB_PAGES: WikiPage[] = [];

// ── Knowledge document types & constants ─────────────────────────────────────

type StatusFilter = RagDocumentRecord["status"] | "all";

const EMPTY_SUMMARY: WorkspaceKnowledgeSummary = {
  registeredAssetCount: 0,
  readyAssetCount: 0,
  supportedSourceCount: 0,
  status: "needs-input",
  blockedReasons: [],
  nextActions: [],
  visibleSurface: "workspace-tab-live",
  contractStatus: "contract-live",
};

const summaryStatusVariantMap = {
  "needs-input": "outline",
  staged: "secondary",
  ready: "default",
} as const;

const ragStatusVariantMap: Record<
  RagDocumentRecord["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  uploaded: "outline",
  processing: "secondary",
  ready: "default",
  failed: "destructive",
  archived: "outline",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
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
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function stubAction(name: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[WorkspaceWikiTab] Stub invoked: ${name} — not yet implemented.`);
  }
}

// ── KPI card ──────────────────────────────────────────────────────────────────

interface KpiCardProps {
  readonly label: string;
  readonly value: number;
  readonly variant?: "default" | "warning" | "destructive";
}

function KpiCard({ label, value, variant = "default" }: KpiCardProps) {
  return (
    <div
      className={[
        "rounded-xl border px-4 py-3",
        variant === "destructive"
          ? "border-destructive/40 bg-destructive/5"
          : variant === "warning"
            ? "border-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20"
            : "border-border/40",
      ].join(" ")}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={[
          "mt-1 text-xl font-semibold",
          variant === "destructive" ? "text-destructive" : "",
          variant === "warning" ? "text-amber-600 dark:text-amber-400" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

// ── Document row with version history ─────────────────────────────────────────

interface DocumentRowProps {
  readonly doc: RagDocumentRecord;
  readonly versionHistory: readonly RagDocumentRecord[];
  readonly onRetry: (docId: string) => void;
  readonly onArchive: (docId: string) => void;
  readonly onUploadVersion: (versionGroupId: string) => void;
}

function DocumentRow({
  doc,
  versionHistory,
  onRetry,
  onArchive,
  onUploadVersion,
}: DocumentRowProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const hasOtherVersions = versionHistory.length > 1;

  return (
    <div className="rounded-xl border border-border/40">
      {/* Main row */}
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: name + meta */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
            <p className="truncate text-sm font-semibold text-foreground">
              {doc.displayName || doc.sourceFileName}
            </p>
            <Badge variant={ragStatusVariantMap[doc.status]}>{doc.status}</Badge>
            {doc.isLatest && (
              <Badge variant="outline" className="text-xs">
                latest
              </Badge>
            )}
            {doc.versionNumber > 1 && (
              <Badge variant="secondary" className="text-xs">
                v{doc.versionNumber}
              </Badge>
            )}
          </div>

          {/* Compact metadata row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {doc.mimeType && <span>{doc.mimeType}</span>}
            {doc.sizeBytes > 0 && <span>{formatBytes(doc.sizeBytes)}</span>}
            {doc.language && <span>{doc.language}</span>}
            {doc.category && <span>{doc.category}</span>}
            {doc.department && <span>{doc.department}</span>}
            {doc.chunkCount != null && <span>{doc.chunkCount} chunks</span>}
          </div>

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {doc.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Status message (errors/warnings) */}
          {doc.statusMessage && (
            <p className="text-xs text-destructive">{doc.statusMessage}</p>
          )}
        </div>

        {/* Right: timestamps + actions */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-right text-xs text-muted-foreground">
            <p>上傳：{formatDate(doc.createdAtISO)}</p>
            {doc.indexedAtISO && <p>建索引：{formatDate(doc.indexedAtISO)}</p>}
            {doc.expiresAtISO && (
              <p className="text-amber-600 dark:text-amber-400">
                到期：{formatDate(doc.expiresAtISO)}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-end gap-1">
            {doc.status === "failed" && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={() => onRetry(doc.id)}
              >
                <RefreshCwIcon className="size-3" />
                重試
              </Button>
            )}
            {doc.status !== "archived" && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={() => onArchive(doc.id)}
              >
                <ArchiveIcon className="size-3" />
                封存
              </Button>
            )}
            {doc.isLatest && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={() => onUploadVersion(doc.versionGroupId)}
              >
                <UploadIcon className="size-3" />
                上傳新版
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Version history collapsible */}
      {hasOtherVersions && (
        <>
          <Separator />
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              >
                {historyOpen ? (
                  <ChevronDownIcon className="size-3" />
                ) : (
                  <ChevronRightIcon className="size-3" />
                )}
                版本歷史（共 {versionHistory.length} 個版本）
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 px-4 pb-3">
                {versionHistory.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      <span className="font-mono">v{v.versionNumber}</span>
                      <Badge variant={ragStatusVariantMap[v.status]} className="text-[10px]">
                        {v.status}
                      </Badge>
                      {v.isLatest && (
                        <Badge variant="outline" className="text-[10px]">
                          latest
                        </Badge>
                      )}
                    </div>
                    <span className="shrink-0 text-muted-foreground/60">
                      {formatDate(v.createdAtISO)}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function WorkspaceWikiTab({ workspace }: WorkspaceWikiTabProps) {
  // ── Wiki pages state ──────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [activeVisibility, setActiveVisibility] = useState<PageVisibility | "all">("all");

  const filteredPages = useMemo(() => {
    let pages = STUB_PAGES;
    if (activeVisibility !== "all") {
      pages = pages.filter((p) => p.visibility === activeVisibility);
    }
    const trimmed = search.trim().toLowerCase();
    if (trimmed) {
      pages = pages.filter((p) => p.title.toLowerCase().includes(trimmed));
    }
    return pages;
  }, [search, activeVisibility]);

  // ── Knowledge doc health state ────────────────────────────────────────
  const [summary, setSummary] = useState<WorkspaceKnowledgeSummary>(EMPTY_SUMMARY);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [ragDocuments, setRagDocuments] = useState<readonly RagDocumentRecord[]>([]);
  const [ragLoadState, setRagLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [docSearch, setDocSearch] = useState("");

  const loadKnowledgeData = useCallback(async () => {
    setLoadState("loading");
    setRagLoadState("loading");
    try {
      const [nextSummary, nextRagDocuments] = await Promise.all([
        getWorkspaceKnowledgeSummary(workspace),
        getWorkspaceRagDocuments(workspace),
      ]);
      setSummary(nextSummary);
      setLoadState("loaded");
      setRagDocuments(nextRagDocuments);
      setRagLoadState("loaded");
    } catch (error) {
      console.warn("[WorkspaceWikiTab] Failed to load knowledge data:", error);
      setSummary(EMPTY_SUMMARY);
      setLoadState("error");
      setRagDocuments([]);
      setRagLoadState("error");
    }
  }, [workspace]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      await loadKnowledgeData();
      if (cancelled) return;
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [loadKnowledgeData]);

  const counts = useMemo(() => {
    const map: Record<RagDocumentRecord["status"], number> = {
      uploaded: 0, processing: 0, ready: 0, failed: 0, archived: 0,
    };
    for (const doc of ragDocuments) {
      if (doc.isLatest) map[doc.status] += 1;
    }
    return map;
  }, [ragDocuments]);

  const { latestDocs, versionsByGroup } = useMemo(() => {
    const groups = new Map<string, RagDocumentRecord[]>();
    for (const doc of ragDocuments) {
      const list = groups.get(doc.versionGroupId) ?? [];
      list.push(doc);
      groups.set(doc.versionGroupId, list);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => b.versionNumber - a.versionNumber);
    }
    const latestPerGroup = Array.from(groups.values())
      .map((list) => list[0])
      .filter((doc): doc is RagDocumentRecord => doc !== undefined);
    return { latestDocs: latestPerGroup, versionsByGroup: groups };
  }, [ragDocuments]);

  const filteredDocs = useMemo(() => {
    return latestDocs.filter((doc) => {
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      const q = docSearch.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (doc.displayName || doc.sourceFileName).toLowerCase().includes(q) ||
        doc.tags?.some((t) => t.toLowerCase().includes(q)) ||
        doc.category?.toLowerCase().includes(q) ||
        doc.department?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [latestDocs, statusFilter, docSearch]);

  const handleRetry = useCallback((docId: string) => { stubAction(`retry:${docId}`); }, []);
  const handleArchive = useCallback((docId: string) => { stubAction(`archive:${docId}`); }, []);
  const handleUploadVersion = useCallback((versionGroupId: string) => {
    stubAction(`upload-version:${versionGroupId}`);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ═══════════════════════════════════════════════════════════════
          Wiki Pages section
      ════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Wiki 頁面</h2>
            <p className="text-xs text-muted-foreground">
              {workspace.name} 的共用知識頁面與文件。
            </p>
          </div>

          <Button
            size="sm"
            className="gap-1.5 self-start sm:self-auto"
            disabled
            title="新增頁面（即將推出）"
            aria-label="新增頁面（功能即將推出）"
          >
            <PlusIcon className="size-4" />
            新增頁面
          </Button>
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="搜尋頁面…"
              className="h-8 pl-8 text-sm"
            />
          </div>

          <div
            className="flex gap-1 rounded-lg border border-border/50 bg-card/50 p-1"
            role="tablist"
            aria-label="頁面可見性篩選"
          >
            {VISIBILITY_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`wiki-tab-${tab.key}`}
                aria-selected={activeVisibility === tab.key}
                aria-controls="wiki-tabpanel"
                onClick={() => {
                  setActiveVisibility(tab.key);
                }}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  activeVisibility === tab.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page list */}
        <div
          id="wiki-tabpanel"
          role="tabpanel"
          aria-labelledby={`wiki-tab-${activeVisibility}`}
        >
          {filteredPages.length === 0 ? (
            <Card className="border border-border/50">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <FileTextIcon className="size-10 text-muted-foreground/40" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {search.trim()
                      ? "找不到符合的頁面"
                      : activeVisibility === "all"
                        ? "尚未建立任何 Wiki 頁面"
                        : `尚未建立任何${VISIBILITY_LABELS[activeVisibility as PageVisibility]}頁面`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    點擊「新增頁面」以開始撰寫工作區知識文件。
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">頁面列表</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/40">
                  {filteredPages.map((page) => (
                    <li
                      key={page.id}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-muted/50"
                    >
                      <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm font-medium">{page.title}</span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        <span className="flex items-center gap-1">
                          {page.visibility === "private" && <LockIcon className="size-3" />}
                          {VISIBILITY_LABELS[page.visibility]}
                        </span>
                      </Badge>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {page.updatedByName} · {page.updatedAt}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator />

      {/* ═══════════════════════════════════════════════════════════════
          Knowledge document health section
      ════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">

        {/* Summary + KPI row */}
        <Card className="border border-border/50">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>知識庫文件</CardTitle>
                <CardDescription>工作區知識庫文件狀態與管理。</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={summaryStatusVariantMap[summary.status]}>{summary.status}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => void loadKnowledgeData()}
                  disabled={loadState === "loading" || ragLoadState === "loading"}
                >
                  <RefreshCwIcon className="size-3" />
                  重新整理
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadState === "error" && (
              <p className="text-sm text-destructive">無法載入知識摘要，請稍後再試。</p>
            )}

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <KpiCard label="已註冊" value={summary.registeredAssetCount} />
              <KpiCard label="就緒" value={summary.readyAssetCount} />
              <KpiCard label="來源數" value={summary.supportedSourceCount} />
              <KpiCard
                label="處理中"
                value={counts.processing + counts.uploaded}
                variant={counts.processing + counts.uploaded > 0 ? "warning" : "default"}
              />
              <KpiCard
                label="失敗"
                value={counts.failed}
                variant={counts.failed > 0 ? "destructive" : "default"}
              />
              <KpiCard label="已封存" value={counts.archived} />
            </div>

            {/* Blocked reasons */}
            {summary.blockedReasons.length > 0 && (
              <div className="rounded-xl border border-amber-400/40 bg-amber-50/30 px-4 py-4 dark:bg-amber-950/20">
                <p className="text-sm font-semibold text-foreground">尚未完成的設定</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {summary.blockedReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document list */}
        <Card className="border border-border/50">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>文件清單</CardTitle>
                <CardDescription>已上傳的知識文件，含狀態、版本與 metadata。</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => stubAction("upload-first-doc")}
                disabled={ragLoadState === "loading"}
              >
                <UploadIcon className="size-3" />
                上傳文件
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter bar */}
            {ragLoadState === "loaded" && ragDocuments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <FilterIcon className="size-4 shrink-0 text-muted-foreground" />
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue placeholder="狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部狀態</SelectItem>
                    <SelectItem value="uploaded">uploaded</SelectItem>
                    <SelectItem value="processing">processing</SelectItem>
                    <SelectItem value="ready">ready</SelectItem>
                    <SelectItem value="failed">failed</SelectItem>
                    <SelectItem value="archived">archived</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-7 pl-7 text-xs"
                    placeholder="搜尋名稱、標籤、分類…"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                  />
                </div>

                {(statusFilter !== "all" || docSearch !== "") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setStatusFilter("all");
                      setDocSearch("");
                    }}
                  >
                    清除
                  </Button>
                )}
              </div>
            )}

            {ragLoadState === "loading" && (
              <p className="text-sm text-muted-foreground">載入文件中…</p>
            )}
            {ragLoadState === "error" && (
              <p className="text-sm text-destructive">無法載入文件清單，請稍後再試。</p>
            )}

            {/* Empty state */}
            {ragLoadState === "loaded" && ragDocuments.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/40 px-4 py-8 text-center">
                <FileTextIcon className="size-8 text-muted-foreground/40" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">尚無知識文件</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    請先至「檔案」分頁上傳檔案，或使用上方按鈕上傳文件。
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => stubAction("upload-first-doc")}
                >
                  <UploadIcon className="size-3" />
                  上傳第一份文件
                </Button>
              </div>
            )}

            {/* Filter empty state */}
            {ragLoadState === "loaded" && ragDocuments.length > 0 && filteredDocs.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                沒有符合篩選條件的文件。
              </p>
            )}

            {/* Document rows */}
            {ragLoadState === "loaded" &&
              filteredDocs.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  versionHistory={versionsByGroup.get(doc.versionGroupId) ?? [doc]}
                  onRetry={handleRetry}
                  onArchive={handleArchive}
                  onUploadVersion={handleUploadVersion}
                />
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
