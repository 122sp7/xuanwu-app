"use client";

/**
 * Module: dev-tools page — /dev-tools
 * Purpose: 測試 py_fn Firebase Functions (Document AI parse_document callable)。
 * Constraints: 僅限本地開發 / staging 驗證；勿在 production 導覽列顯示。
 */

import { useRef, useState } from "react";
import { FlaskConical, FileUp, Loader2, CheckCircle2, XCircle } from "lucide-react";

import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { Button } from "@ui-shadcn/ui/button";

// ── 常數 ─────────────────────────────────────────────────────────────────────

// 無需硬編碼 URL，改用 getFirebaseFunctions 搭配 region

// ── 型別 ─────────────────────────────────────────────────────────────────────

interface ParseResult {
  doc_id: string;
  page_count: number;
  text_preview: string;
}

type Status = "idle" | "uploading" | "parsing" | "done" | "error";

// ── 常數 ─────────────────────────────────────────────────────────────────────

const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif / .tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg / .jpeg",
};

const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

// ── 工具函式 ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // 去掉 "data:<mime>;base64," 前綴
      resolve(dataUrl.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });
}

// ── Page component ─────────────────────────────────────────────────────────

export default function DevToolsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function appendLog(msg: string) {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${msg}`]);
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

  async function handleParseViaCallable() {
    if (!selectedFile) return;

    setStatus("uploading");
    setResult(null);
    setErrorMsg(null);
    appendLog("將檔案轉為 base64…");

    try {
      const b64 = await fileToBase64(selectedFile);
      appendLog(`base64 完成，長度 ${b64.length} chars`);

      setStatus("parsing");
      appendLog("呼叫 parse_document (asia-southeast1)…");

      // 使用已初始化的 Firebase Functions instance
      const fns = getFirebaseFunctions("asia-southeast1");
      const parseDocument = functionsApi.httpsCallable<
        { content_b64: string; mime_type: string },
        ParseResult
      >(fns, "parse_document");

      const response = await parseDocument({
        content_b64: b64,
        mime_type: selectedFile.type,
      });

      appendLog("✅ 收到回應");
      setResult(response.data);
      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 錯誤：${msg}`);
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  function reset() {
    setSelectedFile(null);
    setResult(null);
    setErrorMsg(null);
    setStatus("idle");
    setLogs([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLoading = status === "uploading" || status === "parsing";

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
            py_fn · parse_document (Document AI · asia-southeast1)
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
          2. 執行解析
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={handleParseViaCallable}
            disabled={!selectedFile || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FlaskConical className="size-4" />
            )}
            {status === "uploading" ? "準備中…" : status === "parsing" ? "解析中…" : "呼叫 parse_document"}
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
              </dl>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">text_preview（前 200 字）</p>
                <pre className="max-h-40 overflow-y-auto rounded-lg bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap break-words">
                  {result.text_preview || "（空）"}
                </pre>
              </div>
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
