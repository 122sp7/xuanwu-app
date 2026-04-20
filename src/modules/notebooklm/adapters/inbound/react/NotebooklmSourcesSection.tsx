"use client";

/**
 * NotebooklmSourcesSection — notebooklm.sources tab — document source list + upload.
 *
 * Manual Document AI pipeline controls:
 *   ① 上傳文件  — upload to Firebase Storage (fn Storage Trigger auto-runs parse+RAG)
 *   ② 解析文件  — manually trigger Layout/Form/OCR/Genkit-AI via callable
 *   ③ RAG 索引  — manually trigger RAG reindex via callable
 *   ④ 建立知識頁 — create Notion Knowledge Page from parsed document
 *   ⑤ 建立資料庫 — create Notion Database named after document (for Form Parser entities)
 *
 * Artifact display: page count, layout chunks, form entities, RAG vector count.
 */

import { Button } from "@packages";
import {
  Upload, RefreshCw, FileUp, ArrowRight, BookOpen, ListPlus,
  Eye, X, Loader2, ScanText, Database, FileText, ChevronDown, ChevronUp,
  Layers, Braces, BarChart2, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import type { DocumentSnapshot } from "../../../subdomains/document/domain/entities/Document";
import {
  queryDocumentsAction,
  registerUploadedDocumentAction,
  createPageFromDocumentAction,
  createDatabaseFromDocumentAction,
  parseDocumentAction,
  reindexDocumentAction,
} from "../server-actions/document-actions";
import {
  uploadDocumentToStorage,
  getDocumentDownloadUrl,
} from "../../../adapters/outbound/firebase-composition";

interface NotebooklmSourcesSectionProps {
  workspaceId: string;
  accountId: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: "已就緒",
  processing: "處理中",
  archived: "已封存",
  deleted: "已刪除",
};

/** MIME types renderable via Google Doc Viewer */
const PREVIEWABLE_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
  "image/tif",
]);

function googleDocViewerUrl(downloadUrl: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`;
}

// ── Per-document action state ─────────────────────────────────────────────────

type DocActionStatus = "idle" | "running" | "done" | "error";

interface DocActionState {
  parseLayout: DocActionStatus;
  parseForm: DocActionStatus;
  parseOcr: DocActionStatus;
  parseGenkit: DocActionStatus;
  index: DocActionStatus;
  reindex: DocActionStatus;
  page: DocActionStatus;
  database: DocActionStatus;
  message?: string;
  pageHref?: string;
  databaseHref?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotebooklmSourcesSection({
  workspaceId,
  accountId,
}: NotebooklmSourcesSectionProps): React.ReactElement {
  const [documents, setDocuments] = useState<DocumentSnapshot[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview state
  const [previewDoc, setPreviewDoc] = useState<DocumentSnapshot | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Per-document expanded / action state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<Record<string, DocActionState>>({});

  // JSON viewer modal state
  const [jsonViewer, setJsonViewer] = useState<{ doc: DocumentSnapshot; type: "layout" | "form" | "ocr" | "genkit" } | null>(null);

  const load = () => {
    startRefresh(async () => {
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
      setLoaded(true);
    });
  };

  // Auto-load on mount so sources are visible without a manual click.
  useEffect(() => { load(); }, [workspaceId, accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    startUpload(async () => {
      try {
        const path = await uploadDocumentToStorage(file, accountId, workspaceId);
        await registerUploadedDocumentAction({
          accountId,
          workspaceId,
          gcsPath: path,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        });
        const result = await queryDocumentsAction({ accountId, workspaceId });
        setDocuments(Array.isArray(result) ? result : []);
        setLoaded(true);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "上傳失敗，請稍後再試。",
        );
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const handlePreview = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setPreviewDoc(doc);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const url = await getDocumentDownloadUrl(doc.storageUrl);
      setPreviewUrl(url);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "無法取得預覽連結");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewDoc(null);
    setPreviewUrl(null);
    setPreviewError(null);
    setPreviewLoading(false);
  };

  // ── Per-document action helpers ─────────────────────────────────────────────

  const setDocAction = (docId: string, patch: Partial<DocActionState>) => {
    setActionState((prev) => {
      const current: DocActionState = prev[docId] ?? {
        parseLayout: "idle", parseForm: "idle", parseOcr: "idle", parseGenkit: "idle",
        index: "idle", reindex: "idle", page: "idle", database: "idle",
      };
      return { ...prev, [docId]: { ...current, ...patch } };
    });
  };

  const handleParseLayout = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setDocAction(doc.id, { parseLayout: "running", message: undefined });
    try {
      await parseDocumentAction({
        accountId,
        workspaceId,
        docId: doc.id,
        storageUrl: doc.storageUrl,
        filename: doc.name,
        mimeType: doc.mimeType || "application/pdf",
        sizeBytes: doc.sizeBytes,
        parser: "layout",
      });
      setDocAction(doc.id, { parseLayout: "done", message: "Layout Parser 解析完成（文字 + 語意分塊已儲存）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { parseLayout: "error", message: err instanceof Error ? err.message : "Layout Parser 解析失敗" });
    }
  };

  const handleParseForm = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setDocAction(doc.id, { parseForm: "running", message: undefined });
    try {
      await parseDocumentAction({
        accountId,
        workspaceId,
        docId: doc.id,
        storageUrl: doc.storageUrl,
        filename: doc.name,
        mimeType: doc.mimeType || "application/pdf",
        sizeBytes: doc.sizeBytes,
        parser: "form",
      });
      setDocAction(doc.id, { parseForm: "done", message: "Form Parser 解析完成（結構化欄位已儲存）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { parseForm: "error", message: err instanceof Error ? err.message : "Form Parser 解析失敗" });
    }
  };

  const handleParseOcr = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setDocAction(doc.id, { parseOcr: "running", message: undefined });
    try {
      await parseDocumentAction({
        accountId,
        workspaceId,
        docId: doc.id,
        storageUrl: doc.storageUrl,
        filename: doc.name,
        mimeType: doc.mimeType || "application/pdf",
        sizeBytes: doc.sizeBytes,
        parser: "ocr",
      });
      setDocAction(doc.id, { parseOcr: "done", message: "Document OCR 解析完成（OCR JSON 已儲存）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { parseOcr: "error", message: err instanceof Error ? err.message : "Document OCR 解析失敗" });
    }
  };

  const handleParseGenkit = async (doc: DocumentSnapshot) => {
    if (!doc.storageUrl) return;
    setDocAction(doc.id, { parseGenkit: "running", message: undefined });
    try {
      await parseDocumentAction({
        accountId,
        workspaceId,
        docId: doc.id,
        storageUrl: doc.storageUrl,
        filename: doc.name,
        mimeType: doc.mimeType || "application/pdf",
        sizeBytes: doc.sizeBytes,
        parser: "genkit",
      });
      setDocAction(doc.id, { parseGenkit: "done", message: "Genkit-AI 解析完成（Genkit JSON 已儲存）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { parseGenkit: "error", message: err instanceof Error ? err.message : "Genkit-AI 解析失敗" });
    }
  };

  const handleIndex = async (doc: DocumentSnapshot) => {
    if (!doc.id) return;
    if (!doc.parsedLayoutJsonGcsUri) {
      setDocAction(doc.id, { index: "error", message: "文件尚未完成 Layout Parser 解析，請先執行「解析文件(Layout Parser)」" });
      return;
    }
    setDocAction(doc.id, { index: "running", message: undefined });
    try {
      await reindexDocumentAction({ accountId, docId: doc.id, layoutJsonGcsUri: doc.parsedLayoutJsonGcsUri });
      setDocAction(doc.id, { index: "done", message: "RAG 索引建立完成（使用 Layout Parser 產出物）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { index: "error", message: err instanceof Error ? err.message : "建立索引失敗" });
    }
  };

  const handleReindex = async (doc: DocumentSnapshot) => {
    if (!doc.id) return;
    if (!doc.parsedLayoutJsonGcsUri) {
      setDocAction(doc.id, { reindex: "error", message: "文件尚未完成 Layout Parser 解析，請先執行「解析文件(Layout Parser)」" });
      return;
    }
    setDocAction(doc.id, { reindex: "running", message: undefined });
    try {
      await reindexDocumentAction({ accountId, docId: doc.id, layoutJsonGcsUri: doc.parsedLayoutJsonGcsUri });
      setDocAction(doc.id, { reindex: "done", message: "RAG 重建索引完成（使用 Layout Parser 產出物）" });
      const result = await queryDocumentsAction({ accountId, workspaceId });
      setDocuments(Array.isArray(result) ? result : []);
    } catch (err) {
      setDocAction(doc.id, { reindex: "error", message: err instanceof Error ? err.message : "重建索引失敗" });
    }
  };

  const handleCreatePage = async (doc: DocumentSnapshot) => {
    setDocAction(doc.id, { page: "running", message: undefined });
    try {
      const result = await createPageFromDocumentAction({
        accountId,
        workspaceId,
        documentId: doc.id,
        documentTitle: doc.name,
      });
      const href = result?.pageHref;
      setDocAction(doc.id, { page: "done", message: "知識頁已建立", pageHref: href ?? undefined });
    } catch (err) {
      setDocAction(doc.id, { page: "error", message: err instanceof Error ? err.message : "建立頁面失敗" });
    }
  };

  const handleCreateDatabase = async (doc: DocumentSnapshot) => {
    setDocAction(doc.id, { database: "running", message: undefined });
    try {
      await createDatabaseFromDocumentAction({
        accountId,
        workspaceId,
        documentTitle: doc.name,
      });
      const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;
      setDocAction(doc.id, { database: "done", message: "資料庫已建立", databaseHref: `${base}?tab=Database` });
    } catch (err) {
      setDocAction(doc.id, { database: "error", message: err instanceof Error ? err.message : "建立資料庫失敗" });
    }
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const isPending = isRefreshing || isUploading;
  const base = `/${encodeURIComponent(accountId)}/${encodeURIComponent(workspaceId)}`;
  const hasReadyDocs = documents.some((d) => d.status === "active");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">來源文件</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            <FileUp className={`size-3.5 ${isUploading ? "animate-pulse" : ""}`} />
            {isUploading ? "上傳中…" : "上傳文件"}
          </Button>
          <Button size="sm" variant="ghost" onClick={load} disabled={isPending}>
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            重新整理
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.tiff"
        onChange={handleFileChange}
      />

      {uploadError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {uploadError}
        </p>
      )}

      {!loaded && isRefreshing && (
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Loader2 className="size-3.5 animate-spin" />
          載入中…
        </p>
      )}

      {/* Processing chain banner */}
      {loaded && (
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-xs">
          <span className="shrink-0 text-muted-foreground font-medium">解析鏈：</span>
          <span className="shrink-0 rounded bg-orange-500/10 px-2 py-0.5 text-orange-600">① 上傳</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-sky-500/10 px-2 py-0.5 text-sky-600">② Layout Parser</span>
          <span className="shrink-0 rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-600 ml-0.5">+ Form Parser</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-purple-500/10 px-2 py-0.5 text-purple-600">③ RAG 索引</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600">④ 就緒</span>
          <ArrowRight className="size-3 shrink-0 text-muted-foreground/50" />
          <span className="shrink-0 rounded bg-amber-500/10 px-2 py-0.5 text-amber-600">⑤ Pages / DB</span>
        </div>
      )}

      {loaded && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">
          尚無來源文件。請點擊「上傳文件」，或直接上傳至
          <code className="mx-1 rounded bg-muted px-1 text-xs">
            uploads/{"{accountId}"}/{"{workspaceId}"}/
          </code>
          前綴，fn Storage Trigger 會自動處理。
        </p>
      )}

      {/* Document list */}
      {loaded && documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => {
            const state = actionState[doc.id];
            const isExpanded = expandedId === doc.id;
            const anyRunning = state && (
              state.parseLayout === "running" || state.parseForm === "running" ||
              state.parseOcr === "running" || state.parseGenkit === "running" ||
              state.index === "running" || state.reindex === "running" ||
              state.page === "running" || state.database === "running"
            );

            return (
              <li key={doc.id} className="rounded-lg border border-border/40 text-sm overflow-hidden">
                {/* Document header row */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-medium truncate max-w-[200px]">{doc.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.storageUrl && PREVIEWABLE_TYPES.has(doc.mimeType) && (
                      <Button
                        size="sm" variant="ghost" className="h-6 px-2 text-xs"
                        onClick={() => void handlePreview(doc)}
                      >
                        <Eye className="size-3 mr-1" />
                        預覽
                      </Button>
                    )}
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs ${
                        doc.status === "active"
                          ? "bg-green-500/10 text-green-600"
                          : doc.status === "processing"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : doc.status === "archived"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                      title={doc.status === "archived" && doc.errorMessage ? doc.errorMessage : undefined}
                    >
                      {doc.status === "archived" ? "解析失敗" : (STATUS_LABELS[doc.status] ?? doc.status)}
                    </span>
                    {/* Toggle actions panel */}
                    <Button
                      size="sm" variant="ghost" className="h-6 w-6 p-0"
                      aria-label={isExpanded ? "收起動作" : "展開動作"}
                      onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                    >
                      {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </Button>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 pb-1.5 text-xs text-muted-foreground">
                  <span>{doc.mimeType} · {(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                  {doc.parsedPageCount != null && (
                    <span className="flex items-center gap-0.5 text-sky-600">
                      <Layers className="size-3" />
                      {doc.parsedPageCount} 頁
                    </span>
                  )}
                  {doc.parsedLayoutChunkCount != null && (
                    <span className="flex items-center gap-0.5 text-sky-600">
                      <FileText className="size-3" />
                      Layout: {doc.parsedLayoutChunkCount} 塊
                    </span>
                  )}
                  {doc.parsedFormEntityCount != null && doc.parsedFormEntityCount > 0 && (
                    <span className="flex items-center gap-0.5 text-indigo-600">
                      <Braces className="size-3" />
                      Form: {doc.parsedFormEntityCount} 欄位
                    </span>
                  )}
                  {doc.ragChunkCount != null && (
                    <span className="flex items-center gap-0.5 text-purple-600">
                      <BarChart2 className="size-3" />
                      RAG: {doc.ragChunkCount} 塊 / {doc.ragVectorCount ?? 0} 向量
                    </span>
                  )}
                  {doc.errorMessage && doc.status === "archived" && (
                    <span className="text-red-500/80 truncate max-w-xs" title={doc.errorMessage}>
                      ⚠ {doc.errorMessage}
                    </span>
                  )}
                </div>

                {/* Expandable actions panel */}
                {isExpanded && (
                  <div className="border-t border-border/30 bg-muted/10 px-3 py-3 space-y-3">
                    {/* Section: Document AI parse */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Document AI 解析</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={!doc.storageUrl || state?.parseLayout === "running" || !!anyRunning}
                          onClick={() => void handleParseLayout(doc)}
                          title="使用 Layout Parser 解析文字結構、語意分塊，供 RAG 索引使用"
                        >
                          {state?.parseLayout === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <ScanText className="size-3 text-sky-600" />
                          )}
                          解析文件(Layout Parser)
                        </Button>
                        {(doc.parsedLayoutJsonGcsUri || state?.parseLayout === "done") && (
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full p-0.5 text-green-600 hover:bg-green-500/10 transition-colors"
                            title="Layout Parser 已解析 — 點擊查看 JSON 摘要"
                            onClick={() => setJsonViewer({ doc, type: "layout" })}
                            aria-label="查看 Layout Parser JSON"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={!doc.storageUrl || state?.parseForm === "running" || !!anyRunning}
                          onClick={() => void handleParseForm(doc)}
                          title="使用 Form Parser 萃取結構化欄位（表格、KV），供建立資料庫使用"
                        >
                          {state?.parseForm === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <Braces className="size-3 text-indigo-600" />
                          )}
                          解析文件(Form Parser)
                        </Button>
                        {(doc.parsedFormJsonGcsUri || state?.parseForm === "done") && (
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full p-0.5 text-green-600 hover:bg-green-500/10 transition-colors"
                            title="Form Parser 已解析 — 點擊查看 JSON 摘要"
                            onClick={() => setJsonViewer({ doc, type: "form" })}
                            aria-label="查看 Form Parser JSON"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={!doc.storageUrl || state?.parseOcr === "running" || !!anyRunning}
                          onClick={() => void handleParseOcr(doc)}
                          title="使用 OCR Processor 擷取掃描文件全文，供稠密 PDF 後續流程使用"
                        >
                          {state?.parseOcr === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <FileText className="size-3 text-emerald-600" />
                          )}
                          解析文件(Document OCR)
                        </Button>
                        {(doc.parsedOcrJsonGcsUri || state?.parseOcr === "done") && (
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full p-0.5 text-green-600 hover:bg-green-500/10 transition-colors"
                            title="Document OCR 已解析 — 點擊查看 JSON 摘要"
                            onClick={() => setJsonViewer({ doc, type: "ocr" })}
                            aria-label="查看 Document OCR JSON"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={!doc.storageUrl || state?.parseGenkit === "running" || !!anyRunning}
                          onClick={() => void handleParseGenkit(doc)}
                          title="使用 Genkit-AI 路徑產生可供後續 AI workflow 使用的 JSON 產出"
                        >
                          {state?.parseGenkit === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <ScanText className="size-3 text-fuchsia-600" />
                          )}
                          解析文件(Genkit-AI)
                        </Button>
                        {(doc.parsedGenkitJsonGcsUri || state?.parseGenkit === "done") && (
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full p-0.5 text-green-600 hover:bg-green-500/10 transition-colors"
                            title="Genkit-AI 已解析 — 點擊查看 JSON 摘要"
                            onClick={() => setJsonViewer({ doc, type: "genkit" })}
                            aria-label="查看 Genkit-AI JSON"
                          >
                            <CheckCircle2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section: RAG index — uses Layout Parser output */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        RAG 索引
                        <span className="ml-1 normal-case font-normal text-muted-foreground/70">（使用 Layout Parser 產出物）</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={state?.index === "running" || !!anyRunning}
                          onClick={() => void handleIndex(doc)}
                          title={doc.parsedLayoutJsonGcsUri ? "建立 RAG 向量索引" : "須先完成 Layout Parser 解析"}
                        >
                          {state?.index === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : state?.index === "done" ? (
                            <CheckCircle2 className="size-3 text-purple-600" />
                          ) : (
                            <RefreshCw className="size-3 text-purple-600" />
                          )}
                          建立 RAG 索引
                        </Button>
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={state?.reindex === "running" || !!anyRunning}
                          onClick={() => void handleReindex(doc)}
                          title={doc.parsedLayoutJsonGcsUri ? "重建 RAG 向量索引" : "須先完成 Layout Parser 解析"}
                        >
                          {state?.reindex === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : state?.reindex === "done" ? (
                            <CheckCircle2 className="size-3 text-orange-600" />
                          ) : (
                            <RefreshCw className="size-3 text-orange-600" />
                          )}
                          重建 RAG 索引
                        </Button>
                      </div>
                    </div>

                    {/* Section: Generate downstream artifacts */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">產出物生成</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={state?.page === "running" || !!anyRunning}
                          onClick={() => void handleCreatePage(doc)}
                          title="建立知識頁（使用 Layout Parser 產出物）"
                        >
                          {state?.page === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : state?.page === "done" ? (
                            <CheckCircle2 className="size-3 text-green-600" />
                          ) : (
                            <BookOpen className="size-3 text-sky-600" />
                          )}
                          建立知識頁 (Page)
                        </Button>
                        {state?.page === "done" && state.pageHref && (
                          <Link
                            href={state.pageHref}
                            className="inline-flex items-center gap-1 rounded border border-green-500/30 bg-green-500/5 px-2 py-1 text-xs text-green-700 hover:bg-green-500/10"
                          >
                            <ArrowRight className="size-3" />
                            前往頁面
                          </Link>
                        )}
                        <Button
                          size="sm" variant="outline" className="h-7 text-xs gap-1.5"
                          disabled={state?.database === "running" || !!anyRunning}
                          onClick={() => void handleCreateDatabase(doc)}
                          title="建立資料庫（使用 Form Parser 產出物）"
                        >
                          {state?.database === "running" ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : state?.database === "done" ? (
                            <CheckCircle2 className="size-3 text-green-600" />
                          ) : (
                            <Database className="size-3 text-indigo-600" />
                          )}
                          建立資料庫 (Database)
                        </Button>
                        {state?.database === "done" && state.databaseHref && (
                          <Link
                            href={state.databaseHref}
                            className="inline-flex items-center gap-1 rounded border border-green-500/30 bg-green-500/5 px-2 py-1 text-xs text-green-700 hover:bg-green-500/10"
                          >
                            <ArrowRight className="size-3" />
                            前往資料庫
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Action status message */}
                    {state?.message && (
                      <p className={`text-xs px-2 py-1 rounded ${
                        (state.parseLayout === "error" || state.parseForm === "error" || state.index === "error" || state.reindex === "error" || state.page === "error" || state.database === "error")
                          || state.parseOcr === "error" || state.parseGenkit === "error"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {state.message}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Downstream CTAs when documents are ready */}
      {loaded && hasReadyDocs && (
        <div className="flex flex-wrap gap-2 border-t border-border/30 pt-3">
          <p className="w-full text-xs text-muted-foreground">已就緒文件可用於：</p>
          <Link
            href={`${base}?tab=Notebook`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            RAG 查詢
          </Link>
          <Link
            href={`${base}?tab=Research`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs hover:bg-muted"
          >
            <BookOpen className="size-3.5" />
            研究合成
          </Link>
          <Link
            href={`${base}?tab=TaskFormation`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
          >
            <ListPlus className="size-3.5" />
            任務形成
          </Link>
        </div>
      )}

      {/* JSON viewer modal — parsed output summary */}
      {jsonViewer && (() => {
        const { doc: jDoc, type } = jsonViewer;
        const payload =
          type === "layout"
            ? {
                parser: "layout",
                documentId: jDoc.id,
                name: jDoc.name,
                parsedPageCount: jDoc.parsedPageCount ?? null,
                parsedLayoutChunkCount: jDoc.parsedLayoutChunkCount ?? null,
                parsedLayoutJsonGcsUri: jDoc.parsedLayoutJsonGcsUri ?? null,
              }
            : type === "form"
              ? {
                parser: "form",
                documentId: jDoc.id,
                name: jDoc.name,
                parsedFormEntityCount: jDoc.parsedFormEntityCount ?? null,
                parsedFormJsonGcsUri: jDoc.parsedFormJsonGcsUri ?? null,
              }
              : type === "ocr"
                ? {
                  parser: "ocr",
                  documentId: jDoc.id,
                  name: jDoc.name,
                  parsedOcrJsonGcsUri: jDoc.parsedOcrJsonGcsUri ?? null,
                }
                : {
                  parser: "genkit",
                  documentId: jDoc.id,
                  name: jDoc.name,
                  parsedGenkitJsonGcsUri: jDoc.parsedGenkitJsonGcsUri ?? null,
                };
        const title =
          type === "layout"
            ? "Layout Parser JSON 摘要"
            : type === "form"
              ? "Form Parser JSON 摘要"
              : type === "ocr"
                ? "Document OCR JSON 摘要"
                : "Genkit-AI JSON 摘要";
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setJsonViewer(null); }}
            onKeyDown={(e) => { if (e.key === "Escape") setJsonViewer(null); }}
          >
            <div className="relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <span className="text-sm font-medium">{title}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-xs">{jDoc.name}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setJsonViewer(null)} className="h-7 w-7 p-0">
                  <X className="size-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs text-foreground whitespace-pre-wrap break-all font-mono">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PDF / image preview overlay — Google Doc Viewer */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`預覽：${previewDoc.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}
          onKeyDown={(e) => { if (e.key === "Escape") closePreview(); }}
        >
          <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                <span className="text-sm font-medium truncate max-w-xs">{previewDoc.name}</span>
                <span className="text-xs text-muted-foreground">{previewDoc.mimeType}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={closePreview} className="h-7 w-7 p-0">
                <X className="size-4" />
              </Button>
            </div>
            <div className="relative flex-1 overflow-hidden">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {previewError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
                  <p className="text-sm text-destructive">{previewError}</p>
                  <Button size="sm" variant="outline" onClick={() => void handlePreview(previewDoc)}>
                    重試
                  </Button>
                </div>
              )}
              {previewUrl && (
                <iframe
                  src={googleDocViewerUrl(previewUrl)}
                  className="h-full w-full border-0"
                  title={`預覽：${previewDoc.name}`}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  ) as React.ReactElement;
}
