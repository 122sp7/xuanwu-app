"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import type { WikiBetaParsedDocument } from "../../domain";

export interface WikiBetaLiveDocument extends WikiBetaParsedDocument {
  readonly errorMessage: string;
  readonly ragError: string;
  readonly isClientPending?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toDateOrNull(value: unknown): Date | null {
  if (!isRecord(value)) return null;
  if (typeof value.toDate === "function") {
    try {
      const d = (value.toDate as () => unknown)();
      if (d instanceof Date) return d;
    } catch {
      // fall through
    }
  }
  if (typeof value.toMillis === "function") {
    try {
      const ms = (value.toMillis as () => unknown)();
      if (typeof ms === "number" && Number.isFinite(ms)) return new Date(ms);
    } catch {
      // fall through
    }
  }
  return null;
}

function resolveFilename(data: Record<string, unknown>): string {
  const source = objectOrEmpty(data.source);
  const metadata = objectOrEmpty(data.metadata);
  const candidates = [
    source.filename,
    source.display_name,
    data.title,
    metadata.filename,
    metadata.display_name,
    source.original_filename,
    metadata.original_filename,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c;
  }
  return "";
}

export function mapToLiveDocument(id: string, data: Record<string, unknown>): WikiBetaLiveDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);
  const error = objectOrEmpty(data.error);
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  return {
    id,
    filename: resolveFilename(data) || id,
    workspaceId:
      (typeof data.spaceId === "string" ? data.spaceId : "") ||
      (typeof metadata.space_id === "string" ? metadata.space_id : ""),
    sourceGcsUri:
      (typeof source.gcs_uri === "string" ? source.gcs_uri : "") ||
      (typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : ""),
    jsonGcsUri:
      (typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "") ||
      (typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : ""),
    pageCount:
      n(parsed.page_count) || n(metadata.page_count) || n(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
    errorMessage: typeof error.message === "string" ? error.message : "",
    ragError: typeof rag.error === "string" ? rag.error : "",
  };
}

export interface UseDocumentsSnapshotResult {
  readonly docs: WikiBetaLiveDocument[];
  readonly loading: boolean;
  readonly pendingDocs: WikiBetaLiveDocument[];
  readonly addPending: (doc: WikiBetaLiveDocument) => void;
  readonly removePending: (id: string) => void;
}

/** Subscribes to Firestore `accounts/{accountId}/documents` in real time via onSnapshot. */
export function useDocumentsSnapshot(
  accountId: string,
  workspaceId?: string,
): UseDocumentsSnapshotResult {
  // Raw state — only populated in onSnapshot callbacks (never synchronously in effect body).
  const [rawDocs, setRawDocs] = useState<WikiBetaLiveDocument[]>([]);
  const [rawPending, setRawPending] = useState<WikiBetaLiveDocument[]>([]);
  // Track the subscription key for which we last received a snapshot.
  // Comparing against the current key derives the loading state without synchronous setState.
  const [receivedKey, setReceivedKey] = useState("");
  const statusMapRef = useRef<Record<string, string>>({});

  const addPending = useCallback((doc: WikiBetaLiveDocument) => {
    setRawPending((prev) => [doc, ...prev.filter((p) => p.id !== doc.id)]);
  }, []);

  const removePending = useCallback((id: string) => {
    setRawPending((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    if (!accountId) return;

    // Capture the key for this subscription so the callback can signal completion.
    const subKey = `${accountId}/${workspaceId ?? ""}`;
    statusMapRef.current = {};

    const db = getFirebaseFirestore();
    const colRef = firestoreApi.collection(db, "accounts", accountId, "documents");

    const unsubscribe = firestoreApi.onSnapshot(
      colRef,
      (snapshot) => {
        const mapped = snapshot.docs
          .map((item) => mapToLiveDocument(item.id, objectOrEmpty(item.data())))
          .filter((item) => !workspaceId || item.workspaceId === workspaceId)
          .sort((a, b) => (b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));

        const nextMap: Record<string, string> = {};
        mapped.forEach((doc) => {
          nextMap[doc.id] = `${doc.status}/${doc.ragStatus}`;
        });
        statusMapRef.current = nextMap;

        setRawDocs(mapped);
        setRawPending((prev) => prev.filter((p) => !mapped.some((d) => d.id === p.id)));
        setReceivedKey(subKey); // Mark that we've received the first snapshot for this key.
      },
      () => {
        setReceivedKey(subKey); // Also clears loading on error.
      },
    );

    return () => {
      unsubscribe();
      statusMapRef.current = {};
    };
  }, [accountId, workspaceId]);

  // Derive effective values without calling setState in the effect body.
  const currentKey = `${accountId}/${workspaceId ?? ""}`;
  const docs = accountId ? rawDocs : [];
  // loading = true when we have an accountId but haven't yet received the first snapshot for this subscription.
  const loading = Boolean(accountId) && receivedKey !== currentKey;
  const pendingDocs = accountId ? rawPending : [];

  return { docs, loading, pendingDocs, addPending, removePending };
}
