"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileUp, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Textarea } from "@ui-shadcn/ui/textarea";
import {
  listWikiBetaParsedDocuments,
  reindexWikiBetaDocument,
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

export function WikiBetaRagTestView({ onBack, mode = "all", workspaceId }: WikiBetaRagTestViewProps) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const showQueryCard = mode === "all" || mode === "query";
  const showReindexCard = mode === "all" || mode === "reindex";
  const showDocumentsCard = mode === "documents";
  const showDocsSection = showReindexCard || showDocumentsCard;

  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("4");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<WikiBetaCitation[]>([]);
  const [cacheMode, setCacheMode] = useState<"hit" | "miss">("miss");
  const [vectorHits, setVectorHits] = useState(0);
  const [searchHits, setSearchHits] = useState(0);
  const [accountScope, setAccountScope] = useState("(未查詢)");

  const [docs, setDocs] = useState<WikiBetaParsedDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [reindexingId, setReindexingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const loadDocs = useCallback(async () => {
    if (!activeAccountId) {
      setDocs([]);
      setLoadingDocs(false);
      return;
    }

    setLoadingDocs(true);
    try {
      const result = await listWikiBetaParsedDocuments(activeAccountId, 25);
      setDocs(result);
    } catch (error) {
      console.error(error);
      toast.error("讀取文件列表失敗");
    } finally {
      setLoadingDocs(false);
    }
  }, [activeAccountId]);

  useEffect(() => {
    void loadDocs();
  }, [loadDocs]);

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
    } catch (error) {
      console.error(error);
      toast.error("呼叫 rag_query 失敗");
    } finally {
      setLoadingAnswer(false);
    }
  }

  async function handleReindex(doc: WikiBetaParsedDocument) {
    if (!doc.jsonGcsUri) {
      toast.error("此文件尚無 json_gcs_uri，無法重整");
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
      toast.success("已觸發手動重整");
      await loadDocs();
    } catch (error) {
      console.error(error);
      toast.error("觸發 rag_reindex_document 失敗");
    } finally {
      setReindexingId(null);
    }
  }

  function buildUploadPath(accountId: string, file: File): string {
    const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
    return `${WATCH_PATH}${accountId}/${crypto.randomUUID()}${ext}`;
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
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const uploadPath = buildUploadPath(activeAccountId, selectedFile);
      const fileRef = storageApi.ref(storage, uploadPath);

      await storageApi.uploadBytes(fileRef, selectedFile, {
        customMetadata: {
          account_id: activeAccountId,
          ...(workspaceId ? { workspace_id: workspaceId } : {}),
        },
      });

      toast.success("上傳成功，背景已開始解析與入庫");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadDocs();
    } catch (error) {
      console.error(error);
      toast.error("上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  const filteredDocs = useMemo(() => {
    if (!workspaceId) return docs;
    return docs.filter((item) => item.workspaceId === workspaceId);
  }, [docs, workspaceId]);
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
          <CardDescription>
            拖曳或選擇檔案上傳到 account scope
            {workspaceId ? `（workspace: ${workspaceId}）` : "（全部 workspace 可見）"}。
          </CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>{showDocumentsCard ? "Documents 檢視" : "文件重整"}</CardTitle>
          <CardDescription>
            account: {activeAccountId || "(未選擇)"}
            {workspaceId ? ` / workspace: ${workspaceId}` : ""}
            {` / docs: ${filteredDocs.length} 筆 / RAG ready: ${filteredReadyCount} 筆。`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDocs ? (
            <p className="text-sm text-muted-foreground">讀取中...</p>
          ) : filteredDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {workspaceId ? "此工作區目前沒有可用文件。" : "目前沒有可用文件。"}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{doc.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      status={doc.status} / rag={doc.ragStatus || "-"} / pages={doc.pageCount} / {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleReindex(doc)}
                    disabled={
                      showDocumentsCard ||
                      reindexingId === doc.id ||
                      !doc.jsonGcsUri ||
                      !activeAccountId
                    }
                  >
                    {reindexingId === doc.id ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    {showDocumentsCard ? "僅檢視" : "手動重整"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      ) : null}
    </div>
  );
}
