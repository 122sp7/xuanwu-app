import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";

import type { RagRetrievedChunk } from "../../domain/entities/RagQuery";
import type {
  RagRetrievalRepository,
  RetrieveRagChunksInput,
} from "../../domain/repositories/RagRetrievalRepository";

interface FirestoreRagDocument {
  readonly tenantId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}

// Over-fetch ready documents so the skeleton retriever can survive tenant/workspace filtering
// and still leave enough candidates for scoring before generation.
const DOCUMENT_OVER_FETCH_MULTIPLIER = 5;
const MIN_DOCUMENT_LIMIT = 20;
const CHUNK_OVER_FETCH_MULTIPLIER = 10;
const MIN_CHUNK_LIMIT = 50;

interface FirestoreRagChunk {
  readonly tenantId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}

// Keep basic Latin and CJK ranges together so the deterministic scaffold can score both
// English and Chinese queries before a real embedding/vector-search pipeline replaces it.
function tokenize(value: string): readonly string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/u)
    .map((token) => token.trim())
    .filter(Boolean);
}

function scoreChunk(queryTokens: readonly string[], text: string) {
  if (queryTokens.length === 0) {
    return 0;
  }

  const haystack = tokenize(text);
  if (haystack.length === 0) {
    return 0;
  }

  const matches = queryTokens.filter((token) => haystack.includes(token)).length;
  return matches / queryTokens.length;
}

export class FirebaseRagRetrievalRepository implements RagRetrievalRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]> {
    const documentsQuery = query(
      collection(this.db, "documents"),
      where("tenantId", "==", input.tenantId),
      where("workspaceId", "==", input.workspaceId),
      where("status", "==", "ready"),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * DOCUMENT_OVER_FETCH_MULTIPLIER, MIN_DOCUMENT_LIMIT)),
    );

    const documentSnapshots = await getDocs(documentsQuery);
    const readyDocumentIds = new Set(
      documentSnapshots.docs
        .filter((snapshot) => {
          const data = snapshot.data() as FirestoreRagDocument;
          return data.status === "ready";
        })
        .map((snapshot) => snapshot.id),
    );

    if (readyDocumentIds.size === 0) {
      return [];
    }

    const chunkQuery = query(
      collection(this.db, "chunks"),
      where("tenantId", "==", input.tenantId),
      where("workspaceId", "==", input.workspaceId),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * CHUNK_OVER_FETCH_MULTIPLIER, MIN_CHUNK_LIMIT)),
    );

    const chunkSnapshots = await getDocs(chunkQuery);
    const queryTokens = tokenize(input.normalizedQuery);

    return chunkSnapshots.docs
      .map((snapshot) => {
        const data = snapshot.data() as FirestoreRagChunk;
        const text = typeof data.text === "string" ? data.text : "";
        const docId = typeof data.docId === "string" ? data.docId : "";
        return {
          chunkId: snapshot.id,
          docId,
          chunkIndex: typeof data.chunkIndex === "number" ? data.chunkIndex : 0,
          page: typeof data.page === "number" ? data.page : undefined,
          taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : "general",
          text,
          score: scoreChunk(queryTokens, text),
          tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
          workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        };
      })
      .filter(
        (chunk) =>
          chunk.docId &&
          readyDocumentIds.has(chunk.docId) &&
          chunk.tenantId === input.tenantId &&
          chunk.workspaceId === input.workspaceId &&
          chunk.score > 0,
      )
      .sort((left, right) => right.score - left.score)
      .slice(0, input.topK)
      .map(({ tenantId: _tenantId, workspaceId: _workspaceId, ...chunk }) => chunk);
  }
}
