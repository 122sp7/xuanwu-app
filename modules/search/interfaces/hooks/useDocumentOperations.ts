"use client";

import { useState } from "react";
import { toast } from "sonner";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import type { SourceLiveDocument as WikiLiveDocument } from "@/modules/source/api";

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";

interface UseDocumentOperationsOptions {
  readonly activeAccountId: string;
  readonly appendLog: (message: string) => void;
}

interface UseDocumentOperationsResult {
  readonly deletingId: string | null;
  readonly renamingId: string | null;
  readonly handleDelete: (doc: WikiLiveDocument) => Promise<void>;
  readonly handleRename: (doc: WikiLiveDocument) => Promise<void>;
  readonly handleViewOriginal: (doc: WikiLiveDocument) => Promise<void>;
}

export function useDocumentOperations({
  activeAccountId,
  appendLog,
}: UseDocumentOperationsOptions): UseDocumentOperationsResult {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);

  async function handleDelete(doc: WikiLiveDocument) {
    if (!activeAccountId) return;
    if (!window.confirm(`確定刪除「${doc.filename}」？此動作無法復原。`)) return;

    setDeletingId(doc.id);
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      if (doc.sourceGcsUri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.sourceGcsUri)); } catch { /* not-found */ }
      }
      if (doc.jsonGcsUri) {
        try { await storageApi.deleteObject(storageApi.ref(storage, doc.jsonGcsUri)); } catch { /* not-found */ }
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

  async function handleRename(doc: WikiLiveDocument) {
    if (!activeAccountId) { toast.error("目前沒有 active account，無法更名"); return; }
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
      appendLog(`更名文件：${doc.filename} -> ${nextName}`);
    } catch (error) {
      console.error(error);
      toast.error("更名失敗");
      appendLog(`更名失敗：${doc.filename}`);
    } finally {
      setRenamingId(null);
    }
  }

  async function handleViewOriginal(doc: WikiLiveDocument) {
    if (!doc.sourceGcsUri) return;
    try {
      const storage = getFirebaseStorage(UPLOAD_BUCKET);
      const url = await storageApi.getDownloadURL(storageApi.ref(storage, doc.sourceGcsUri));
      window.open(url, "_blank", "noopener,noreferrer");
      appendLog(`開啟原始檔：${doc.filename}`);
    } catch (error) {
      console.error(error);
      toast.error("無法開啟原始檔");
      appendLog(`開啟原始檔失敗：${doc.filename}`);
    }
  }

  return { deletingId, renamingId, handleDelete, handleRename, handleViewOriginal };
}
