"use client";

/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Workflow: 選取 → 上傳到 GCS → 呼叫 parse_document → 監聽 Firestore 狀態
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 */

import { useRef, useState, useEffect } from "react";
import { FlaskConical, FileUp, Loader2, CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";

import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
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
  uploaded_at: Date | null;
  page_count?: number;
  json_gcs_uri?: string;
  error_message?: string;
}

type Status = "idle" | "uploading" | "waiting" | "done" | "error";

// ── 常數 ─────────────────────────────────────────────────────────────────────

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const PARSED_RESULTS_COLLECTION = "parsed_documents";

const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif / .tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg / .jpeg",
};

const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

// ── Page component ─────────────────────────────────────────────────────────

export default function DevToolsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [allDocs, setAllDocs] = useState<DocRecord[]>([]);

  // Firestore 監聽器 unsubscribe 函數
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const unsubscribeListRef = useRef<(() => void) | null>(null);

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

  // 監聽 Firestore 文件狀態變化
  function watchDocument(docId: string) {
    try {
      const db = getFirebaseFirestore();
      const docRef = firestoreApi.doc(db, PARSED_RESULTS_COLLECTION, docId);

      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      unsubscribeRef.current = firestoreApi.onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          appendLog("等待 Firestore 初始化…");
          return;
        }

        const data = snapshot.data() as any;
        const docStatus = data?.status || "unknown";

        appendLog(`Firestore update: status=${docStatus}`);

        if (docStatus === "completed") {
          const parsed = data?.parsed || {};
          const result: ParseResult = {
            doc_id: docId,
            status: "completed",
            page_count: parsed.page_count || 0,
            json_gcs_uri: parsed.json_gcs_uri || "",
          };
          setResult(result);
          setStatus("done");
          appendLog(`✅ 解析完成：${parsed.page_count} 頁`);

          // 取消監聽
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
        } else if (docStatus === "error") {
          const error = data?.error || {};
          const msg = error.message || "未知錯誤";
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

    setStatus("uploading");
    setResult(null);
    setErrorMsg(null);
    appendLog("📤 上傳檔案到 Cloud Storage…");

    try {
      // ── Step 1: Upload to GCS ────────────────────────────────────────
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const uploadPath = `${WATCH_PATH}${Date.now()}-${selectedFile.name}`;
      const fileRef = storageApi.ref(storage, uploadPath);

      appendLog(`GCS path: gs://${UPLOAD_BUCKET}/${uploadPath}`);

      await storageApi.uploadBytes(fileRef, selectedFile);
      appendLog(`✅ 上傳完成`);

      // ── Step 2: Call parse_document with GCS URI ───────────────────
      const gcsUri = `gs://${UPLOAD_BUCKET}/${uploadPath}`;
      setStatus("waiting");
      appendLog("🔍 呼叫 parse_document callable…");

      const fns = getFirebaseFunctions("asia-southeast1");
      const parseDocument = functionsApi.httpsCallable<
        { gcs_uri: string; size_bytes?: number },
        { doc_id: string; status: string }
      >(fns, "parse_document");

      const response = await parseDocument({
        gcs_uri: gcsUri,
        size_bytes: selectedFile.size,
      });

      const docId = response.data.doc_id;
      appendLog(`📝 doc_id=${docId}, 開始監聽 Firestore…`);

      // ── Step 3: Watch Firestore for status updates ──────────────────
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
    try {
      const db = getFirebaseFirestore();
      const colRef = firestoreApi.collection(db, PARSED_RESULTS_COLLECTION);
      unsubscribeListRef.current = firestoreApi.onSnapshot(colRef, (snapshot) => {
        const docs: DocRecord[] = snapshot.docs.map((doc) => {
          const d = doc.data() as any;
          const src = d?.source || {};
          const parsed = d?.parsed || {};
          const err = d?.error || {};
          return {
            id: doc.id,
            status: d?.status || "unknown",
            filename: src.filename || doc.id,
            uploaded_at: src.uploaded_at?.toDate?.() ?? null,
            page_count: parsed.page_count,
            json_gcs_uri: parsed.json_gcs_uri,
            error_message: err.message,
          };
        });
        // 最新上傳在最上面
        docs.sort((a, b) => (b.uploaded_at?.getTime() ?? 0) - (a.uploaded_at?.getTime() ?? 0));
        setAllDocs(docs);
      });
    } catch (_) {}
    return () => {
      unsubscribeListRef.current?.();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const isLoading = status === "uploading" || status === "waiting";

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
          <div className="overflow-hidden rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">狀態</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">上傳時間</th>
                </tr>
              </thead>
              <tbody>
                {allDocs.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-border/40 last:border-0 ${
                      i % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs max-w-[200px] truncate" title={doc.filename}>
                      {doc.filename}
                    </td>
                    <td className="px-4 py-2.5">
                      {doc.status === "completed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="size-3" /> 完成
                        </span>
                      )}
                      {doc.status === "processing" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                          <Loader2 className="size-3 animate-spin" /> 處理中
                        </span>
                      )}
                      {doc.status === "error" && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                          title={doc.error_message}
                        >
                          <XCircle className="size-3" /> 錯誤
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {doc.page_count != null ? doc.page_count : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {doc.uploaded_at
                        ? doc.uploaded_at.toLocaleString("zh-TW", { hour12: false })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
