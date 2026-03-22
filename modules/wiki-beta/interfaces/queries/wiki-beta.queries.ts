import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";

export interface WikiBetaCitation {
  doc_id?: string;
  filename?: string;
  score?: number;
  text?: string;
}

export interface WikiBetaRagQueryResult {
  answer: string;
  citations: WikiBetaCitation[];
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

export interface WikiBetaReindexInput {
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

export async function runWikiBetaRagQuery(query: string, topK = 4): Promise<WikiBetaRagQueryResult> {
  const functions = getFirebaseFunctions("asia-southeast1");
  const callable = functionsApi.httpsCallable(functions, "rag_query");
  const result = await callable({ query, top_k: topK });
  const data = (result.data ?? {}) as Record<string, unknown>;

  const answer = typeof data.answer === "string" ? data.answer : "";
  const citations = Array.isArray(data.citations) ? (data.citations as WikiBetaCitation[]) : [];

  return { answer, citations };
}

export async function reindexWikiBetaDocument(input: WikiBetaReindexInput): Promise<void> {
  const functions = getFirebaseFunctions("asia-southeast1");
  const callable = functionsApi.httpsCallable(functions, "rag_reindex_document");
  await callable({
    doc_id: input.docId,
    json_gcs_uri: input.jsonGcsUri,
    source_gcs_uri: input.sourceGcsUri,
    filename: input.filename,
    page_count: input.pageCount,
  });
}

export async function listWikiBetaParsedDocuments(limitCount = 20): Promise<WikiBetaParsedDocument[]> {
  const db = getFirebaseFirestore();
  const ref = firestoreApi.collection(db, "parsed_documents");
  const q = firestoreApi.query(ref, firestoreApi.limit(limitCount));
  const snap = await firestoreApi.getDocs(q);

  const docs = snap.docs.map((item) => {
    const data = (item.data() ?? {}) as Record<string, any>;
    const source = (data.source ?? {}) as Record<string, any>;
    const parsed = (data.parsed ?? {}) as Record<string, any>;
    const rag = (data.rag ?? {}) as Record<string, any>;

    return {
      id: item.id,
      filename: typeof source.filename === "string" ? source.filename : item.id,
      sourceGcsUri: typeof source.gcs_uri === "string" ? source.gcs_uri : "",
      jsonGcsUri: typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "",
      pageCount: typeof parsed.page_count === "number" ? parsed.page_count : 0,
      status: typeof data.status === "string" ? data.status : "unknown",
      ragStatus: typeof rag.status === "string" ? rag.status : "",
      uploadedAt: toDateOrNull(source.uploaded_at),
    } satisfies WikiBetaParsedDocument;
  });

  docs.sort((a, b) => {
    const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
    const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
    return bt - at;
  });

  return docs;
}
