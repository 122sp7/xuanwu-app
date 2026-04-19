/**
 * FirestoreDocumentRepository — read-only Firestore adapter for notebooklm documents.
 *
 * fn owns all writes to accounts/{accountId}/documents/{docId}.
 * TypeScript side is read-only: it subscribes to Firestore status updates
 * written by the fn pipeline (parse + RAG ingestion).
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/subdomains/document/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */

import { getFirebaseFirestore, firestoreApi } from "@packages";
import type {
  DocumentSnapshot as DocumentSnap,
  DocumentStatus,
} from "../../../domain/entities/Document";
import type {
  DocumentRepository,
  DocumentQuery,
} from "../../../domain/repositories/DocumentRepository";

// ── Firestore record shape written by fn ───────────────────────────────────

interface PyFnDocumentRecord {
  id?: string;
  title?: string;
  status?: string;
  account_id?: string;
  spaceId?: string;
  source?: {
    gcs_uri?: string;
    filename?: string;
    display_name?: string;
    original_filename?: string;
    size_bytes?: number;
    uploaded_at?: { toDate?: () => Date };
    mime_type?: string;
  };
  parsed?: {
    json_gcs_uri?: string;
    page_count?: number;
    parsed_at?: { toDate?: () => Date };
    extraction_ms?: number;
    chunk_count?: number;
    entity_count?: number;
  };
  rag?: {
    status?: string;
    chunk_count?: number;
    vector_count?: number;
    embedding_model?: string;
    embedding_dimensions?: number;
    indexed_at?: { toDate?: () => Date };
  };
  error?: {
    message?: string;
    timestamp?: { toDate?: () => Date };
  };
  metadata?: {
    filename?: string;
    display_name?: string;
    space_id?: string;
  };
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

function mapPyFnStatus(docStatus: string | undefined, ragStatus: string | undefined): DocumentStatus {
  if (docStatus === "processing") return "processing";
  if (docStatus === "error") return "archived";
  if (ragStatus === "ready") return "active";
  return "processing";
}

function fromFirestore(raw: PyFnDocumentRecord, docId: string): DocumentSnap {
  const uploadedAt = raw.source?.uploaded_at?.toDate?.() ?? new Date();
  return {
    id: docId,
    workspaceId: raw.spaceId ?? raw.metadata?.space_id ?? "",
    accountId: raw.account_id ?? "",
    organizationId: "",
    name: raw.title ?? raw.source?.display_name ?? raw.source?.filename ?? docId,
    mimeType: raw.source?.mime_type ?? "",
    sizeBytes: raw.source?.size_bytes ?? 0,
    classification: "other",
    tags: [],
    status: mapPyFnStatus(raw.status, raw.rag?.status),
    storageUrl: raw.source?.gcs_uri,
    createdAtISO: uploadedAt.toISOString(),
    updatedAtISO: uploadedAt.toISOString(),
    parsedPageCount: raw.parsed?.page_count,
    parsedChunkCount: raw.parsed?.chunk_count,
    parsedEntityCount: raw.parsed?.entity_count,
    parsedJsonGcsUri: raw.parsed?.json_gcs_uri,
    ragChunkCount: raw.rag?.chunk_count,
    ragVectorCount: raw.rag?.vector_count,
    ragStatus: raw.rag?.status,
  };
}

// ── Repository implementation ─────────────────────────────────────────────────

export class FirestoreDocumentRepository implements DocumentRepository {
  async save(_snapshot: DocumentSnap): Promise<void> {
    // Intentionally no-op: fn is the sole writer for this collection.
    // TypeScript side is read-only.
  }

  async findById(id: string): Promise<DocumentSnap | null> {
    // findById requires accountId context; use query() for list operations.
    // This minimal implementation returns null — callers should use query().
    void id;
    return null;
  }

  async findByNotebookId(notebookId: string): Promise<DocumentSnap[]> {
    // Notebook → document relationship is managed by the Notebook aggregate.
    // Fall back to empty until a cross-reference index is available.
    void notebookId;
    return [];
  }

  async query(params: DocumentQuery): Promise<DocumentSnap[]> {
    if (!params.accountId) return [];

    const db = getFirebaseFirestore();
    const { collection, query, where, orderBy, getDocs } = firestoreApi;

    const colRef = collection(db, "accounts", params.accountId, "documents");
    const constraints = params.workspaceId
      ? [where("spaceId", "==", params.workspaceId), orderBy("source.uploaded_at", "desc")]
      : [orderBy("source.uploaded_at", "desc")];

    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => fromFirestore(docSnap.data() as PyFnDocumentRecord, docSnap.id));
  }

  async delete(_id: string): Promise<void> {
    // fn manages deletions; TypeScript side does not delete.
  }
}
