"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { DEV_DEMO_ACCOUNT_EMAIL } from "@/app/providers/dev-demo-auth";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Button } from "@ui-shadcn/ui/button";
import { runWikiRagQuery, type WikiCitation } from "../../api";
import { useDocumentsSnapshot } from "@/modules/source/api";
import { getErrorMessage } from "./rag-status-badges";
import { RagUploadPanel, ACCEPTED_MIME, ACCEPTED_EXTS } from "./rag-upload-panel";
import { RagDocumentTable } from "./rag-document-table";
import { RagQueryCard } from "./RagQueryCard";
import { useDocumentOperations } from "../hooks/useDocumentOperations";

interface WikiRagViewProps {
  readonly onBack: () => void;
  readonly mode?: "all" | "query" | "reindex" | "documents";
  readonly workspaceId?: string;
  readonly showBackButton?: boolean;
}

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";

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

  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const appendLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString("zh-TW", { hour12: false });
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 100));
  }, []);

  const { deletingId, renamingId, handleDelete, handleRename, handleViewOriginal } =
    useDocumentOperations({ activeAccountId, appendLog });

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
        <RagQueryCard
          query={query}
          topK={topK}
          loading={loadingAnswer}
          answer={answer}
          citations={citations}
          cacheMode={cacheMode}
          accountScope={accountScope}
          vectorHits={vectorHits}
          searchHits={searchHits}
          onQueryChange={setQuery}
          onTopKChange={setTopK}
          onAsk={() => void handleAsk()}
        />
      ) : null}

      {showDocsSection ? (
        <RagUploadPanel
          effectiveWorkspaceId={effectiveWorkspaceId}
          activeAccountId={activeAccountId}
          uploading={uploading}
          selectedFile={selectedFile}
          dragging={dragging}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onUpload={() => void handleUpload()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); handleFileChange(event.dataTransfer.files?.[0] ?? null); }}
          onClearFile={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
        />
      ) : null}

      {showDocsSection ? (
        <RagDocumentTable
          activeAccountId={activeAccountId}
          effectiveWorkspaceId={effectiveWorkspaceId}
          loadingDocs={loadingDocs}
          filteredDocs={filteredDocs}
          filteredReadyCount={filteredReadyCount}
          statusSummary={statusSummary}
          deletingId={deletingId}
          renamingId={renamingId}
          logs={logs}
          onDelete={(doc) => void handleDelete(doc)}
          onRename={(doc) => void handleRename(doc)}
          onViewOriginal={(doc) => void handleViewOriginal(doc)}
          onClearLogs={() => setLogs([])}
        />
      ) : null}
    </div>
  );
}
