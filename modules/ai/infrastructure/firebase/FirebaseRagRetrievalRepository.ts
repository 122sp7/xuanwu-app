import { collectionGroup, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { RagRetrievedChunk } from "../../domain/entities/RagQuery";
import type {
  RagRetrievalRepository,
  RetrieveRagChunksInput,
} from "../../domain/repositories/RagRetrievalRepository";

interface FirestoreRagDocument {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}

// Over-fetch ready documents so the skeleton retriever can survive organization/workspace
// filtering and still leave enough candidates for chunk scoring before generation.
const DOCUMENT_OVER_FETCH_MULTIPLIER = 5;
const MIN_DOCUMENT_LIMIT = 20;
// Pull a wider chunk candidate set because taxonomy and score filtering can drop many results
// before the final top-k prompt window is assembled.
const CHUNK_OVER_FETCH_MULTIPLIER = 10;
const MIN_CHUNK_LIMIT = 50;

interface FirestoreRagChunk {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}

function tokenize(value: string): readonly string[] {
  // The regex keeps ASCII letters/digits plus the basic CJK Unified Ideographs block
  // (`\u4e00-\u9fff`), which covers common Chinese characters but excludes the wider CJK
  // extensions, supplementary ideographs, and compatibility ideographs.
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
    // Prefer workspace-scoped retrieval whenever the caller has that boundary available.
    // Organization-only scope is reserved for deliberate cross-workspace discovery flows;
    // it broadens collection-group scans across every workspace in the organization and
    // should therefore be treated as the higher-cost, broader-recall mode.
    //
    // isLatest filter excludes stale document versions per the wiki development contract
    // (docs/reference/development-contracts/wiki-contract.md §Required query filters).
    const documentsQuery = query(
      collectionGroup(this.db, "documents"),
      where("organizationId", "==", input.organizationId),
      where("status", "==", "ready"),
      where("isLatest", "==", true),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
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
      collectionGroup(this.db, "chunks"),
      where("organizationId", "==", input.organizationId),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
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
          organizationId:
            typeof data.organizationId === "string" ? data.organizationId : undefined,
          workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
        };
      })
      .filter(
        (chunk) =>
          chunk.docId && readyDocumentIds.has(chunk.docId) && chunk.score > 0,
      )
      .sort((left, right) => right.score - left.score)
      .slice(0, input.topK)
      .map(({ organizationId: _organizationId, workspaceId: _workspaceId, ...chunk }) => chunk);
  }
}
