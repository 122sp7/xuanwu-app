"use client";

import { useCallback, useEffect, useState } from "react";

import type { WorkspaceEntity } from "@/modules/workspace";
import type { RagDocumentRecord } from "@/modules/file";
import { getWorkspaceRagDocuments } from "@/modules/file";
import { Badge } from "@/ui/shadcn/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/ui/card";
import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import { getWorkspaceKnowledgeSummary } from "../queries/knowledge.queries";

interface WorkspaceKnowledgeTabProps {
  readonly workspace: WorkspaceEntity;
}

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

const statusVariantMap = {
  "needs-input": "outline",
  staged: "outline",
  ready: "secondary",
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

export function WorkspaceKnowledgeTab({ workspace }: WorkspaceKnowledgeTabProps) {
  const [summary, setSummary] = useState<WorkspaceKnowledgeSummary>(EMPTY_SUMMARY);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [ragDocuments, setRagDocuments] = useState<readonly RagDocumentRecord[]>([]);
  const [ragLoadState, setRagLoadState] = useState<"loading" | "loaded" | "error">("loading");

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

  return (
    <div className="space-y-4">
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Knowledge</CardTitle>
          <CardDescription>
            先上線可見的 read-side Knowledge UI，將 file / parser 現況收斂成可落地的契約入口。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadState === "loading" && (
            <p className="text-sm text-muted-foreground">Loading knowledge posture…</p>
          )}

          {loadState === "error" && (
            <p className="text-sm text-destructive">
              無法載入 knowledge 摘要，以下先顯示契約與 UI 已上線的預設狀態。
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Registered assets</p>
              <p className="mt-1 text-xl font-semibold">{summary.registeredAssetCount}</p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Ready assets</p>
              <p className="mt-1 text-xl font-semibold">{summary.readyAssetCount}</p>
            </div>
            <div className="rounded-xl border border-border/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Supported sources</p>
              <p className="mt-1 text-xl font-semibold">{summary.supportedSourceCount}</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Current knowledge posture</p>
              <Badge variant={statusVariantMap[summary.status]}>{summary.status}</Badge>
              <Badge variant="secondary">{summary.visibleSurface}</Badge>
              <Badge variant="secondary">{summary.contractStatus}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              目前已經有可見的 Knowledge 分頁作為上線入口；真正的 ingestion、chunk、retrieval
              寫側仍以契約先行，避免直接把流程耦合進 workspace UI。
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Published surface</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                <li>Workspace Detail → Knowledge tab</li>
                <li>/docs/architecture/knowledge.md</li>
                <li>/docs/reference/development-contracts/knowledge-contract.md</li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/40 px-4 py-4">
              <p className="text-sm font-semibold text-foreground">Blocked reasons</p>
              {summary.blockedReasons.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  目前沒有額外的 blocked reason，可直接以現有 UI 驗證契約與 read-side 摘要。
                </p>
              ) : (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {summary.blockedReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

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
        </CardContent>
      </Card>

      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle>Knowledge Documents</CardTitle>
          <CardDescription>
            已上傳至 Firestore knowledge_base 的文件清單，涵蓋完整 metadata 欄位。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ragLoadState === "loading" && (
            <p className="text-sm text-muted-foreground">Loading knowledge documents…</p>
          )}

          {ragLoadState === "error" && (
            <p className="text-sm text-destructive">無法載入知識文件清單，請稍後再試。</p>
          )}

          {ragLoadState === "loaded" && ragDocuments.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/40 px-4 py-6 text-center text-sm text-muted-foreground">
              尚無知識文件。請先至 Files 分頁上傳檔案以自動建立 RAG 文件記錄。
            </div>
          )}

          {ragLoadState === "loaded" &&
            ragDocuments.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-border/40 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {doc.displayName || doc.sourceFileName}
                      </p>
                      <Badge variant={ragStatusVariantMap[doc.status]}>{doc.status}</Badge>
                      {doc.isLatest && (
                        <Badge variant="secondary" className="text-xs">
                          latest
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>v{doc.versionNumber}</span>
                      <span>{doc.mimeType}</span>
                      {doc.sizeBytes > 0 && <span>{formatBytes(doc.sizeBytes)}</span>}
                      {doc.language && <span>{doc.language}</span>}
                      {doc.category && <span>{doc.category}</span>}
                    </div>
                    {doc.taxonomy && (
                      <p className="text-xs text-muted-foreground">Taxonomy: {doc.taxonomy}</p>
                    )}
                    {doc.statusMessage && (
                      <p className="text-xs text-destructive">{doc.statusMessage}</p>
                    )}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-xs text-muted-foreground">
                    <p>Uploaded: {formatDate(doc.createdAtISO)}</p>
                    {doc.indexedAtISO && <p>Indexed: {formatDate(doc.indexedAtISO)}</p>}
                    <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground/60">
                      {doc.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
