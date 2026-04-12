"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/modules/platform/api";
import { Button } from "@ui-shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

import type { SourceLiveDocument } from "../hooks/useSourceDocumentsSnapshot";
import { useSourceDocumentsSnapshot } from "../hooks/useSourceDocumentsSnapshot";
import { deleteSourceDocument, renameSourceDocument } from "../_actions/source-file.actions";
import { makeSourceStorageAdapter } from "../composition/adapters";

const sourceStorage = makeSourceStorageAdapter();

const WATCH_PATH = "uploads/";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};
const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

interface SourceDocumentsPanelProps {
  readonly workspaceId?: string;
}

/** Upload dropzone + real-time document list backed by Firebase onSnapshot. */
export function SourceDocumentsPanel({ workspaceId }: SourceDocumentsPanelProps) {
  const { state: appState } = useApp();
  const activeAccountId = appState.activeAccount?.id ?? "";
  const effectiveWorkspaceId = workspaceId?.trim() ?? "";

  const { docs, loading, pendingDocs, addPending } = useSourceDocumentsSnapshot(
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

    const ext = selectedFile.name.includes(".")
      ? `.${selectedFile.name.split(".").pop() ?? ""}`
      : "";
    const docId = crypto.randomUUID();
    const uploadPath = `${WATCH_PATH}${activeAccountId}/${docId}${ext}`;

    setUploading(true);
    addPending({
      id: docId,
      filename: selectedFile.name,
      workspaceId: effectiveWorkspaceId,
      sourceGcsUri: sourceStorage.toGsUri(uploadPath),
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
      const customMetadata: Record<string, string> = {
        account_id: activeAccountId,
        filename: selectedFile.name,
        original_filename: selectedFile.name,
        display_name: selectedFile.name,
      };
      if (effectiveWorkspaceId) customMetadata.workspace_id = effectiveWorkspaceId;
      await sourceStorage.upload(selectedFile, uploadPath, { customMetadata });
      toast.success(`上傳成功：${selectedFile.name}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: SourceLiveDocument) {
    setDeletingId(doc.id);
    try {
      const result = await deleteSourceDocument(activeAccountId, doc.id);
      if (!result.ok) toast.error(result.error.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRename(doc: SourceLiveDocument, newName: string) {
    setRenamingId(doc.id);
    try {
      const result = await renameSourceDocument(activeAccountId, doc.id, newName);
      if (!result.ok) toast.error(result.error.message);
    } finally {
      setRenamingId(null);
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription>Upload and manage source documents for RAG.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileChange(e.dataTransfer.files[0] ?? null); }}
            style={{ background: dragging ? "var(--accent)" : undefined }}>
            <FileUp className="h-4 w-4" />
            <span>{selectedFile ? selectedFile.name : "選擇或拖曳檔案"}</span>
            <input ref={fileInputRef} type="file" className="sr-only"
              accept={Object.keys(ACCEPTED_MIME).join(",")}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
          </label>
          <Button size="sm" disabled={!selectedFile || uploading} onClick={() => void handleUpload()}>
            {uploading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            Upload
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : allDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : (
          <ul className="divide-y divide-border/40 rounded-lg border border-border/40">
            {allDocs.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                <span className="flex-1 truncate font-medium">{doc.filename}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{doc.status}</span>
                <button className="shrink-0 text-xs text-destructive hover:underline"
                  disabled={deletingId === doc.id || renamingId === doc.id}
                  onClick={() => void handleDelete(doc)}>
                  Delete
                </button>
                <button className="shrink-0 text-xs text-primary hover:underline"
                  disabled={deletingId === doc.id || renamingId === doc.id}
                  onClick={() => {
                    const newName = window.prompt("New name:", doc.filename);
                    if (newName?.trim()) void handleRename(doc, newName.trim());
                  }}>
                  Rename
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
