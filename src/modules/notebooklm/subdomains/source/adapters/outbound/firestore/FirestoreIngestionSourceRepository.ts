/**
 * FirestoreIngestionSourceRepository — Firestore adapter for the source subdomain.
 *
 * Reads from accounts/{accountId}/documents/{docId}, which is the same collection
 * written by the fn pipeline.  TypeScript side is read-only: fn is the sole writer.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/subdomains/source/adapters/outbound/firestore/
 * which matches the extended outbound glob.
 */

import { getFirebaseFirestore, firestoreApi } from "@packages";
import type {
  IngestionSourceSnapshot,
  SourceStatus,
} from "../../../domain/entities/IngestionSource";
import type {
  IngestionSourceRepository,
  IngestionSourceQuery,
} from "../../../domain/repositories/IngestionSourceRepository";

// ── Firestore record shape written by fn ──────────────────────────────────────

interface PyFnSourceRecord {
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
    layout_json_gcs_uri?: string;
    form_json_gcs_uri?: string;
    ocr_json_gcs_uri?: string;
    genkit_json_gcs_uri?: string;
    page_count?: number;
    parsed_at?: { toDate?: () => Date };
    extraction_ms?: number;
    layout_chunk_count?: number;
    form_entity_count?: number;
    /** Legacy field written by storage trigger before the split. */
    json_gcs_uri?: string;
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

function mapPyFnStatus(
  docStatus: string | undefined,
  ragStatus: string | undefined,
): SourceStatus {
  if (docStatus === "processing") return "processing";
  // fn writes status="error" via record_error(); surface it as a first-class state
  // instead of silently mapping to "archived" (which means intentionally removed).
  if (docStatus === "error") return "error";
  if (ragStatus === "ready") return "active";
  // fn sets status="completed" after a successful parse but before RAG indexing.
  if (docStatus === "completed") return "active";
  // TS-side initial write uses status="active" (upload done, not yet parsed).
  if (docStatus === "active") return "active";
  return "processing";
}

function fromFirestore(
  raw: PyFnSourceRecord,
  docId: string,
): IngestionSourceSnapshot {
  const uploadedAt = raw.source?.uploaded_at?.toDate?.() ?? new Date();
  return {
    id: docId,
    workspaceId: raw.spaceId ?? raw.metadata?.space_id ?? "",
    accountId: raw.account_id ?? "",
    organizationId: "",
    name:
      raw.title ??
      raw.source?.display_name ??
      raw.source?.filename ??
      docId,
    mimeType: raw.source?.mime_type ?? "",
    sizeBytes: raw.source?.size_bytes ?? 0,
    classification: "other",
    tags: [],
    status: mapPyFnStatus(raw.status, raw.rag?.status),
    storageUrl: raw.source?.gcs_uri,
    originUri: raw.source?.gcs_uri,
    createdAtISO: uploadedAt.toISOString(),
    updatedAtISO: uploadedAt.toISOString(),
    // fn pipeline fields
    parsedPageCount: raw.parsed?.page_count,
    parsedLayoutChunkCount:
      raw.parsed?.layout_chunk_count ?? raw.parsed?.chunk_count,
    parsedFormEntityCount:
      raw.parsed?.form_entity_count ?? raw.parsed?.entity_count,
    parsedLayoutJsonGcsUri:
      raw.parsed?.layout_json_gcs_uri ?? raw.parsed?.json_gcs_uri,
    parsedFormJsonGcsUri: raw.parsed?.form_json_gcs_uri,
    parsedOcrJsonGcsUri: raw.parsed?.ocr_json_gcs_uri,
    parsedGenkitJsonGcsUri: raw.parsed?.genkit_json_gcs_uri,
    ragChunkCount: raw.rag?.chunk_count,
    ragVectorCount: raw.rag?.vector_count,
    ragStatus: raw.rag?.status,
    errorMessage: raw.error?.message,
    // timing / model fields
    parsedAt: raw.parsed?.parsed_at?.toDate?.()?.toISOString(),
    extractionMs: raw.parsed?.extraction_ms,
    embeddingModel: raw.rag?.embedding_model,
    ragIndexedAt: raw.rag?.indexed_at?.toDate?.()?.toISOString(),
  };
}

// ── Repository implementation ─────────────────────────────────────────────────

export class FirestoreIngestionSourceRepository
  implements IngestionSourceRepository
{
  async save(_snapshot: IngestionSourceSnapshot): Promise<void> {
    // Intentionally no-op: fn is the sole writer for this collection.
    // TypeScript side is read-only.
  }

  async findById(_id: string): Promise<IngestionSourceSnapshot | null> {
    // findById requires accountId context; use query() for list operations.
    return null;
  }

  async findByNotebookId(
    _notebookId: string,
  ): Promise<IngestionSourceSnapshot[]> {
    // Notebook → source relationship is managed by the Notebook aggregate.
    return [];
  }

  async query(
    params: IngestionSourceQuery,
  ): Promise<IngestionSourceSnapshot[]> {
    if (!params.accountId) return [];

    const db = getFirebaseFirestore();
    const { collection, query, where, orderBy, getDocs } = firestoreApi;

    const colRef = collection(db, "accounts", params.accountId, "documents");
    const constraints = params.workspaceId
      ? [
          where("spaceId", "==", params.workspaceId),
          orderBy("source.uploaded_at", "desc"),
        ]
      : [orderBy("source.uploaded_at", "desc")];

    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) =>
      fromFirestore(docSnap.data() as PyFnSourceRecord, docSnap.id),
    );
  }

  async delete(_id: string): Promise<void> {
    // fn manages deletions; TypeScript side does not delete.
  }
}
