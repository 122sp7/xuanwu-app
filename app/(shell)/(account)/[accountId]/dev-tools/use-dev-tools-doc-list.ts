"use client";

/**
 * useDevToolsDocList.ts
 * Owns: Firestore subscription for the document list, JSON-preview state,
 *   and all per-document async operations (view, delete, reindex).
 *
 * All Firebase access routes through platform infrastructure APIs
 * (firestoreInfrastructureApi, storageInfrastructureApi, functionsInfrastructureApi)
 * per AGENTS.md Rule 46 — app/ NEVER touches Firebase SDK directly.
 */

import { useEffect, useRef, useState } from "react";

import {
  firestoreInfrastructureApi,
  storageInfrastructureApi,
  functionsInfrastructureApi,
} from "@/modules/platform/api/infrastructure";

import {
  gcsUriToPath,
  mapDocRecord,
  formatDateTime,
  type DocRecord,
} from "./dev-tools-helpers";

// ── Public state ───────────────────────────────────────────────────────────

export interface DocListState {
  allDocs: DocRecord[];
  selectedDocId: string | null;
  selectedDoc: DocRecord | undefined;
  jsonContent: string | null;
  jsonLoading: boolean;
  deletingId: string | null;
  reindexingId: string | null;
}

export interface DocListHandlers {
  handleViewOriginal: (doc: DocRecord) => Promise<void>;
  handleViewJson: (doc: DocRecord) => Promise<void>;
  handleDeleteDoc: (doc: DocRecord) => Promise<void>;
  handleManualProcess: (doc: DocRecord, appendLog: (msg: string) => void) => Promise<void>;
  closeJsonPreview: () => void;
  formatNormalizationRatio: (doc: DocRecord) => string;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useDevToolsDocList(activeAccountId: string): DocListState & DocListHandlers {
  const [allDocs, setAllDocs] = useState<DocRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<string | null>(null);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reindexingId, setReindexingId] = useState<string | null>(null);

  const unsubscribeListRef = useRef<(() => void) | null>(null);

  // Subscribe to all documents for this account
  useEffect(() => {
    if (!activeAccountId) {
      setAllDocs([]);
      return;
    }
    try {
      unsubscribeListRef.current = firestoreInfrastructureApi.watchCollection<Record<string, unknown>>(
        `accounts/${activeAccountId}/documents`,
        {
          onNext: (documents) => {
            const docs: DocRecord[] = documents.map((item) =>
              mapDocRecord({ id: item.id, data: item.data }),
            );
            docs.sort((a, b) => (b.uploaded_at?.getTime() ?? 0) - (a.uploaded_at?.getTime() ?? 0));
            setAllDocs(docs);
          },
        },
      );
    } catch (_err) {}
    return () => { unsubscribeListRef.current?.(); };
  }, [activeAccountId]);

  function closeJsonPreview() {
    setSelectedDocId(null);
    setJsonContent(null);
  }

  async function handleViewOriginal(doc: DocRecord) {
    if (!doc.gcs_uri) return;
    try {
      const storagePath = gcsUriToPath(doc.gcs_uri);
      const url = await storageInfrastructureApi.getUrl(storagePath);
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
      const storagePath = gcsUriToPath(doc.json_gcs_uri);
      const url = await storageInfrastructureApi.getUrl(storagePath);
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
    if (
      !window.confirm(
        `確定刪除「${doc.filename}」？\n此操作將同時刪除 Firestore 記錄與 GCS 檔案，無法復原。`,
      )
    )
      return;
    setDeletingId(doc.id);
    try {
      if (doc.gcs_uri) {
        try { await storageInfrastructureApi.delete(gcsUriToPath(doc.gcs_uri)); } catch (_err) {}
      }
      if (doc.json_gcs_uri) {
        try { await storageInfrastructureApi.delete(gcsUriToPath(doc.json_gcs_uri)); } catch (_err) {}
      }
      if (!activeAccountId) throw new Error("缺少 active account");
      await firestoreInfrastructureApi.delete(
        `accounts/${activeAccountId}/documents/${doc.id}`,
      );
      if (selectedDocId === doc.id) closeJsonPreview();
    } catch (err: unknown) {
      alert(`刪除失敗：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleManualProcess(
    doc: DocRecord,
    appendLog: (msg: string) => void,
  ) {
    if (!doc.json_gcs_uri) return;
    if (!activeAccountId) {
      alert("缺少 active account，無法手動整理");
      return;
    }
    setReindexingId(doc.id);
    appendLog(`🧹 手動整理開始：${doc.id}`);
    try {
      await functionsInfrastructureApi.call(
        "rag_reindex_document",
        {
          account_id: activeAccountId,
          doc_id: doc.id,
          json_gcs_uri: doc.json_gcs_uri,
          source_gcs_uri: doc.gcs_uri,
          filename: doc.filename,
          page_count: doc.page_count ?? 0,
        },
        { region: "asia-southeast1" },
      );
      appendLog(`✅ 手動整理完成：${doc.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendLog(`❌ 手動整理失敗：${msg}`);
      alert(`手動整理失敗：${msg}`);
    } finally {
      setReindexingId(null);
    }
  }

  function formatNormalizationRatio(doc: DocRecord): string {
    const raw = doc.rag_raw_chars ?? 0;
    const normalized = doc.rag_normalized_chars ?? 0;
    if (raw <= 0 || normalized <= 0) return "—";
    const ratio = (normalized / raw) * 100;
    return `${normalized.toLocaleString()} / ${raw.toLocaleString()} (${ratio.toFixed(1)}%)`;
  }

  const selectedDoc = selectedDocId ? allDocs.find((d) => d.id === selectedDocId) : undefined;

  return {
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
    // re-export for table columns
  };
}

// Re-export for convenience in table components
export { formatDateTime };
