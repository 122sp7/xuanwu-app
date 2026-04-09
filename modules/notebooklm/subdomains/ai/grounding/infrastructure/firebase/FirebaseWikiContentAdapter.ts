/**
 * Module: notebooklm/subdomains/ai/grounding
 * Layer: infrastructure/firebase
 * Purpose: FirebaseWikiContentAdapter — implements IWikiContentRepository via
 *          Firebase Functions calls (RAG query, reindex) and Firestore reads
 *          (list parsed documents).
 *
 * Design notes:
 * - All external shape normalisation happens here; domain types stay clean.
 * - Functions region is configured as a constant; change here only if region changes.
 */

import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";

import type {
  IWikiContentRepository,
  WikiCitation,
  WikiParsedDocument,
  WikiRagQueryResult,
  WikiReindexInput,
} from "../../domain/repositories/IWikiContentRepository";

const FUNCTIONS_REGION = "asia-southeast1";

// --- Firestore / Functions response normalisation helpers ---------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function toNumberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toDateOrNull(value: unknown): Date | null {
  if (!isRecord(value)) return null;
  if (typeof (value as { toDate?: unknown }).toDate === "function") {
    const converted = (value as { toDate: () => unknown }).toDate();
    if (converted instanceof Date) return converted;
  }
  return null;
}

function normaliseCitations(raw: unknown): WikiCitation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (!isRecord(item)) return {};
    return {
      provider: item.provider === "vector" || item.provider === "search" ? item.provider : undefined,
      chunk_id: typeof item.chunk_id === "string" ? item.chunk_id : undefined,
      doc_id: typeof item.doc_id === "string" ? item.doc_id : undefined,
      filename: typeof item.filename === "string" ? item.filename : undefined,
      json_gcs_uri: typeof item.json_gcs_uri === "string" ? item.json_gcs_uri : undefined,
      search_id: typeof item.search_id === "string" ? item.search_id : undefined,
      score: typeof item.score === "number" ? item.score : undefined,
      text: typeof item.text === "string" ? item.text : undefined,
    };
  });
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

function mapToParsedDocument(id: string, data: Record<string, unknown>): WikiParsedDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);

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
      toNumberOrDefault(parsed.page_count) ||
      toNumberOrDefault(metadata.page_count) ||
      toNumberOrDefault(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
  };
}

// --- Adapter ------------------------------------------------------------------

export class FirebaseWikiContentAdapter implements IWikiContentRepository {
  async runRagQuery(
    query: string,
    accountId: string,
    workspaceId: string,
    topK: number,
    options: {
      taxonomyFilters?: string[];
      maxAgeDays?: number;
      requireReady?: boolean;
    } = {},
  ): Promise<WikiRagQueryResult> {
    const functions = getFirebaseFunctions(FUNCTIONS_REGION);
    const callable = functionsApi.httpsCallable(functions, "rag_query");
    const result = await callable({
      query,
      top_k: topK,
      account_id: accountId,
      workspace_id: workspaceId,
      taxonomy_filters: options.taxonomyFilters ?? [],
      max_age_days: options.maxAgeDays,
      require_ready: options.requireReady,
    });
    const data = objectOrEmpty(result.data);

    return {
      answer: typeof data.answer === "string" ? data.answer : "",
      citations: normaliseCitations(data.citations),
      cache: data.cache === "hit" ? "hit" : "miss",
      vectorHits: toNumberOrDefault(data.vector_hits),
      searchHits: toNumberOrDefault(data.search_hits),
      accountScope: typeof data.account_scope === "string" ? data.account_scope : accountId,
      workspaceScope:
        typeof data.workspace_scope === "string" ? data.workspace_scope : workspaceId,
      taxonomyFilters: Array.isArray(data.taxonomy_filters)
        ? data.taxonomy_filters.filter((v): v is string => typeof v === "string")
        : undefined,
      maxAgeDays: typeof data.max_age_days === "number" ? data.max_age_days : undefined,
      requireReady: typeof data.require_ready === "boolean" ? data.require_ready : undefined,
    };
  }

  async reindexDocument(input: WikiReindexInput): Promise<void> {
    const functions = getFirebaseFunctions(FUNCTIONS_REGION);
    const callable = functionsApi.httpsCallable(functions, "rag_reindex_document");
    await callable({
      account_id: input.accountId,
      doc_id: input.docId,
      json_gcs_uri: input.jsonGcsUri,
      source_gcs_uri: input.sourceGcsUri,
      filename: input.filename,
      page_count: input.pageCount,
    });
  }

  async listParsedDocuments(accountId: string, limitCount: number): Promise<WikiParsedDocument[]> {
    if (!accountId) throw new Error("accountId is required");
    const db = getFirebaseFirestore();
    const ref = firestoreApi.collection(db, "accounts", accountId, "documents");
    const q = firestoreApi.query(ref, firestoreApi.limit(limitCount));
    const snap = await firestoreApi.getDocs(q);

    const docs = snap.docs.map((d) => mapToParsedDocument(d.id, objectOrEmpty(d.data())));
    return docs.sort((a, b) => {
      const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
      const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
      return bt - at;
    });
  }
}
