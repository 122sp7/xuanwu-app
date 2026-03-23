"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import {
  reindexWikiBetaDocument,
} from "../../application";

interface WikiBetaRagReindexViewProps {
  readonly onBack: () => void;
  readonly workspaceId?: string;
}

interface ReindexDocument {
  readonly id: string;
  readonly filename: string;
  readonly status: string;
  readonly ragStatus: string;
  readonly pageCount: number;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly uploadedAt: Date | null;
}

function objectOrEmpty(v: unknown): Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function toNumberOrDefault(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return fallback;
}

function toDateOrNull(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (v && typeof v === "object" && typeof (v as { toDate?: unknown }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate();
  }
  if (typeof v === "string" && v) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function resolveFilename(data: Record<string, unknown>): string {
  const source = objectOrEmpty(data.source);
  const metadata = objectOrEmpty(data.metadata);
  const candidates = [
    source.filename,
    source.display_name,
    data.title,
    metadata.filename,
    metadata.display_name,
    source.original_filename,
    metadata.original_filename,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }
  return "";
}

function mapDoc(id: string, data: Record<string, unknown>): ReindexDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);

  const sourceGcsUri =
    (typeof source.gcs_uri === "string" ? source.gcs_uri : "") ||
    (typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "");
  const jsonGcsUri =
    (typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "") ||
    (typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "");

  return {
    id,
    filename: resolveFilename(data) || id,
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    pageCount:
      toNumberOrDefault(parsed.page_count) ||
      toNumberOrDefault(metadata.page_count) ||
      toNumberOrDefault(data.pageCount),
    sourceGcsUri,
    jsonGcsUri,
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
  };
}

function formatDate(value: Date | null): string {
  if (!value) return "-";
  return value.toLocaleString("zh-TW", { hour12: false });
}

function StatusBadge({ status }: { readonly status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> 完成
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> 處理中
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "-"}</span>;
}

function RagBadge({ status }: { readonly status: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <XCircle className="size-3" /> Error
      </span>
    );
  }
  if (status) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
        <Loader2 className="size-3 animate-spin" /> {status}
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">-</span>;
}

export function WikiBetaRagReindexView({ onBack, workspaceId }: WikiBetaRagReindexViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const activeAccountId = appState.activeAccount?.id ?? authState.user?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() || "";

  const [docs, setDocs] = useState<ReindexDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const loadDocs = useCallback(async () => {
    if (!activeAccountId) {
      setDocs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const db = getFirebaseFirestore();
      const colRef = firestoreApi.collection(db, "accounts", activeAccountId, "documents");
      const snap = await firestoreApi.getDocs(colRef);
      const mapped = snap.docs
        .map((item) => mapDoc(item.id, objectOrEmpty(item.data())))
        .filter((item) => !effectiveWorkspaceId || item.id.includes(effectiveWorkspaceId));
      mapped.sort((a, b) => {
        const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
        const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
        return bt - at;
      });
      setDocs(mapped);
    } catch (error) {
      console.error(error);
      toast.error("讀取文件列表失敗");
    } finally {
      setLoading(false);
    }
  }, [activeAccountId, effectiveWorkspaceId]);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

  async function handleReindex(doc: ReindexDocument) {
    if (!activeAccountId) {
      toast.error("缺少 account context");
      return;
    }
    if (!doc.jsonGcsUri) {
      toast.error("此文件沒有 json_gcs_uri，無法重整");
      return;
    }
    setReindexingId(doc.id);
    try {
      await reindexWikiBetaDocument({
        accountId: activeAccountId,
        docId: doc.id,
        jsonGcsUri: doc.jsonGcsUri,
        sourceGcsUri: doc.sourceGcsUri,
        filename: doc.filename,
        pageCount: doc.pageCount,
      });
      toast.success(`已觸發重整：${doc.filename}`);
      await loadDocs();
    } catch (error) {
      console.error(error);
      toast.error(`重整失敗：${doc.filename}`);
    } finally {
      setReindexingId(null);
    }
  }

  const summary = {
    total: docs.length,
    completed: docs.filter((d) => d.status === "completed").length,
    processing: docs.filter((d) => d.status === "processing").length,
    error: docs.filter((d) => d.status === "error").length,
    ragReady: docs.filter((d) => d.ragStatus === "ready").length,
    ragError: docs.filter((d) => d.ragStatus === "error").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onBack}>
          返回 Wiki Beta
        </Button>
        <Button variant="outline" size="sm" onClick={() => void loadDocs()} disabled={loading}>
          <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
          刷新文件
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="size-4" />
            RAG 手動重整
          </CardTitle>
          <CardDescription>
            對文件觸發 rag_reindex_document，重新處理 chunk/embedding。
            {effectiveWorkspaceId && (
              <span className="ml-1 text-primary">workspace: {effectiveWorkspaceId}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activeAccountId ? (
            <p className="text-sm text-muted-foreground">尚未取得 account context，請先登入或切換 account。</p>
          ) : loading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> 載入文件中…
            </div>
          ) : docs.length === 0 ? (
            <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <AlertCircle className="size-4" /> 目前沒有可用文件
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>共 {summary.total} 筆</span>
                <span className="text-blue-600">{summary.processing} 處理中</span>
                <span className="text-emerald-600">{summary.completed} 完成</span>
                <span className="text-destructive">{summary.error} 錯誤</span>
                <span className="border-l border-border pl-3 text-emerald-600">{summary.ragReady} RAG ready</span>
                <span className="text-destructive">{summary.ragError} RAG error</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="px-2 py-1.5 font-medium">檔案名稱</th>
                      <th className="px-2 py-1.5 font-medium">狀態</th>
                      <th className="px-2 py-1.5 font-medium">RAG</th>
                      <th className="px-2 py-1.5 font-medium">頁數</th>
                      <th className="px-2 py-1.5 font-medium">上傳時間</th>
                      <th className="px-2 py-1.5 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc) => {
                      const canReindex = !!doc.jsonGcsUri;
                      const isReindexing = reindexingId === doc.id;
                      return (
                        <tr key={doc.id} className="border-b border-border/30">
                          <td className="max-w-[200px] truncate px-2 py-1.5 font-medium" title={doc.filename}>
                            {doc.filename}
                          </td>
                          <td className="px-2 py-1.5">
                            <StatusBadge status={doc.status} />
                          </td>
                          <td className="px-2 py-1.5">
                            <RagBadge status={doc.ragStatus} />
                          </td>
                          <td className="px-2 py-1.5">{doc.pageCount || "-"}</td>
                          <td className="whitespace-nowrap px-2 py-1.5 text-muted-foreground">
                            {formatDate(doc.uploadedAt)}
                          </td>
                          <td className="px-2 py-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!canReindex || isReindexing}
                              onClick={() => void handleReindex(doc)}
                              title={canReindex ? "觸發手動重整" : "無 json_gcs_uri，無法重整"}
                              className="h-7 text-xs"
                            >
                              {isReindexing ? (
                                <Loader2 className="mr-1 size-3 animate-spin" />
                              ) : (
                                <RefreshCw className="mr-1 size-3" />
                              )}
                              {isReindexing ? "重整中…" : "手動重整"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
