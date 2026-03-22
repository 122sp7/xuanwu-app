"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FileUp,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  runWikiBetaRagQuery,
} from "../../application";
import type {
  WikiBetaCitation,
  WikiBetaParsedDocument,
} from "../../domain";

interface WikiBetaRagTestViewProps {
  readonly onBack: () => void;
  readonly mode?: "all" | "query" | "reindex" | "documents";
  readonly workspaceId?: string;
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

interface WikiBetaLiveDocument extends WikiBetaParsedDocument {
  readonly errorMessage: string;
  readonly ragError: string;
  readonly isClientPending?: boolean;
}

function toDateOrNull(value: unknown): Date | null {
  if (!value || typeof value !== "object") return null;
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp.toDate === "function") {
    return maybeTimestamp.toDate();
  }
  return null;
}

function toNumberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mapToLiveDocument(id: string, data: Record<string, unknown>): WikiBetaLiveDocument {
  const source = (data.source ?? {}) as Record<string, unknown>;
  const parsed = (data.parsed ?? {}) as Record<string, unknown>;
  const rag = (data.rag ?? {}) as Record<string, unknown>;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const error = (data.error ?? {}) as Record<string, unknown>;

  const filenameFromSource = typeof source.filename === "string" ? source.filename : "";
  const filenameFromDoc = typeof data.title === "string" ? data.title : "";
  const filenameFromMeta = typeof metadata.filename === "string" ? metadata.filename : "";

  const sourceGcsFromSource = typeof source.gcs_uri === "string" ? source.gcs_uri : "";
  const sourceGcsFromMeta = typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "";
  const jsonGcsFromParsed = typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "";
  const jsonGcsFromMeta = typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "";
  const workspaceIdFromDoc = typeof data.spaceId === "string" ? data.spaceId : "";
  const workspaceIdFromMeta = typeof metadata.space_id === "string" ? metadata.space_id : "";

  return {
    id,
    filename: filenameFromSource || filenameFromDoc || filenameFromMeta || id,
    workspaceId: workspaceIdFromDoc || workspaceIdFromMeta,
    sourceGcsUri: sourceGcsFromSource || sourceGcsFromMeta,
    jsonGcsUri: jsonGcsFromParsed || jsonGcsFromMeta,
    pageCount:
      toNumberOrDefault(parsed.page_count) ||
      toNumberOrDefault(metadata.page_count) ||
      toNumberOrDefault(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
    errorMessage: typeof error.message === "string" ? error.message : "",
    ragError: typeof rag.error === "string" ? rag.error : "",
  };
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

export function WikiBetaRagTestView({ onBack, mode = "all", workspaceId }: WikiBetaRagTestViewProps) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const showQueryCard = mode === "all" || mode === "query";
  const showDocumentsCard = mode === "documents";
  const showDocsSection = mode === "all" || showDocumentsCard;

  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("4");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<WikiBetaCitation[]>([]);
  const [cacheMode, setCacheMode] = useState<"hit" | "miss">("miss");
  const [vectorHits, setVectorHits] = useState(0);
  const [searchHits, setSearchHits] = useState(0);
  const [accountScope, setAccountScope] = useState("(未查詢)");

  const [docs, setDocs] = useState<WikiBetaLiveDocument[]>([]);
  const [pendingDocs, setPendingDocs] = useState<WikiBetaLiveDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusMapRef = useRef<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const appendLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString("zh-TW", { hour12: false });
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  }, []);

  const sortByUploadedDesc = useCallback((items: WikiBetaLiveDocument[]) => {
    const copied = [...items];
    copied.sort((a, b) => {
      const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
      const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
      return bt - at;
    });
    return copied;
  }, []);

  const loadDocs = useCallback(async () => {
    if (!activeAccountId) {
      setDocs([]);
      setLoadingDocs(false);
      return;
    }

    setLoadingDocs(true);
    try {
      const db = getFirebaseFirestore();
      const colRef = firestoreApi.collection(db, "accounts", activeAccountId, "documents");
      const snap = await firestoreApi.getDocs(colRef);
      const mapped = snap.docs.map((item) => mapToLiveDocument(item.id, (item.data() ?? {}) as Record<string, unknown>));
      setDocs(sortByUploadedDesc(mapped));
      setPendingDocs((prev) => prev.filter((item) => !mapped.some((doc) => doc.id === item.id)));
      appendLog(`手動刷新文件列表：${mapped.length} 筆`);
    } catch (error) {
      console.error(error);
      toast.error("讀取文件列表失敗");
    } finally {
      setLoadingDocs(false);
    }
  }, [activeAccountId, appendLog, sortByUploadedDesc]);

  useEffect(() => {
    if (!activeAccountId) {
      setDocs([]);
      setLoadingDocs(false);
      return;
    }

    const db = getFirebaseFirestore();
    const colRef = firestoreApi.collection(db, "accounts", activeAccountId, "documents");
    setLoadingDocs(true);

    const unsubscribe = firestoreApi.onSnapshot(
      colRef,
      (snapshot) => {
        const mapped = snapshot.docs.map((item) => mapToLiveDocument(item.id, (item.data() ?? {}) as Record<string, unknown>));
        setDocs(sortByUploadedDesc(mapped));
        setPendingDocs((prev) => prev.filter((item) => !mapped.some((doc) => doc.id === item.id)));
        setLoadingDocs(false);

        const nextStatusMap: Record<string, string> = {};
        mapped.forEach((doc) => {
          const statusKey = `${doc.status}/${doc.ragStatus}`;
          nextStatusMap[doc.id] = statusKey;
          if (statusMapRef.current[doc.id] !== statusKey) {
            appendLog(`狀態更新 ${doc.filename}: ${doc.status} / rag=${doc.ragStatus || "-"}`);
          }
        });
        statusMapRef.current = nextStatusMap;
      },
      (error) => {
        console.error(error);
        setLoadingDocs(false);
        toast.error("即時監聽文件列表失敗");
        appendLog("即時監聽失敗，請嘗試手動刷新");
      },
    );

    return () => {
      unsubscribe();
      statusMapRef.current = {};
    };
  }, [activeAccountId, appendLog, sortByUploadedDesc]);

  async function handleAsk() {
    const q = query.trim();
    if (!q) {
      toast.error("請先輸入問題");
      return;
    }

    setLoadingAnswer(true);
    try {
      if (!activeAccountId) {
        toast.error("目前沒有 active account，無法執行 RAG 查詢");
        return;
      }
      const parsedTopK = Number(topK);
      const safeTopK = Number.isFinite(parsedTopK) && parsedTopK > 0 ? parsedTopK : 4;
      const result = await runWikiBetaRagQuery(q, activeAccountId, safeTopK);
      setAnswer(result.answer);
      setCitations(result.citations);
      setCacheMode(result.cache);
      setVectorHits(result.vectorHits);
      setSearchHits(result.searchHits);
      setAccountScope(result.accountScope);
      appendLog(`RAG 查詢完成：hits vector=${result.vectorHits}, search=${result.searchHits}`);
    } catch (error) {
      console.error(error);
      toast.error("呼叫 rag_query 失敗");
      appendLog("RAG 查詢失敗");
    } finally {
      setLoadingAnswer(false);
    }
  }

  function buildUploadPath(accountId: string, file: File): { uploadPath: string; docId: string } {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const docId = crypto.randomUUID();
    return {
      uploadPath: `${WATCH_PATH}${accountId}/${docId}${ext}`,
      docId,
    };
  }

  function handleFileChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!(file.type in ACCEPTED_MIME)) {
      toast.error(`僅支援 ${ACCEPTED_EXTS}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("請先選擇檔案");
      return;
    }
    if (!activeAccountId) {
      toast.error("目前沒有 active account，無法上傳");
      return;
    }

    setUploading(true);
    let pendingDocId = "";
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const { uploadPath, docId } = buildUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);
      pendingDocId = docId;

      const pendingItem: WikiBetaLiveDocument = {
        id: docId,
        filename: selectedFile.name,
        workspaceId: workspaceId || "",
        sourceGcsUri: `gs://${UPLOAD_BUCKET}/${uploadPath}`,
        jsonGcsUri: "",
        pageCount: 0,
        status: "processing",
        ragStatus: "",
        uploadedAt: new Date(),
        errorMessage: "",
        ragError: "",
        isClientPending: true,
      };
      setPendingDocs((prev) => [pendingItem, ...prev.filter((item) => item.id !== docId)]);

      await storageApi.uploadBytes(fileRef, selectedFile, {
        customMetadata: {
          account_id: activeAccountId,
          ...(workspaceId ? { workspace_id: workspaceId } : {}),
        },
      });

      toast.success("上傳成功，背景已開始解析與入庫");
      appendLog(`上傳成功：${selectedFile.name} -> ${uploadPath}`);
      appendLog(`等待索引建立：${docId}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("上傳失敗");
      appendLog(`上傳失敗：${selectedFile.name}`);
      if (pendingDocId) {
        setPendingDocs((prev) => prev.filter((item) => item.id !== pendingDocId));
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: WikiBetaLiveDocument) {
    if (!activeAccountId) {
      toast.error("目前沒有 active account，無法刪除");
      return;
    }
    if (!window.confirm(`確定刪除「${doc.filename}」？此動作無法復原。`)) {
      return;
    }

    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      if (doc.sourceGcsUri) {
        try {
          await storageApi.deleteObject(storageApi.ref(storage, doc.sourceGcsUri));
        } catch (_) {
          // ignore storage-not-found
        }
      }
      if (doc.jsonGcsUri) {
        try {
          await storageApi.deleteObject(storageApi.ref(storage, doc.jsonGcsUri));
        } catch (_) {
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

  async function handleRename(doc: WikiBetaLiveDocument) {
    if (!activeAccountId) {
      toast.error("目前沒有 active account，無法更名");
      return;
    }

    const nextName = window.prompt("請輸入新檔名", doc.filename)?.trim() ?? "";
    if (!nextName || nextName === doc.filename) return;

    setRenamingId(doc.id);
    try {
      const db = getFirebaseFirestore();
      const ref = firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id);
      await firestoreApi.updateDoc(ref, {
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

  async function handleViewOriginal(doc: WikiBetaLiveDocument) {
    if (!doc.sourceGcsUri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const fileRef = storageApi.ref(storage, doc.sourceGcsUri);
      const url = await storageApi.getDownloadURL(fileRef);
      window.open(url, "_blank", "noopener,noreferrer");
      appendLog(`開啟原始檔：${doc.filename}`);
    } catch (error) {
      console.error(error);
      toast.error("無法開啟原始檔");
      appendLog(`開啟原始檔失敗：${doc.filename}`);
    }
  }

  const filteredDocs = useMemo(() => {
    const merged = [...pendingDocs, ...docs.filter((doc) => !pendingDocs.some((pending) => pending.id === doc.id))];
    return sortByUploadedDesc(merged);
  }, [docs, pendingDocs, sortByUploadedDesc]);

  const statusSummary = useMemo(() => {
    return {
      total: filteredDocs.length,
      processing: filteredDocs.filter((item) => item.status === "processing").length,
      completed: filteredDocs.filter((item) => item.status === "completed").length,
      errors: filteredDocs.filter((item) => item.status === "error").length,
      ragReady: filteredDocs.filter((item) => item.ragStatus === "ready").length,
      ragError: filteredDocs.filter((item) => item.ragStatus === "error").length,
    };
  }, [filteredDocs]);

  const filteredReadyCount = useMemo(
    () => filteredDocs.filter((item) => item.ragStatus === "ready").length,
    [filteredDocs],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBack}>返回 Wiki Beta</Button>
        {showDocsSection ? (
          <Button variant="outline" onClick={() => void loadDocs()} disabled={loadingDocs}>
            {loadingDocs ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}刷新文件
          </Button>
        ) : null}
      </div>

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
          <CardDescription>拖曳或選擇檔案上傳到 account scope。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFileChange(event.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition ${
              dragging
                ? "border-primary/60 bg-primary/10"
                : "border-border/70 bg-muted/10 hover:border-primary/40"
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
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
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
            {` / docs: ${filteredDocs.length} 筆 / RAG ready: ${filteredReadyCount} 筆。`}
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
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      讀取中...
                    </td>
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
          <CardDescription>顯示上傳、監聽與 CRUD 操作紀錄。</CardDescription>
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
            文件列表目前使用 Firestore 即時監聽；如果監聽中斷可按上方「刷新文件」。
          </div>
        </CardContent>
      </Card>
      ) : null}
    </div>
  );
}
