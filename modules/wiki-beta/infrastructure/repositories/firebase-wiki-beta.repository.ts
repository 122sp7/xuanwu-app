import { getFirebaseFirestore, firestoreApi } from "@integration-firebase/firestore";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";

import type {
  WikiBetaContentRepository,
  WikiBetaWorkspaceRepository,
} from "../../domain/repositories/wiki-beta.repositories";
import type {
  WikiBetaCitation,
  WikiBetaParsedDocument,
  WikiBetaRagQueryResult,
  WikiBetaReindexInput,
  WikiBetaWorkspaceRef,
} from "../../domain/entities/wiki-beta.types";
import { getWorkspacesForAccount } from "@/modules/workspace/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  if (isRecord(value)) {
    return value;
  }
  return {};
}

function toDateOrNull(value: unknown): Date | null {
  if (!isRecord(value)) return null;
  const maybeToDate = value.toDate;
  if (typeof maybeToDate === "function") {
    const converted = maybeToDate();
    if (converted instanceof Date) {
      return converted;
    }
  }
  return null;
}

function toCitations(value: unknown): WikiBetaCitation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (!isRecord(item)) {
      return {};
    }

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

function toNumberOrDefault(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function resolveDocumentFilename(data: Record<string, unknown>): string {
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

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return "";
}

function mapToParsedDocument(id: string, data: Record<string, unknown>): WikiBetaParsedDocument {
  const source = objectOrEmpty(data.source);
  const parsed = objectOrEmpty(data.parsed);
  const rag = objectOrEmpty(data.rag);
  const metadata = objectOrEmpty(data.metadata);

  const sourceGcsFromSource = typeof source.gcs_uri === "string" ? source.gcs_uri : "";
  const sourceGcsFromMeta = typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "";
  const jsonGcsFromParsed = typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "";
  const jsonGcsFromMeta = typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "";
  const workspaceIdFromDoc = typeof data.spaceId === "string" ? data.spaceId : "";
  const workspaceIdFromMeta = typeof metadata.space_id === "string" ? metadata.space_id : "";

  return {
    id,
    filename: resolveDocumentFilename(data) || id,
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

export class FirebaseWikiBetaContentRepository implements WikiBetaContentRepository {
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
  ): Promise<WikiBetaRagQueryResult> {
    const functions = getFirebaseFunctions("asia-southeast1");
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
      citations: toCitations(data.citations),
      cache: data.cache === "hit" ? "hit" : "miss",
      vectorHits: typeof data.vector_hits === "number" ? data.vector_hits : 0,
      searchHits: typeof data.search_hits === "number" ? data.search_hits : 0,
      accountScope: typeof data.account_scope === "string" ? data.account_scope : accountId,
      workspaceScope: typeof data.workspace_scope === "string" ? data.workspace_scope : workspaceId,
      taxonomyFilters: Array.isArray(data.taxonomy_filters)
        ? data.taxonomy_filters.filter((value): value is string => typeof value === "string")
        : undefined,
      maxAgeDays: typeof data.max_age_days === "number" ? data.max_age_days : undefined,
      requireReady: typeof data.require_ready === "boolean" ? data.require_ready : undefined,
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
      const data = objectOrEmpty(item.data());
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