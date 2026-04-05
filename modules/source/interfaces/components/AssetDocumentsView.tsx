"use client";

import { useRef, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileUp,
  Loader2,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import type { AssetLiveDocument } from "../hooks/useDocumentsSnapshot";
import { useDocumentsSnapshot } from "../hooks/useDocumentsSnapshot";

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};
const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

function StatusBadge({ doc }: { doc: AssetLiveDocument }) {
  if (doc.status === "completed") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
        <CheckCircle2 className="size-3" /> ✓ ready
      </Badge>
    );
  }
  if (doc.status === "processing") {
    return (
      <Badge variant="outline" className="gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700">
        <Loader2 className="size-3 animate-spin" /> ⏳ processing
      </Badge>
    );
  }
  if (doc.status === "error") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-destructive/40 bg-destructive/10 text-destructive"
        title={doc.errorMessage || "未知錯誤"}
      >
        <XCircle className="size-3" /> ✗ error
      </Badge>
    );
  }
  return <Badge variant="outline">{doc.status || "unknown"}</Badge>;
}

function RagBadge({ doc }: { doc: AssetLiveDocument }) {
  if (doc.ragStatus === "ready") {
    return (
      <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700">
        <CheckCircle2 className="size-3" /> indexed
      </Badge>
    );
  }
  if (doc.ragStatus === "error") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-destructive/40 bg-destructive/10 text-destructive"
        title={doc.ragError || "未知錯誤"}
      >
        <XCircle className="size-3" /> rag error
      </Badge>
    );
  }
  if (doc.ragStatus) {
    return (
      <Badge variant="outline" className="gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700">
        <Loader2 className="size-3 animate-spin" /> {doc.ragStatus}
      </Badge>
    );
  }
  return <span className="text-xs text-muted-foreground">-</span>;
}

function formatDate(value: Date | null): string {
  if (!value) return "-";
  return value.toLocaleString("zh-TW", { hour12: false });
}

interface SourceDocumentsViewProps {
  readonly workspaceId?: string;
}

/** Upload dropzone + real-time document list backed by Firebase onSnapshot. */
export function SourceDocumentsView({ workspaceId }: SourceDocumentsViewProps) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() ?? "";

  const { docs, loading, pendingDocs, addPending } = useDocumentsSnapshot(
    activeAccountId,
    effectiveWorkspaceId || undefined,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allDocs = [
    ...pendingDocs,
    ...docs.filter((d) => !pendingDocs.some((p) => p.id === d.id)),
  ].sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));

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

    const ext = selectedFile.name.includes(".") ? `.${selectedFile.name.split(".").pop() ?? ""}` : "";
    const docId = crypto.randomUUID();
    const uploadPath = `${WATCH_PATH}${activeAccountId}/${docId}${ext}`;

    setUploading(true);
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

    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const fileRef = storageApi.ref(storage, uploadPath);
      const customMetadata: Record<string, string> = {
        account_id: activeAccountId,
        filename: selectedFile.name,
        original_filename: selectedFile.name,
        display_name: selectedFile.name,
      };
      if (effectiveWorkspaceId) customMetadata.workspace_id = effectiveWorkspaceId;
      await storageApi.uploadBytes(fileRef, selectedFile, { customMetadata });
      toast.success("上傳成功，背景已開始解析與入庫");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: AssetLiveDocument) {
    if (!activeAccountId) return;
    if (!window.confirm(`確定刪除「${doc.filename}」？此動作無法復原。`)) return;

    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      for (const uri of [doc.sourceGcsUri, doc.jsonGcsUri].filter(Boolean)) {
        try { await storageApi.deleteObject(storageApi.ref(storage, uri)); } catch { /* ignore */ }
      }
      const db = getFirebaseFirestore();
      await firestoreApi.deleteDoc(firestoreApi.doc(db, "accounts", activeAccountId, "documents", doc.id));
      toast.success("文件已刪除");
    } catch (error) {
      console.error(error);
      toast.error("刪除失敗");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRename(doc: AssetLiveDocument) {
    if (!activeAccountId) return;
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
    } catch (error) {
      console.error(error);
      toast.error("更名失敗");
    } finally {
      setRenamingId(null);
    }
  }

  async function handleViewOriginal(doc: AssetLiveDocument) {
    if (!doc.sourceGcsUri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const url = await storageApi.getDownloadURL(storageApi.ref(storage, doc.sourceGcsUri));
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("無法開啟原始檔");
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload dropzone */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            {effectiveWorkspaceId
              ? `拖曳或選擇檔案上傳到 workspace：${effectiveWorkspaceId}`
              : "拖曳或選擇檔案上傳到 account scope；workspace 視角為選填。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileChange(e.dataTransfer.files?.[0] ?? null); }}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition ${
              dragging
                ? "border-primary/60 bg-primary/10"
                : "border-border/70 bg-muted/10 hover:border-primary/40"
            }`}
          >
            <FileUp className="size-7 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "點擊或拖曳上傳"}
              </p>
              <p className="text-xs text-muted-foreground">支援：{ACCEPTED_EXTS}</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={Object.keys(ACCEPTED_MIME).join(",")}
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => void handleUpload()}
              disabled={uploading || !selectedFile || !activeAccountId}
            >
              {uploading && <Loader2 className="mr-2 size-4 animate-spin" />}
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

      {/* Document list */}
      <Card>
        <CardHeader>
          <CardTitle>文件列表</CardTitle>
          <CardDescription>
            {effectiveWorkspaceId
              ? `workspace: ${effectiveWorkspaceId} — ${allDocs.length} 筆`
              : `account 全覽 — ${allDocs.length} 筆`}
            （即時更新）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">狀態</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">上傳時間</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {loading && allDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      讀取中...
                    </td>
                  </tr>
                ) : allDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">
                      目前沒有文件，試著上傳第一份檔案 ↑
                    </td>
                  </tr>
                ) : (
                  allDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-border/40 last:border-0">
                      <td className="px-3 py-2.5">
                        <p className="truncate font-medium text-foreground" title={doc.filename}>
                          {doc.filename}
                          {doc.isClientPending && (
                            <span className="ml-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-700">
                              pending
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge doc={doc} />
                      </td>
                      <td className="px-3 py-2.5">
                        <RagBadge doc={doc} />
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </td>
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
                            {renamingId === doc.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Pencil className="size-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(doc)}
                            disabled={deletingId === doc.id}
                            title="刪除"
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                          >
                            {deletingId === doc.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
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
    </div>
  );
}
