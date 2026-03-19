"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  FilterIcon,
  RefreshCwIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import { Badge } from "@/ui/shadcn/ui/badge";
import { Button } from "@/ui/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/shadcn/ui/collapsible";
import { Input } from "@/ui/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/ui/select";
import { Separator } from "@/ui/shadcn/ui/separator";
import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import { getWorkspaceKnowledgeSummary } from "../queries/knowledge.queries";

interface WorkspaceKnowledgeTabProps {
  readonly workspace: WorkspaceEntity;
}

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

// ── Helpers ────────────────────────────────────────────────────────────────────

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
    console.warn(`[WorkspaceKnowledgeTab] Action stub invoked: ${name} — not yet implemented.`);
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

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
  /** All docs sharing the same versionGroupId, sorted desc by versionNumber. */
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

          {/* Access control */}
          {doc.accessControl && doc.accessControl.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {doc.accessControl.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          )}

          {/* Status message (errors) */}
          {doc.statusMessage && (
            <p className="text-xs text-destructive">{doc.statusMessage}</p>
          )}

          {/* Update log */}
          {doc.updateLog && (
            <p className="text-xs text-muted-foreground italic">Note: {doc.updateLog}</p>
          )}
        </div>

        {/* Right: timestamps + actions */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="text-right text-xs text-muted-foreground">
            <p>Uploaded: {formatDate(doc.createdAtISO)}</p>
            {doc.indexedAtISO && <p>Indexed: {formatDate(doc.indexedAtISO)}</p>}
            {doc.expiresAtISO && (
              <p className="text-amber-600 dark:text-amber-400">
                Expires: {formatDate(doc.expiresAtISO)}
              </p>
            )}
            <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground/50">
              {doc.id}
            </p>
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
                Retry
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
                Archive
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
                New version
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
                Version history ({versionHistory.length} versions)
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
                      {v.updateLog && <span className="italic">{v.updateLog}</span>}
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

// ── Main component ─────────────────────────────────────────────────────────────

export function WorkspaceKnowledgeTab({ workspace }: WorkspaceKnowledgeTabProps) {
  const [summary, setSummary] = useState<WorkspaceKnowledgeSummary>(EMPTY_SUMMARY);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [ragDocuments, setRagDocuments] = useState<readonly RagDocumentRecord[]>([]);
  const [ragLoadState, setRagLoadState] = useState<"loading" | "loaded" | "error">("loading");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchText, setSearchText] = useState("");

  const loadData = useCallback(async () => {
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
      console.warn("[WorkspaceKnowledgeTab] Failed to load knowledge data:", error);
      setSummary(EMPTY_SUMMARY);
      setLoadState("error");
      setRagDocuments([]);
      setRagLoadState("error");
    }
  }, [workspace]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await loadData();
      if (cancelled) return;
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const map: Record<RagDocumentRecord["status"], number> = {
      uploaded: 0,
      processing: 0,
      ready: 0,
      failed: 0,
      archived: 0,
    };
    for (const doc of ragDocuments) {
      if (doc.isLatest) {
        map[doc.status] += 1;
      }
    }
    return map;
  }, [ragDocuments]);

  // ── Version groups ────────────────────────────────────────────────────────
  // Group all docs by versionGroupId; we display only latest per group in the
  // primary list, but keep all versions for the collapsible history panel.
  const { latestDocs, versionsByGroup } = useMemo(() => {
    const groups = new Map<string, RagDocumentRecord[]>();

    for (const doc of ragDocuments) {
      const list = groups.get(doc.versionGroupId) ?? [];
      list.push(doc);
      groups.set(doc.versionGroupId, list);
    }

    // Sort each group desc by versionNumber
    for (const list of groups.values()) {
      list.sort((a, b) => b.versionNumber - a.versionNumber);
    }

    // Latest per group = first item in desc-sorted list
    const latestPerGroup = Array.from(groups.values())
      .map((list) => list[0])
      .filter((doc): doc is RagDocumentRecord => doc !== undefined);

    return { latestDocs: latestPerGroup, versionsByGroup: groups };
  }, [ragDocuments]);

  // ── Filter + search ───────────────────────────────────────────────────────
  const filteredDocs = useMemo(() => {
    return latestDocs.filter((doc) => {
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      const q = searchText.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (doc.displayName || doc.sourceFileName).toLowerCase().includes(q) ||
        doc.tags?.some((t) => t.toLowerCase().includes(q)) ||
        doc.category?.toLowerCase().includes(q) ||
        doc.department?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [latestDocs, statusFilter, searchText]);

  // ── Action stubs ──────────────────────────────────────────────────────────
  const handleRetry = useCallback((docId: string) => {
    stubAction(`retry:${docId}`);
  }, []);

  const handleArchive = useCallback((docId: string) => {
    stubAction(`archive:${docId}`);
  }, []);

  const handleUploadVersion = useCallback((versionGroupId: string) => {
    stubAction(`upload-version:${versionGroupId}`);
  }, []);

  return (
    <div className="space-y-4">
      {/* ── Summary posture ─────────────────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Knowledge</CardTitle>
              <CardDescription>工作區知識庫狀態總覽與文件管理。</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={summaryStatusVariantMap[summary.status]}>{summary.status}</Badge>
              <Badge variant="secondary">{summary.visibleSurface}</Badge>
              <Badge variant="secondary">{summary.contractStatus}</Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={() => void loadData()}
                disabled={loadState === "loading" || ragLoadState === "loading"}
              >
                <RefreshCwIcon className="size-3" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadState === "error" && (
            <p className="text-sm text-destructive">
              無法載入 knowledge 摘要，以下先顯示契約與 UI 已上線的預設狀態。
            </p>
          )}

          {/* KPI row: 6 key signals */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <KpiCard label="Registered" value={summary.registeredAssetCount} />
            <KpiCard label="Ready" value={summary.readyAssetCount} />
            <KpiCard label="Sources" value={summary.supportedSourceCount} />
            <KpiCard
              label="Processing"
              value={counts.processing + counts.uploaded}
              variant={counts.processing + counts.uploaded > 0 ? "warning" : "default"}
            />
            <KpiCard
              label="Failed"
              value={counts.failed}
              variant={counts.failed > 0 ? "destructive" : "default"}
            />
            <KpiCard label="Archived" value={counts.archived} />
          </div>

          {/* Blocked reasons + next actions */}
          {(summary.blockedReasons.length > 0 || summary.nextActions.length > 0) && (
            <div className="grid gap-3 lg:grid-cols-2">
              {summary.blockedReasons.length > 0 && (
                <div className="rounded-xl border border-amber-400/40 bg-amber-50/30 px-4 py-4 dark:bg-amber-950/20">
                  <p className="text-sm font-semibold text-foreground">Blocked reasons</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {summary.blockedReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.nextActions.length > 0 && (
                <div className="rounded-xl border border-border/40 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">Recommended next actions</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {summary.nextActions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Document list ────────────────────────────────────────────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Knowledge Documents</CardTitle>
              <CardDescription>
                已上傳至 Firestore knowledge_base 的文件清單，含完整 metadata 與版本歷史。
              </CardDescription>
            </div>
            {/* Upload first doc button — always visible as design anchor */}
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => stubAction("upload-first-doc")}
              disabled={ragLoadState === "loading"}
            >
              <UploadIcon className="size-3" />
              Upload document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter bar */}
          {ragLoadState === "loaded" && ragDocuments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <FilterIcon className="size-4 shrink-0 text-muted-foreground" />
              {/* Status filter */}
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="h-7 w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="uploaded">uploaded</SelectItem>
                  <SelectItem value="processing">processing</SelectItem>
                  <SelectItem value="ready">ready</SelectItem>
                  <SelectItem value="failed">failed</SelectItem>
                  <SelectItem value="archived">archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-7 pl-7 text-xs"
                  placeholder="Search name, tag, category…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              {/* Clear filters */}
              {(statusFilter !== "all" || searchText !== "") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchText("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          {/* Loading state */}
          {ragLoadState === "loading" && (
            <p className="text-sm text-muted-foreground">Loading knowledge documents…</p>
          )}

          {/* Error state */}
          {ragLoadState === "error" && (
            <p className="text-sm text-destructive">無法載入知識文件清單，請稍後再試。</p>
          )}

          {/* Empty state — no documents at all */}
          {ragLoadState === "loaded" && ragDocuments.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/40 px-4 py-8 text-center">
              <FileTextIcon className="size-8 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  尚無知識文件
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  請先至 Files 分頁上傳檔案，或使用上方按鈕直接上傳文件。
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => stubAction("upload-first-doc")}
              >
                <UploadIcon className="size-3" />
                Upload first document
              </Button>
            </div>
          )}

          {/* Empty state — filtered to zero */}
          {ragLoadState === "loaded" &&
            ragDocuments.length > 0 &&
            filteredDocs.length === 0 && (
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

      {/* ── Governance panel (design anchor — actions stubbed) ───────────── */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Governance</CardTitle>
          <CardDescription>
            封存管理、版本回滾與稽核記錄。目前為設計錨點，後端尚未實作。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Archive / Restore</p>
              <p className="mt-1 text-xs text-muted-foreground">
                封存文件後不再參與 RAG 查詢。封存後可手動 Restore 回 uploaded 狀態。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1 text-xs"
                onClick={() => stubAction("open-archive-list")}
              >
                <ArchiveIcon className="size-3" />
                View archived ({counts.archived})
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Version rollback</p>
              <p className="mt-1 text-xs text-muted-foreground">
                回滾至先前版本。操作為原子事務：更新 isLatest 欄位及對應 chunks，並記錄至 audit log。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("open-rollback-dialog")}
              >
                View version groups
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Audit trail</p>
              <p className="mt-1 text-xs text-muted-foreground">
                所有文件的上傳、版本更新、封存、回滾操作均記錄 actor 及時間戳。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => stubAction("open-audit-log")}
              >
                View audit log
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/60">
            ⚠ Governance actions are design anchors only. Backend implementation follows{" "}
            <code className="text-[10px]">docs/architecture/knowledge.md</code> §3 business logic spec.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

