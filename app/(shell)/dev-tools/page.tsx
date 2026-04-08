"use client";

/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Workflow: 選取 → 上傳到 GCS → 呼叫 parse_document → 監聽 Firestore 狀態
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 *   Doc-list state and operations → useDevToolsDocList hook.
 *   Parsed-docs table → DevToolsParsedDocsSection component.
 */

import { useRef, useState, useEffect } from "react";
import {
  FlaskConical,
  FileUp,
  AlertCircle,
  FileText,
  Trash2,
  Code2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useApp } from "@/app/providers/app-provider";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { Button } from "@ui-shadcn/ui/button";
import {
  UPLOAD_BUCKET,
  WATCH_PATH,
  ACCEPTED_MIME,
  ACCEPTED_EXTS,
  asRecord,
  asString,
  asNumber,
  type ParseResult,
  type UploadStatus,
} from "./dev-tools-helpers";
import { StatusBadge, RagBadge } from "./dev-tools-badges";
import { useDevToolsDocList, formatDateTime } from "./use-dev-tools-doc-list";
import { DevToolsParsedDocsSection } from "./dev-tools-parsed-docs-section";

// ── Page component ─────────────────────────────────────────────────────────

export default function DevToolsPage() {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const activeWorkspaceId = appState.activeWorkspaceId ?? "";

  // ── Upload state ──────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ── Doc list + operations (extracted hook) ────────────────────────────────
  const {
    allDocs,
    selectedDocId,
    selectedDoc,
    jsonContent,
    jsonLoading,
    deletingId,
    reindexingId,
    handleViewOriginal,
    handleViewJson,
    handleDeleteDoc,
    handleManualProcess,
    closeJsonPreview,
    formatNormalizationRatio,
  } = useDevToolsDocList(activeAccountId);

  // Cleanup upload subscription on unmount
  useEffect(() => {
    return () => { if (unsubscribeRef.current) unsubscribeRef.current(); };
  }, []);

  function appendLog(msg: string) {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toISOString().split("T")[1]?.slice(0, 8)}] ${msg}`,
    ]);
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

  function buildUuidUploadPath(accountId: string, file: File) {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    const docId = crypto.randomUUID();
    return { uploadPath: `${WATCH_PATH}${accountId}/${docId}${ext}`, docId };
  }

  function watchDocument(docId: string) {
    if (!activeAccountId) {
      appendLog("❌ 缺少 active account，無法監聽文件狀態");
      return;
    }
    try {
      const db = getFirebaseFirestore();
      const docRef = firestoreApi.doc(db, "accounts", activeAccountId, "documents", docId);
      if (unsubscribeRef.current) unsubscribeRef.current();
      unsubscribeRef.current = firestoreApi.onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) { appendLog("等待 Firestore 初始化…"); return; }
        const data = asRecord(snapshot.data());
        const docStatus = asString(data.status, "unknown");
        appendLog(`Firestore update: status=${docStatus}`);
        if (docStatus === "completed") {
          const parsed = asRecord(data.parsed);
          const r: ParseResult = {
            doc_id: docId,
            status: "completed",
            page_count: asNumber(parsed.page_count) ?? 0,
            json_gcs_uri: asString(parsed.json_gcs_uri),
          };
          setResult(r);
          setStatus("done");
          appendLog(`✅ 解析完成：${asNumber(parsed.page_count) ?? 0} 頁`);
          if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
        } else if (docStatus === "error") {
          const error = asRecord(data.error);
          const msg = asString(error.message, "未知錯誤");
          setErrorMsg(msg);
          setStatus("error");
          appendLog(`❌ 錯誤：${msg}`);
          if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
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
      // Step 1: Upload to GCS
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const { uploadPath, docId } = buildUuidUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);
      const snap = await storageApi.uploadBytes(fileRef, selectedFile, {
        contentType: ACCEPTED_MIME[selectedFile.name.split(".").pop()?.toLowerCase() ?? ""] ?? "application/octet-stream",
        customMetadata: {
          account_id: activeAccountId,
          workspace_id: activeWorkspaceId,
          filename: selectedFile.name,
        },
      });
      appendLog(`✅ 上傳完成：${snap.ref.fullPath}`);
      // Step 2: Watch Firestore for status updates
      setStatus("waiting");
      appendLog("⏳ 等待 parse_document 處理…");
      watchDocument(docId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setStatus("error");
      appendLog(`❌ 上傳失敗：${msg}`);
    }
  }

  function reset() {
    if (unsubscribeRef.current) { unsubscribeRef.current(); unsubscribeRef.current = null; }
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLoading = status === "uploading" || status === "waiting";
  const parsedDocs = allDocs.filter((doc) => doc.status === "completed");
  const ragReadyCount = allDocs.filter((doc) => doc.rag_status === "ready").length;
  const ragErrorCount = allDocs.filter((doc) => doc.rag_status === "error").length;

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

      {/* ── Stats ──────────────────────────────────────────────────── */}
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
          2. 執行上傳 &amp; 解析
        </h2>
        <div className="flex gap-3">
          <Button onClick={handleUploadAndParse} disabled={!selectedFile || isLoading} className="gap-2">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <FlaskConical className="size-4" />}
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

      {/* ── All uploaded docs table ─────────────────────────────────── */}
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
                          <button
                            onClick={() => { void handleViewOriginal(doc); }}
                            disabled={!doc.gcs_uri}
                            title="查看原始檔案"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
                          >
                            <ExternalLink className="size-3.5" />
                          </button>
                          <button
                            onClick={() => { void handleViewJson(doc); }}
                            disabled={doc.status !== "completed" || !doc.json_gcs_uri}
                            title="查看 JSON 解析結果"
                            className={`inline-flex size-7 items-center justify-center rounded-md transition hover:bg-muted disabled:opacity-30 ${
                              selectedDocId === doc.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Code2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => { void handleDeleteDoc(doc); }}
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

            {/* JSON preview panel */}
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

      {/* ── Parsed docs table (extracted component) ─────────────────── */}
      <DevToolsParsedDocsSection
        parsedDocs={parsedDocs}
        reindexingId={reindexingId}
        onViewJson={(doc) => { void handleViewJson(doc); }}
        onManualProcess={(doc) => { void handleManualProcess(doc, appendLog); }}
        formatNormalizationRatio={formatNormalizationRatio}
      />

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
