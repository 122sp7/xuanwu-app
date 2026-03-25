"use client";

/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Workflow: 選取 → 上傳到 GCS → 呼叫 parse_document → 監聽 Firestore 狀態
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 */

import { useRef, useState, useEffect } from "react";
import {
  FlaskConical,
  FileUp,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  Code2,
  ExternalLink,
} from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { Button } from "@ui-shadcn/ui/button";

// ── 型別 ─────────────────────────────────────────────────────────────────────

interface ParseResult {
  doc_id: string;
  status: "processing" | "completed" | "error";
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
}

interface DocRecord {
  id: string;
  status: "processing" | "completed" | "error" | string;
  filename: string;
  gcs_uri: string;
  uploaded_at: Date | null;
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
  rag_status?: string;
  rag_chunk_count?: number;
  rag_vector_count?: number;
  rag_raw_chars?: number;
  rag_normalized_chars?: number;
  rag_normalization_version?: string;
  rag_language_hint?: string;
  rag_error?: string;
}

type Status = "idle" | "uploading" | "waiting" | "done" | "error";

// ── 常數 ─────────────────────────────────────────────────────────────────────

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif / .tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg / .jpeg",
};

const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

function formatDateTime(value: Date | null): string {
  if (!value) return "—";
  return value.toLocaleString("zh-TW", { hour12: false });
}

function deriveJsonUri(gcsUri: string): string {
  if (!gcsUri.startsWith("gs://")) return "";
  const withoutPrefix = gcsUri.slice(5);
  const firstSlash = withoutPrefix.indexOf("/");
  if (firstSlash < 0) return "";

  const bucket = withoutPrefix.slice(0, firstSlash);
  const objectPath = withoutPrefix.slice(firstSlash + 1);
  if (!objectPath.startsWith("uploads/")) return "";

  const relativePath = objectPath.slice("uploads/".length);
  const dotIndex = relativePath.lastIndexOf(".");
  const stem = dotIndex > -1 ? relativePath.slice(0, dotIndex) : relativePath;
  return `gs://${bucket}/files/${stem}.json`;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function asDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }
  if (value && typeof value === "object" && "toDate" in value) {
    const candidate = (value as { toDate?: unknown }).toDate;
    if (typeof candidate === "function") {
      const converted = candidate();
      return converted instanceof Date ? converted : null;
    }
  }
  return null;
}

function mapSnapshotDoc(doc: { id: string; data: () => unknown }): DocRecord {
  const data = asRecord(doc.data());
  const source = asRecord(data.source);
  const parsed = asRecord(data.parsed);
  const rag = asRecord(data.rag);
  const err = asRecord(data.error);

  return {
    id: doc.id,
    status: asString(data.status, "unknown"),
    filename: asString(source.filename, doc.id),
    gcs_uri: asString(source.gcs_uri),
    uploaded_at: asDate(source.uploaded_at),
    page_count: asNumber(parsed.page_count),
    json_gcs_uri: asString(parsed.json_gcs_uri, deriveJsonUri(asString(source.gcs_uri))),
    error_message: asString(err.message) || undefined,
    rag_status: asString(rag.status) || undefined,
    rag_chunk_count: asNumber(rag.chunk_count),
    rag_vector_count: asNumber(rag.vector_count),
    rag_raw_chars: asNumber(rag.raw_chars),
    rag_normalized_chars: asNumber(rag.normalized_chars),
    rag_normalization_version: asString(rag.normalization_version) || undefined,
    rag_language_hint: asString(rag.language_hint) || undefined,
    rag_error: asString(rag.error) || undefined,
  };
}

function StatusBadge({ status, errorMessage }: { status: string; errorMessage?: string }) {
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
        title={errorMessage}
      >
        <XCircle className="size-3" /> 錯誤
      </span>
    );
  }
  return <span className="text-xs text-muted-foreground">{status || "—"}</span>;
}

function RagBadge({ status, error }: { status?: string; error?: string }) {
  if (status === "ready") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="size-3" /> RAG Ready
      </span>
    );
  }
  if (status === "error") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
        title={error}
      >
        <XCircle className="size-3" /> RAG Error
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
  return <span className="text-xs text-muted-foreground">—</span>;
}

// ── Page component ─────────────────────────────────────────────────────────

export default function DevToolsPage() {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [allDocs, setAllDocs] = useState<DocRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  // Firestore 監聽器 unsubscribe 函數
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribeListRef = useRef<(() => void) | null>(null);

  function closeJsonPreview() {
    setSelectedDocId(null);
    setJsonContent(null);
  }

  function appendLog(msg: string) {
    setLogs((prev) => [...prev, `[${new Date().toISOString().split("T")[1]?.slice(0, 8)}] ${msg}`]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (file) appendLog(`已選取：${file.name}（${(file.size / 1024).toFixed(1)} KB）`);
  }

  function buildUuidUploadPath(accountId: string, file: File): { uploadPath: string; docId: string } {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const docId = crypto.randomUUID();
    return {
      uploadPath: `${WATCH_PATH}${accountId}/${docId}${ext}`,
      docId,
    };
  }

  // 監聽 Firestore 文件狀態變化
  function watchDocument(docId: string) {
    if (!activeAccountId) {
      appendLog("❌ 缺少 active account，無法監聽文件狀態");
      return;
    }
    try {
      const db = getFirebaseFirestore();
      const docRef = firestoreApi.doc(db, "accounts", activeAccountId, "documents", docId);

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      unsubscribeRef.current = firestoreApi.onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          appendLog("等待 Firestore 初始化…");
          return;
        }

        const data = asRecord(snapshot.data());
        const docStatus = asString(data.status, "unknown");

        appendLog(`Firestore update: status=${docStatus}`);

        if (docStatus === "completed") {
          const parsed = asRecord(data.parsed);
          const result: ParseResult = {
            doc_id: docId,
            status: "completed",
            page_count: asNumber(parsed.page_count) ?? 0,
            json_gcs_uri: asString(parsed.json_gcs_uri),
          };
          setResult(result);
          setStatus("done");
          appendLog(`✅ 解析完成：${asNumber(parsed.page_count) ?? 0} 頁`);

          // 取消監聽
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } else if (docStatus === "error") {
          const error = asRecord(data.error);
          const msg = asString(error.message, "未知錯誤");
          setErrorMsg(msg);
          setStatus("error");
          appendLog(`❌ 錯誤：${msg}`);

          // 取消監聽
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 監聽失敗：${msg}`);
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  async function handleUploadAndParse() {
    if (!selectedFile) return;
    if (!activeAccountId) {
      setErrorMsg("缺少 active account，無法上傳與解析");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setResult(null);
    setErrorMsg(null);
    appendLog("📤 上傳檔案到 Cloud Storage…");

    try {
      // ── Step 1: Upload to GCS ────────────────────────────────────────
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const { uploadPath, docId } = buildUuidUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);

      appendLog(`GCS path: gs://${UPLOAD_BUCKET}/${uploadPath}`);
      appendLog(`doc_id(uuid): ${docId}`);

      await storageApi.uploadBytes(fileRef, selectedFile);
      appendLog(`✅ 上傳完成`);

      // ── Step 2: Watch Firestore for status updates ──────────────────
      setStatus("waiting");
      appendLog("🔍 已觸發 Storage pipeline，開始監聽 Firestore…");
      watchDocument(docId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 錯誤：${msg}`);
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  function reset() {
    // 取消 Firestore 監聽
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // 監聽所有已上傳文件列表
  useEffect(() => {
    if (!activeAccountId) {
      setAllDocs([]);
      return;
    }

    try {
      const db = getFirebaseFirestore();
      const colRef = firestoreApi.collection(db, "accounts", activeAccountId, "documents");
      unsubscribeListRef.current = firestoreApi.onSnapshot(colRef, (snapshot) => {
        const docs: DocRecord[] = snapshot.docs.map(mapSnapshotDoc);
        // 最新上傳在最上面
        docs.sort((a, b) => (b.uploaded_at?.getTime() ?? 0) - (a.uploaded_at?.getTime() ?? 0));
        setAllDocs(docs);
      });
    } catch (_) {}
    return () => {
      unsubscribeListRef.current?.();
    };
  }, [activeAccountId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  async function handleViewOriginal(doc: DocRecord) {
    if (!doc.gcs_uri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const fileRef = storageApi.ref(storage, doc.gcs_uri);
      const url = await storageApi.getDownloadURL(fileRef);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      alert(`無法取得下載連結：${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async function handleViewJson(doc: DocRecord) {
    if (!doc.json_gcs_uri) return;
    if (selectedDocId === doc.id && jsonContent !== null) {
      closeJsonPreview();
      return;
    }
    setSelectedDocId(doc.id);
    setJsonContent(null);
    setJsonLoading(true);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const jsonRef = storageApi.ref(storage, doc.json_gcs_uri);
      const url = await storageApi.getDownloadURL(jsonRef);
      const res = await fetch(url);
      const text = await res.text();
      setJsonContent(text);
    } catch (err: unknown) {
      setJsonContent(`// 載入失敗：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setJsonLoading(false);
    }
  }

  async function handleDeleteDoc(doc: DocRecord) {
    if (!window.confirm(`確定刪除「${doc.filename}」？\n此操作將同時刪除 Firestore 記錄與 GCS 檔案，無法復原。`)) return;
    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const db = getFirebaseFirestore();
      // 刪除 GCS 原始檔案
      if (doc.gcs_uri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.gcs_uri)); } catch (_) {}
      }
      // 刪除 GCS JSON
      if (doc.json_gcs_uri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.json_gcs_uri)); } catch (_) {}
      }
      // 刪除 Firestore 記錄
      if (!activeAccountId) {
        throw new Error("缺少 active account");
      }
      await firestoreApi.deleteDoc(firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id));
      // 若正在預覽此文件，清除預覽
      if (selectedDocId === doc.id) {
        closeJsonPreview();
      }
    } catch (err: unknown) {
      alert(`刪除失敗：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleManualProcess(doc: DocRecord) {
    if (!doc.json_gcs_uri) return;
    if (!activeAccountId) {
      alert("缺少 active account，無法手動整理");
      return;
    }
    setReindexingId(doc.id);
    appendLog(`🧹 手動整理開始：${doc.id}`);
    try {
      const functions = getFirebaseFunctions("asia-southeast1");
      const callable = functionsApi.httpsCallable(functions, "rag_reindex_document");
      await callable({
        account_id: activeAccountId,
        doc_id: doc.id,
        json_gcs_uri: doc.json_gcs_uri,
        source_gcs_uri: doc.gcs_uri,
        filename: doc.filename,
        page_count: doc.page_count ?? 0,
      });
      appendLog(`✅ 手動整理完成：${doc.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 手動整理失敗：${msg}`);
      alert(`手動整理失敗：${msg}`);
    } finally {
      setReindexingId(null);
    }
  }

  const isLoading = status === "uploading" || status === "waiting";
  const parsedDocs = allDocs.filter((doc) => doc.status === "completed");
  const ragReadyCount = allDocs.filter((doc) => doc.rag_status === "ready").length;
  const ragErrorCount = allDocs.filter((doc) => doc.rag_status === "error").length;

  const selectedDoc = selectedDocId ? allDocs.find((d) => d.id === selectedDocId) : null;

  function formatNormalizationRatio(doc: DocRecord): string {
    const raw = doc.rag_raw_chars ?? 0;
    const normalized = doc.rag_normalized_chars ?? 0;
    if (raw <= 0 || normalized <= 0) return "—";
    const ratio = (normalized / raw) * 100;
    return `${normalized.toLocaleString()} / ${raw.toLocaleString()} (${ratio.toFixed(1)}%)`;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10">
          <FlaskConical className="size-5 text-amber-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dev Tools</h1>
          <p className="text-xs text-muted-foreground">
            py_fn · parse_document · Document AI · Firestore 實時監聽
          </p>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-card px-3 py-2">
          <p className="text-[11px] text-muted-foreground">全部文件</p>
          <p className="text-lg font-semibold tracking-tight">{allDocs.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <p className="text-[11px] text-emerald-700">解析完成</p>
          <p className="text-lg font-semibold tracking-tight text-emerald-700">{parsedDocs.length}</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2">
          <p className="text-[11px] text-blue-700">RAG Ready</p>
          <p className="text-lg font-semibold tracking-tight text-blue-700">{ragReadyCount}</p>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
          <p className="text-[11px] text-destructive">RAG Error</p>
          <p className="text-lg font-semibold tracking-tight text-destructive">{ragErrorCount}</p>
        </div>
      </section>

      {/* ── File picker ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          1. 選擇檔案
        </h2>
        <label
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition
            ${selectedFile ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"}`}
        >
          <FileUp className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "點擊或拖曳上傳"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">支援：{ACCEPTED_EXTS}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={Object.keys(ACCEPTED_MIME).join(",")}
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </section>

      {/* ── Actions ────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          2. 執行上傳 & 解析
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={handleUploadAndParse}
            disabled={!selectedFile || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FlaskConical className="size-4" />
            )}
            {status === "uploading" ? "上傳中…" : status === "waiting" ? "等待中…" : "開始"}
          </Button>
          <Button variant="outline" onClick={reset} disabled={isLoading}>
            重置
          </Button>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────── */}
      {(status === "done" || status === "error") && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            3. 結果
          </h2>
          {status === "done" && result && (
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="text-sm font-medium">解析成功</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">doc_id</dt>
                <dd className="font-mono text-xs">{result.doc_id}</dd>
                <dt className="text-muted-foreground">page_count</dt>
                <dd className="font-bold">{result.page_count}</dd>
                <dt className="text-muted-foreground">JSON 位置</dt>
                <dd className="font-mono text-xs break-all">{result.json_gcs_uri || "—"}</dd>
              </dl>
            </div>
          )}
          {status === "error" && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </section>
      )}

      {status === "waiting" && (
        <section className="space-y-3">
          <div className="flex items-start gap-2 rounded-xl border border-blue-300/30 bg-blue-500/5 p-4 text-sm text-blue-600">
            <AlertCircle className="mt-0.5 size-4 shrink-0 animate-pulse" />
            <div>
              <p className="font-medium">處理中…</p>
              <p className="mt-1 text-xs opacity-75">Document AI 正在解析檔案，請稍候</p>
            </div>
          </div>
        </section>
      )}

      {/* ── 已上傳檔案列表 ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            已上傳檔案（{allDocs.length}）
          </h2>
        </div>
        {allDocs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            尚無上傳記錄
          </p>
        ) : (
          <div className="space-y-0 overflow-hidden rounded-xl border border-border/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">狀態</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">上傳時間</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {allDocs.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-border/40 last:border-0 transition-colors ${
                      selectedDocId === doc.id
                        ? "bg-primary/8 ring-1 ring-inset ring-primary/20"
                        : i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs max-w-[180px] truncate" title={doc.filename}>
                      {doc.filename}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={doc.status} errorMessage={doc.error_message} />
                    </td>
                    <td className="px-4 py-2.5">
                      <RagBadge status={doc.rag_status} error={doc.rag_error} />
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {doc.page_count != null ? doc.page_count : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(doc.uploaded_at)}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* 查看原始檔案 */}
                        <button
                          onClick={() => handleViewOriginal(doc)}
                          disabled={!doc.gcs_uri}
                          title="查看原始檔案"
                          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                        >
                          <ExternalLink className="size-3.5" />
                        </button>
                        {/* 查看 JSON */}
                        <button
                          onClick={() => handleViewJson(doc)}
                          disabled={doc.status !== "completed" || !doc.json_gcs_uri}
                          title="查看 JSON 解析結果"
                          className={`inline-flex size-7 items-center justify-center rounded-md transition hover:bg-muted disabled:opacity-30 ${
                            selectedDocId === doc.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Code2 className="size-3.5" />
                        </button>
                        {/* 刪除 */}
                        <button
                          onClick={() => handleDeleteDoc(doc)}
                          disabled={deletingId === doc.id}
                          title="刪除"
                          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                        >
                          {deletingId === doc.id
                            ? <Loader2 className="size-3.5 animate-spin" />
                            : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            {/* ── JSON 預覽面板 ──────────────────────────────────── */}
            {selectedDocId && (
              <div className="border-t border-border/60 bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <Code2 className="size-3.5" />
                    <span className="font-mono">
                      {selectedDoc?.filename ?? selectedDocId} — JSON
                    </span>
                  </div>
                  <button
                    onClick={closeJsonPreview}
                    className="text-white/30 hover:text-white/70 transition text-xs"
                  >
                    ✕ 關閉
                  </button>
                </div>
                {selectedDoc?.rag_status === "error" && (
                  <div className="border-b border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                    RAG 失敗：{selectedDoc.rag_error || "未知錯誤"}
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto p-4">
                  {jsonLoading ? (
                    <div className="flex items-center gap-2 text-green-400/60 text-xs">
                      <Loader2 className="size-3.5 animate-spin" /> 載入中…
                    </div>
                  ) : (
                    <pre className="font-mono text-xs leading-relaxed text-green-400 whitespace-pre-wrap break-words">
                      {jsonContent}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 已解析檔案列表（status=completed）──────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            已解析檔案（{parsedDocs.length}）
          </h2>
        </div>
        {parsedDocs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            尚無解析完成檔案
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-emerald-500/20">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-emerald-500/10 bg-emerald-500/5">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Chunks / Vectors</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Normalization</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">版本 / 語系</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">JSON</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">完成時間</th>
                </tr>
              </thead>
              <tbody>
                {parsedDocs.map((doc, i) => (
                  <tr key={`parsed-${doc.id}`} className={`border-b border-border/30 last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <td className="px-4 py-2.5 font-mono text-xs max-w-[220px] truncate" title={doc.filename}>
                      {doc.filename}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium">{doc.page_count ?? "—"}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <RagBadge status={doc.rag_status} error={doc.rag_error} />
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_chunk_count ?? 0).toLocaleString()} / {(doc.rag_vector_count ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {formatNormalizationRatio(doc)}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_normalization_version || "—").toUpperCase()} / {(doc.rag_language_hint || "—").toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 text-xs max-w-[320px]">
                      {doc.json_gcs_uri ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewJson(doc)}
                            className="font-mono text-left truncate text-primary hover:underline"
                            title={doc.json_gcs_uri}
                          >
                            {doc.json_gcs_uri}
                          </button>
                          <button
                            onClick={() => handleManualProcess(doc)}
                            disabled={reindexingId === doc.id}
                            title="手動整理（Normalization + RAG）"
                            className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 px-2 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                          >
                            {reindexingId === doc.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <FlaskConical className="size-3" />
                            )}
                            手動整理
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(doc.uploaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ── Console log ────────────────────────────────────────────── */}
      {logs.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Console
          </h2>
          <div className="max-h-48 overflow-y-auto rounded-xl bg-[#0d1117] p-4">
            {logs.map((line, i) => (
              <p key={i} className="font-mono text-xs leading-relaxed text-green-400">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
