"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FileUp,
  Loader2,
  Pencil,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { DEV_DEMO_ACCOUNT_EMAIL } from "@/app/providers/dev-demo-auth";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Textarea } from "@ui-shadcn/ui/textarea";
import { runWikiRagQuery, type WikiCitation } from "../../api";
import type { SourceLiveDocument as WikiLiveDocument } from "@/modules/source/api";
import { useDocumentsSnapshot } from "@/modules/source/api";

interface WikiRagViewProps {
  readonly onBack: () => void;
  readonly mode?: "all" | "query" | "reindex" | "documents";
  readonly workspaceId?: string;
  readonly showBackButton?: boolean;
}

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};

const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

function formatDate(value: Date | null): string {
  if (!value) return "-";
  return value.toLocaleString("zh-TW", { hour12: false });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (isRecord(error)) {
    const direct = error.message;
    if (typeof direct === "string" && direct.trim()) return direct;
    const nestedMessage = objectOrEmpty(error.details).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim()) return nestedMessage;
  }
  return "未知錯誤";
}

function StatusBadge({ status, errorMessage }: { status: string; errorMessage: string }) {
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
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={errorMessage || "未知錯誤"}
      >
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "-"}</span>;
}

function RagBadge({ status, error }: { status: string; error: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={error || "未知錯誤"}
      >
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

export function RagView({
  onBack,
  mode = "all",
  workspaceId,
  showBackButton = true,
}: WikiRagViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() || "";
  const showQueryCard = mode === "all" || mode === "query";
  const showDocumentsCard = mode === "documents";
  const showDocsSection = mode === "all" || showDocumentsCard;

  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("4");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<WikiCitation[]>([]);
  const [cacheMode, setCacheMode] = useState<"hit" | "miss">("miss");
  const [vectorHits, setVectorHits] = useState(0);
  const [searchHits, setSearchHits] = useState(0);
  const [accountScope, setAccountScope] = useState("(未查詢)");

  const { docs, loading: loadingDocs, pendingDocs, addPending, removePending } = useDocumentsSnapshot(
    activeAccountId,
    effectiveWorkspaceId || undefined,
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const appendLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString("zh-TW", { hour12: false });
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  }, []);

  async function handleAsk() {
    const q = query.trim();
    if (!q) {
      toast.error("請先輸入問題");
      return;
    }

    setLoadingAnswer(true);
    try {
      if (authState.status !== "authenticated") {
        toast.error("請先以真實帳號登入才能執行 RAG 查詢");
        return;
      }
      if (authState.user?.email === DEV_DEMO_ACCOUNT_EMAIL) {
        toast.error("請先以真實帳號登入才能執行 RAG 查詢（Dev-demo 帳號無法使用此功能）");
        return;
      }
      if (!activeAccountId) {
        toast.error("目前沒有 active account，無法執行 RAG 查詢");
        return;
      }
      if (!effectiveWorkspaceId) {
        toast.error("請先選擇工作區，再執行 RAG 查詢");
        return;
      }
      const parsedTopK = Number(topK);
      const safeTopK = Number.isFinite(parsedTopK) && parsedTopK > 0 ? parsedTopK : 4;
      let result = await runWikiRagQuery(q, activeAccountId, effectiveWorkspaceId, safeTopK, {
        requireReady: true,
      });

      if (result.citations.length === 0 && (result.vectorHits > 0 || result.searchHits > 0)) {
        appendLog("主要查詢無可用引用，啟用相容模式重試 (require_ready=false, max_age_days=3650)");
        result = await runWikiRagQuery(q, activeAccountId, effectiveWorkspaceId, safeTopK, {
          requireReady: false,
          maxAgeDays: 3650,
        });
      }

      setAnswer(result.answer);
      setCitations(result.citations);
      setCacheMode(result.cache);
      setVectorHits(result.vectorHits);
      setSearchHits(result.searchHits);
      setAccountScope(result.accountScope);
      appendLog(`RAG 查詢完成：hits vector=${result.vectorHits}, search=${result.searchHits}`);
    } catch (error) {
      console.error(error);
      const detail = getErrorMessage(error);
      toast.error(`呼叫 rag_query 失敗：${detail}`);
      appendLog(`RAG 查詢失敗：${detail}`);
    } finally {
      setLoadingAnswer(false);
    }
  }

  function buildUploadPath(accountId: string, file: File): { uploadPath: string; docId: string } {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const docId = crypto.randomUUID();
    return { uploadPath: `${WATCH_PATH}${accountId}/${docId}${ext}`, docId };
  }

  function handleFileChange(file: File | null) {
    if (!file) { setSelectedFile(null); return; }
    if (!(file.type in ACCEPTED_MIME)) {
      toast.error(`僅支援 ${ACCEPTED_EXTS}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) { toast.error("請先選擇檔案"); return; }
    if (!activeAccountId) { toast.error("目前沒有 active account，無法上傳"); return; }
    setUploading(true);
    let pendingDocId = "";
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const { uploadPath, docId } = buildUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);
      pendingDocId = docId;

      addPending({
        id: docId,
        filename: selectedFile.name,
        workspaceId: effectiveWorkspaceId,
        sourceGcsUri: `gs://${UPLOAD_BUCKET}/${uploadPath}`,
        jsonGcsUri: "",
        pageCount: 0,
        status: "processing",
        ragStatus: "",
        uploadedAt: new Date(),
        errorMessage: "",
        ragError: "",
        isClientPending: true,
      });

      const customMetadata: Record<string, string> = {
        account_id: activeAccountId,
        filename: selectedFile.name,
        original_filename: selectedFile.name,
        display_name: selectedFile.name,
      };
      if (effectiveWorkspaceId) customMetadata.workspace_id = effectiveWorkspaceId;

      await storageApi.uploadBytes(fileRef, selectedFile, { customMetadata });
      toast.success("上傳成功，背景已開始解析與入庫");
      appendLog(`上傳成功：${selectedFile.name} -> ${uploadPath}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("上傳失敗");
      appendLog(`上傳失敗：${selectedFile.name}`);
      if (pendingDocId) removePending(pendingDocId);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: WikiLiveDocument) {
    if (!activeAccountId) return;
    if (!window.confirm(`確定刪除「${doc.filename}」？此動作無法復原。`)) return;

    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      if (doc.sourceGcsUri) {
        try {
          await storageApi.deleteObject(storageApi.ref(storage, doc.sourceGcsUri));
        } catch {
          // ignore storage-not-found
        }
      }
      if (doc.jsonGcsUri) {
        try {
          await storageApi.deleteObject(storageApi.ref(storage, doc.jsonGcsUri));
        } catch {
          // ignore storage-not-found
        }
      }
      const db = getFirebaseFirestore();
      await firestoreApi.deleteDoc(firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id));
      toast.success("文件已刪除");
      appendLog(`刪除文件：${doc.filename}`);
    } catch (error) {
      console.error(error);
      toast.error("刪除失敗");
      appendLog(`刪除失敗：${doc.filename}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRename(doc: WikiLiveDocument) {
    if (!activeAccountId) { toast.error("目前沒有 active account，無法更名"); return; }
    const nextName = window.prompt("請輸入新檔名", doc.filename)?.trim() ?? "";
    if (!nextName || nextName === doc.filename) return;

    setRenamingId(doc.id);
    try {
      const db = getFirebaseFirestore();
      await firestoreApi.updateDoc(firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id), {
        title: nextName,
        "source.filename": nextName,
        "metadata.filename": nextName,
        updatedAt: firestoreApi.serverTimestamp(),
      });
      toast.success("文件名稱已更新");
      appendLog(`更名文件：${doc.filename} -> ${nextName}`);
    } catch (error) {
      console.error(error);
      toast.error("更名失敗");
      appendLog(`更名失敗：${doc.filename}`);
    } finally {
      setRenamingId(null);
    }
  }

  async function handleViewOriginal(doc: WikiLiveDocument) {
    if (!doc.sourceGcsUri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const url = await storageApi.getDownloadURL(storageApi.ref(storage, doc.sourceGcsUri));
      window.open(url, "_blank", "noopener,noreferrer");
      appendLog(`開啟原始檔：${doc.filename}`);
    } catch (error) {
      console.error(error);
      toast.error("無法開啟原始檔");
      appendLog(`開啟原始檔失敗：${doc.filename}`);
    }
  }

  const filteredDocs = useMemo(
    () => [...pendingDocs, ...docs.filter((d) => !pendingDocs.some((p) => p.id === d.id))],
    [docs, pendingDocs],
  );

  const statusSummary = useMemo(() => ({
    total: filteredDocs.length,
    processing: filteredDocs.filter((item) => item.status === "processing").length,
    completed: filteredDocs.filter((item) => item.status === "completed").length,
    errors: filteredDocs.filter((item) => item.status === "error").length,
    ragReady: filteredDocs.filter((item) => item.ragStatus === "ready").length,
    ragError: filteredDocs.filter((item) => item.ragStatus === "error").length,
  }), [filteredDocs]);

  const filteredReadyCount = useMemo(
    () => filteredDocs.filter((item) => item.ragStatus === "ready").length,
    [filteredDocs],
  );

  return (
    <div className="space-y-4">
      {showBackButton ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>返回 Account Wiki</Button>
        </div>
      ) : null}

      {showQueryCard ? (
      <Card>
        <CardHeader>
          <CardTitle>RAG Query</CardTitle>
          <CardDescription>直接呼叫 py_fn rag_query callable，取得回答與引用來源。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="請輸入問題，例如：總結最近三份文件的重要重點"
            rows={4}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="w-28"
              value={topK}
              onChange={(event) => setTopK(event.target.value)}
              inputMode="numeric"
              placeholder="top_k"
            />
            <Button onClick={() => void handleAsk()} disabled={loadingAnswer}>
              {loadingAnswer ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Search className="mr-2 size-4" />}
              送出查詢
            </Button>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/20 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Answer</p>
            <p className="whitespace-pre-wrap text-sm text-foreground">{answer || "尚未查詢"}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/60 px-2 py-1">cache: {cacheMode}</span>
              <span className="rounded-full border border-border/60 px-2 py-1">scope: {accountScope}</span>
              <span className="rounded-full border border-border/60 px-2 py-1">vector hits: {vectorHits}</span>
              <span className="rounded-full border border-border/60 px-2 py-1">search hits: {searchHits}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Citations</p>
            {citations.length === 0 ? (
              <p className="text-sm text-muted-foreground">尚無引用來源</p>
            ) : (
              citations.map((citation, index) => (
                <div key={`${citation.doc_id ?? "doc"}-${index}`} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{citation.filename || citation.doc_id || "未命名文件"}</p>
                    <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                      {citation.provider || "unknown"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{citation.text || "(無節錄)"}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      ) : null}

      {showDocsSection ? (
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            {effectiveWorkspaceId
              ? `拖曳或選擇檔案上傳到目前 workspace scope：${effectiveWorkspaceId}`
              : "拖曳或選擇檔案上傳到 account scope；workspace 視角為選填。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); handleFileChange(event.dataTransfer.files?.[0] ?? null); }}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition ${
              dragging ? "border-primary/60 bg-primary/10" : "border-border/70 bg-muted/10 hover:border-primary/40"
            }`}
          >
            <FileUp className="size-7 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "點擊或拖曳上傳"}</p>
              <p className="text-xs text-muted-foreground">支援：{ACCEPTED_EXTS}</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={Object.keys(ACCEPTED_MIME).join(",")}
              className="sr-only"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
          <div className="flex items-center gap-2">
            <Button onClick={() => void handleUpload()} disabled={uploading || !selectedFile || !activeAccountId}>
              {uploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {uploading ? "上傳中..." : "上傳並啟動解析"}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              disabled={uploading}
            >
              清除
            </Button>
          </div>
        </CardContent>
      </Card>
      ) : null}

      {showDocsSection ? (
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
      ) : null}

      {showDocsSection ? (
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
                            onClick={() => void handleViewOriginal(doc)}
                            disabled={!doc.sourceGcsUri}
                            title="查看原始檔案"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRename(doc)}
                            disabled={renamingId === doc.id}
                            title="更名"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            {renamingId === doc.id ? <Loader2 className="size-3.5 animate-spin" /> : <Pencil className="size-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(doc)}
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
      ) : null}

      {showDocsSection ? (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="size-4" /> Runtime Console</CardTitle>
          <CardDescription>顯示上傳與 CRUD 操作紀錄。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLogs([])}>清除 Console</Button>
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
      ) : null}
    </div>
  );
}
