"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";

import type {
  SourceLiveDocument,
} from "../../application/dto/source-live-document.dto";
import {
  mapToSourceLiveDocument,
} from "../../application/dto/source-live-document.dto";

// Re-export types for backward compatibility
export type {
  SourceDocument,
  SourceLiveDocument,
  AssetDocument,
  AssetLiveDocument,
} from "../../application/dto/source-live-document.dto";
export {
  mapToSourceLiveDocument,
  mapToAssetLiveDocument,
} from "../../application/dto/source-live-document.dto";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export interface UseSourceDocumentsSnapshotResult {
  readonly docs: SourceLiveDocument[];
  readonly loading: boolean;
  readonly pendingDocs: SourceLiveDocument[];
  readonly addPending: (doc: SourceLiveDocument) => void;
  readonly removePending: (id: string) => void;
}

/** Subscribes to Firestore `accounts/{accountId}/documents` in real time via onSnapshot. */
export function useSourceDocumentsSnapshot(
  accountId: string,
  workspaceId?: string,
): UseSourceDocumentsSnapshotResult {
  const [rawDocs, setRawDocs] = useState<SourceLiveDocument[]>([]);
  const [rawPending, setRawPending] = useState<SourceLiveDocument[]>([]);
  const [receivedKey, setReceivedKey] = useState("");
  const statusMapRef = useRef<Record<string, string>>({});

  const addPending = useCallback((doc: SourceLiveDocument) => {
    setRawPending((prev) => [doc, ...prev.filter((p) => p.id !== doc.id)]);
  }, []);

  const removePending = useCallback((id: string) => {
    setRawPending((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!accountId) return;

    const subKey = `${accountId}/${workspaceId ?? ""}`;
    statusMapRef.current = {};

    const db = getFirebaseFirestore();
    const colRef = firestoreApi.collection(db, "accounts", accountId, "documents");

    const unsubscribe = firestoreApi.onSnapshot(
      colRef,
      (snapshot) => {
        const mapped = snapshot.docs
          .map((item) => mapToSourceLiveDocument(item.id, objectOrEmpty(item.data())))
          .filter((item) => !workspaceId || item.workspaceId === workspaceId)
          .sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));

        const nextMap: Record<string, string> = {};
        for (const doc of mapped) {
          nextMap[doc.id] = `${doc.status}/${doc.ragStatus}`;
        }
        statusMapRef.current = nextMap;

        setRawDocs(mapped);
        setRawPending((prev) => prev.filter((p) => !mapped.some((d) => d.id === p.id)));
        setReceivedKey(subKey);
      },
      () => {
        setReceivedKey(subKey);
      },
    );

    return () => {
      unsubscribe();
      statusMapRef.current = {};
    };
  }, [accountId, workspaceId]);

  const currentKey = `${accountId}/${workspaceId ?? ""}`;
  const docs = accountId ? rawDocs : [];
  const loading = Boolean(accountId) && receivedKey !== currentKey;
  const pendingDocs = accountId ? rawPending : [];

  return { docs, loading, pendingDocs, addPending, removePending };
}
