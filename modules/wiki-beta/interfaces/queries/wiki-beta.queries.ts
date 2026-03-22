import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

export interface WikiBetaCitation {
  provider?: "vector" | "search";
  chunk_id?: string;
  doc_id?: string;
  filename?: string;
  json_gcs_uri?: string;
  search_id?: string;
  score?: number;
  text?: string;
}

export interface WikiBetaRagQueryResult {
  answer: string;
  citations: WikiBetaCitation[];
  cache: "hit" | "miss";
  vectorHits: number;
  searchHits: number;
  accountScope: string;
}

export interface WikiBetaParsedDocument {
  id: string;
  filename: string;
  sourceGcsUri: string;
  jsonGcsUri: string;
  pageCount: number;
  status: string;
  ragStatus: string;
  uploadedAt: Date | null;
}

export type WikiBetaDocumentReadPath = "accounts/{accountId}/documents" | "parsed_documents";

export interface WikiBetaParsedDocumentListResult {
  documents: WikiBetaParsedDocument[];
  readPath: WikiBetaDocumentReadPath;
}

export interface WikiBetaReindexInput {
  accountId: string;
  docId: string;
  jsonGcsUri: string;
  sourceGcsUri: string;
  filename: string;
  pageCount: number;
}

function toDateOrNull(value: unknown): Date | null {
  if (!value || typeof value !== "object") return null;
  const maybeTimestamp = value as { toDate?: () => Date };
  if (typeof maybeTimestamp.toDate === "function") {
    return maybeTimestamp.toDate();
  }
  return null;
}

function toNumberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mapToParsedDocument(id: string, data: Record<string, any>): WikiBetaParsedDocument {
  const source = (data.source ?? {}) as Record<string, any>;
  const parsed = (data.parsed ?? {}) as Record<string, any>;
  const rag = (data.rag ?? {}) as Record<string, any>;
  const metadata = (data.metadata ?? {}) as Record<string, any>;

  const filenameFromSource = typeof source.filename === "string" ? source.filename : "";
  const filenameFromDoc = typeof data.title === "string" ? data.title : "";
  const filenameFromMeta = typeof metadata.filename === "string" ? metadata.filename : "";

  const sourceGcsFromSource = typeof source.gcs_uri === "string" ? source.gcs_uri : "";
  const sourceGcsFromMeta = typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "";
  const jsonGcsFromParsed = typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "";
  const jsonGcsFromMeta = typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "";

  return {
    id,
    filename: filenameFromSource || filenameFromDoc || filenameFromMeta || id,
    sourceGcsUri: sourceGcsFromSource || sourceGcsFromMeta,
    jsonGcsUri: jsonGcsFromParsed || jsonGcsFromMeta,
    pageCount:
      toNumberOrDefault(parsed.page_count) ||
      toNumberOrDefault(metadata.page_count) ||
      toNumberOrDefault(data.pageCount),
    status: typeof data.status === "string" ? data.status : "unknown",
    ragStatus: typeof rag.status === "string" ? rag.status : "",
    uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
  };
}

export async function runWikiBetaRagQuery(
  query: string,
  accountId: string,
  topK = 4,
): Promise<WikiBetaRagQueryResult> {
  const functions = getFirebaseFunctions("asia-southeast1");
  const callable = functionsApi.httpsCallable(functions, "rag_query");
  const result = await callable({ query, top_k: topK, account_id: accountId });
  const data = (result.data ?? {}) as Record<string, unknown>;

  const answer = typeof data.answer === "string" ? data.answer : "";
  const citations = Array.isArray(data.citations) ? (data.citations as WikiBetaCitation[]) : [];
  const cache = data.cache === "hit" ? "hit" : "miss";
  const vectorHits = typeof data.vector_hits === "number" ? data.vector_hits : 0;
  const searchHits = typeof data.search_hits === "number" ? data.search_hits : 0;
  const accountScope = typeof data.account_scope === "string" ? data.account_scope : "global";

  return { answer, citations, cache, vectorHits, searchHits, accountScope };
}

export async function reindexWikiBetaDocument(input: WikiBetaReindexInput): Promise<void> {
  const functions = getFirebaseFunctions("asia-southeast1");
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

function sortByUploadedAtDesc(documents: WikiBetaParsedDocument[]): WikiBetaParsedDocument[] {
  const copied = [...documents];
  copied.sort((a, b) => {
    const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
    const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
    return bt - at;
  });
  return copied;
}

export async function listWikiBetaParsedDocuments(
  accountId: string,
  limitCount = 20,
): Promise<WikiBetaParsedDocumentListResult> {
  const db = getFirebaseFirestore();
  let docs: WikiBetaParsedDocument[] = [];

  if (accountId) {
    const accountRef = firestoreApi.collection(db, "accounts", accountId, "documents");
    const accountQuery = firestoreApi.query(accountRef, firestoreApi.limit(limitCount));
    const accountSnap = await firestoreApi.getDocs(accountQuery);
    docs = accountSnap.docs.map((item) => {
      const data = (item.data() ?? {}) as Record<string, any>;
      return mapToParsedDocument(item.id, data);
    });
  }

  if (docs.length > 0) {
    return {
      documents: sortByUploadedAtDesc(docs),
      readPath: "accounts/{accountId}/documents",
    };
  }

  const legacyRef = firestoreApi.collection(db, "parsed_documents");
  const legacyQuery = firestoreApi.query(legacyRef, firestoreApi.limit(limitCount));
  const legacySnap = await firestoreApi.getDocs(legacyQuery);
  const legacyDocs = legacySnap.docs.map((item) => {
    const data = (item.data() ?? {}) as Record<string, any>;
    return mapToParsedDocument(item.id, data);
  });

  return {
    documents: sortByUploadedAtDesc(legacyDocs),
    readPath: "parsed_documents",
  };
}
