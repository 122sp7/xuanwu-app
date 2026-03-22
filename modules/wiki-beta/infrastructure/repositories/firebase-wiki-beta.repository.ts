import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";

import type {
  WikiBetaKnowledgeRepository,
  WikiBetaWorkspaceRepository,
} from "../../domain/repositories/wiki-beta.repositories";
import type {
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
  WikiBetaWorkspaceRef,
} from "../../domain/entities/wiki-beta.types";
import { getWorkspacesForAccount } from "@/modules/workspace";

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

function mapToParsedDocument(id: string, data: Record<string, unknown>): WikiBetaParsedDocument {
  const source = (data.source ?? {}) as Record<string, unknown>;
  const parsed = (data.parsed ?? {}) as Record<string, unknown>;
  const rag = (data.rag ?? {}) as Record<string, unknown>;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;

  const filenameFromSource = typeof source.filename === "string" ? source.filename : "";
  const filenameFromDoc = typeof data.title === "string" ? data.title : "";
  const filenameFromMeta = typeof metadata.filename === "string" ? metadata.filename : "";

  const sourceGcsFromSource = typeof source.gcs_uri === "string" ? source.gcs_uri : "";
  const sourceGcsFromMeta = typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "";
  const jsonGcsFromParsed = typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "";
  const jsonGcsFromMeta = typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "";
  const workspaceIdFromDoc = typeof data.spaceId === "string" ? data.spaceId : "";
  const workspaceIdFromMeta = typeof metadata.space_id === "string" ? metadata.space_id : "";

  return {
    id,
    filename: filenameFromSource || filenameFromDoc || filenameFromMeta || id,
    workspaceId: workspaceIdFromDoc || workspaceIdFromMeta,
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

function sortByUploadedAtDesc(documents: WikiBetaParsedDocument[]): WikiBetaParsedDocument[] {
  const copied = [...documents];
  copied.sort((a, b) => {
    const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
    const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
    return bt - at;
  });
  return copied;
}

export class FirebaseWikiBetaKnowledgeRepository implements WikiBetaKnowledgeRepository {
  async runRagQuery(query: string, accountId: string, topK: number): Promise<WikiBetaRagQueryResult> {
    const functions = getFirebaseFunctions("asia-southeast1");
    const callable = functionsApi.httpsCallable(functions, "rag_query");
    const result = await callable({ query, top_k: topK, account_id: accountId });
    const data = (result.data ?? {}) as Record<string, unknown>;

    return {
      answer: typeof data.answer === "string" ? data.answer : "",
      citations: Array.isArray(data.citations) ? (data.citations as WikiBetaRagQueryResult["citations"]) : [],
      cache: data.cache === "hit" ? "hit" : "miss",
      vectorHits: typeof data.vector_hits === "number" ? data.vector_hits : 0,
      searchHits: typeof data.search_hits === "number" ? data.search_hits : 0,
      accountScope: typeof data.account_scope === "string" ? data.account_scope : accountId,
    };
  }

  async reindexDocument(input: WikiBetaReindexInput): Promise<void> {
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

  async listParsedDocuments(accountId: string, limitCount: number): Promise<WikiBetaParsedDocument[]> {
    if (!accountId) {
      throw new Error("accountId is required");
    }

    const db = getFirebaseFirestore();
    const accountRef = firestoreApi.collection(db, "accounts", accountId, "documents");
    const accountQuery = firestoreApi.query(accountRef, firestoreApi.limit(limitCount));
    const accountSnap = await firestoreApi.getDocs(accountQuery);
    const docs = accountSnap.docs.map((item) => {
      const data = (item.data() ?? {}) as Record<string, unknown>;
      return mapToParsedDocument(item.id, data);
    });

    return sortByUploadedAtDesc(docs);
  }
}

export class FirebaseWikiBetaWorkspaceRepository implements WikiBetaWorkspaceRepository {
  async listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]> {
    const workspaces = await getWorkspacesForAccount(accountId);
    return workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
    }));
  }
}