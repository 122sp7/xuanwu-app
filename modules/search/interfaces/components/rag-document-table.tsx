"use client";

import { AlertCircle, ExternalLink, FileText, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import type { SourceLiveDocument as WikiLiveDocument } from "@/modules/source/api";
import { formatDate, RagBadge, StatusBadge } from "./rag-status-badges";

export interface RagDocStatusSummary {
  readonly total: number;
  readonly processing: number;
  readonly completed: number;
  readonly errors: number;
  readonly ragReady: number;
  readonly ragError: number;
}

export interface RagDocumentTableProps {
  readonly activeAccountId: string;
  readonly effectiveWorkspaceId: string;
  readonly loadingDocs: boolean;
  readonly filteredDocs: WikiLiveDocument[];
  readonly filteredReadyCount: number;
  readonly statusSummary: RagDocStatusSummary;
  readonly deletingId: string | null;
  readonly renamingId: string | null;
  readonly logs: string[];
  readonly onDelete: (doc: WikiLiveDocument) => void;
  readonly onRename: (doc: WikiLiveDocument) => void;
  readonly onViewOriginal: (doc: WikiLiveDocument) => void;
  readonly onClearLogs: () => void;
}

export function RagDocumentTable({
  activeAccountId,
  effectiveWorkspaceId,
  loadingDocs,
  filteredDocs,
  filteredReadyCount,
  statusSummary,
  deletingId,
  renamingId,
  logs,
  onDelete,
  onRename,
  onViewOriginal,
  onClearLogs,
}: RagDocumentTableProps) {
  return (
    <>
      <section className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-md border border-border/60 bg-card p-3">
          <p className="text-xs text-muted-foreground">全部</p>
          <p className="text-lg font-semibold">{statusSummary.total}</p>
        </div>
        <div className="rounded-md border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs text-blue-700">處理中</p>
          <p className="text-lg font-semibold text-blue-700">{statusSummary.processing}</p>
        </div>
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-emerald-700">解析完成</p>
          <p className="text-lg font-semibold text-emerald-700">{statusSummary.completed}</p>
        </div>
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-xs text-destructive">解析錯誤</p>
          <p className="text-lg font-semibold text-destructive">{statusSummary.errors}</p>
        </div>
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-emerald-700">RAG Ready</p>
          <p className="text-lg font-semibold text-emerald-700">{statusSummary.ragReady}</p>
        </div>
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-xs text-destructive">RAG Error</p>
          <p className="text-lg font-semibold text-destructive">{statusSummary.ragError}</p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>檔案列表 + 解析狀態</CardTitle>
          <CardDescription>
            account: {activeAccountId || "(未選擇)"}
            {` / scope: ${effectiveWorkspaceId ? `workspace:${effectiveWorkspaceId}` : "account 全覽"} / docs: ${filteredDocs.length} 筆 / RAG ready: ${filteredReadyCount} 筆。`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">狀態</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">上傳時間</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {loadingDocs ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">讀取中...</td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      目前沒有可用文件。上傳後會在此顯示解析狀態。
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-border/40 last:border-0">
                      <td className="px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground" title={doc.filename}>
                            {doc.filename}
                            {doc.isClientPending ? (
                              <span className="ml-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-700">
                                pending
                              </span>
                            ) : null}
                          </p>
                          <p className="text-xs text-muted-foreground">id: {doc.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={doc.status} errorMessage={doc.errorMessage} />
                      </td>
                      <td className="px-3 py-2.5">
                        <RagBadge status={doc.ragStatus} error={doc.ragError} />
                      </td>
                      <td className="px-3 py-2.5 text-xs">{doc.pageCount || "-"}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewOriginal(doc)}
                            disabled={!doc.sourceGcsUri}
                            title="查看原始檔案"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRename(doc)}
                            disabled={renamingId === doc.id}
                            title="更名"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            {renamingId === doc.id ? <Loader2 className="size-3.5 animate-spin" /> : <Pencil className="size-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(doc)}
                            disabled={deletingId === doc.id}
                            title="刪除"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                          >
                            {deletingId === doc.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="size-4" /> Runtime Console</CardTitle>
          <CardDescription>顯示上傳與 CRUD 操作紀錄。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClearLogs}>清除 Console</Button>
            <span className="text-xs text-muted-foreground">{logs.length} 筆</span>
          </div>
          {logs.length === 0 ? (
            <p className="text-xs text-muted-foreground">尚無紀錄</p>
          ) : (
            <div className="max-h-48 overflow-y-auto rounded-md border border-border/60 bg-muted/20 p-3">
              {logs.map((line, index) => (
                <p key={`${line}-${index}`} className="font-mono text-xs leading-5 text-foreground/90">{line}</p>
              ))}
            </div>
          )}
          <div className="flex items-start gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-700">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            文件列表使用 Firestore 即時監聽，自動保持最新狀態。
          </div>
        </CardContent>
      </Card>
    </>
  );
}
