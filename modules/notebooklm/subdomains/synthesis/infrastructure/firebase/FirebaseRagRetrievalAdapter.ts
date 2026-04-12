/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/firebase
 * Purpose: FirebaseRagRetrievalAdapter — implements IRagRetrievalRepository
 *          using Firestore collectionGroup queries for document-scoped chunks.
 *
 * Retrieval strategy:
 *  1. Over-fetch candidate documents (filtered by org / workspace / taxonomy / status=ready).
 *  2. Over-fetch candidate chunks in the same scope.
 *  3. Compute a token-overlap relevance score (CJK-aware tokeniser).
 *  4. Filter to chunks whose parent doc is in the ready-document set.
 *  5. Sort descending by score, return top-K.
 */

import { collectionGroup, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { RagRetrievedChunk } from "../../domain/entities/retrieval.entities";
import type { IRagRetrievalRepository, RetrieveChunksInput } from "../../domain/repositories/IRagRetrievalRepository";

// --- Firestore document shapes -----------------------------------------------

interface FirestoreRagDocument {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly status?: string;
  readonly taxonomy?: string;
}

interface FirestoreRagChunk {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly docId?: string;
  readonly text?: string;
  readonly taxonomy?: string;
  readonly page?: number;
  readonly chunkIndex?: number;
}

// --- Retrieval tuning constants -----------------------------------------------

const DOCUMENT_OVER_FETCH_MULTIPLIER = 5;
const MIN_DOCUMENT_LIMIT = 20;
const CHUNK_OVER_FETCH_MULTIPLIER = 10;
const MIN_CHUNK_LIMIT = 50;

// --- Scoring helpers (pure functions, no state) --------------------------------

/** CJK-aware whitespace / punctuation tokeniser */
function tokenize(value: string): readonly string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fff]+/u)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Token-overlap score between query and chunk text.
 * Returns a value in [0, 1] — fraction of query tokens found in the chunk.
 */
function computeTokenOverlapScore(queryTokens: readonly string[], chunkText: string): number {
  if (queryTokens.length === 0) return 0;
  const chunkTokens = tokenize(chunkText);
  if (chunkTokens.length === 0) return 0;
  const matchCount = queryTokens.filter((t) => chunkTokens.includes(t)).length;
  return matchCount / queryTokens.length;
}

// --- Adapter ------------------------------------------------------------------

export class FirebaseRagRetrievalAdapter implements IRagRetrievalRepository {
  private readonly db = getFirestore(firebaseClientApp);

  async retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]> {
    // Step 1 — resolve ready document IDs in scope
    const documentsQuery = query(
      collectionGroup(this.db, "documents"),
      where("organizationId", "==", input.organizationId),
      where("status", "==", "ready"),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * DOCUMENT_OVER_FETCH_MULTIPLIER, MIN_DOCUMENT_LIMIT)),
    );

    const documentSnapshots = await getDocs(documentsQuery);
    const readyDocumentIds = new Set(
      documentSnapshots.docs
        .filter((snap) => {
          const data = snap.data() as FirestoreRagDocument;
          return data.status === "ready";
        })
        .map((snap) => snap.id),
    );

    if (readyDocumentIds.size === 0) return [];

    // Step 2 — over-fetch candidate chunks
    const chunksQuery = query(
      collectionGroup(this.db, "chunks"),
      where("organizationId", "==", input.organizationId),
      ...(input.workspaceId ? [where("workspaceId", "==", input.workspaceId)] : []),
      ...(input.taxonomy ? [where("taxonomy", "==", input.taxonomy)] : []),
      limit(Math.max(input.topK * CHUNK_OVER_FETCH_MULTIPLIER, MIN_CHUNK_LIMIT)),
    );

    const chunkSnapshots = await getDocs(chunksQuery);
    const queryTokens = tokenize(input.normalizedQuery);

    // Step 3 — score, filter, sort, slice
    return chunkSnapshots.docs
      .map((snap) => {
        const data = snap.data() as FirestoreRagChunk;
        const text = typeof data.text === "string" ? data.text : "";
        const docId = typeof data.docId === "string" ? data.docId : "";
        return {
          chunkId: snap.id,
          docId,
          chunkIndex: typeof data.chunkIndex === "number" ? data.chunkIndex : 0,
          ...(typeof data.page === "number" ? { page: data.page } : {}),
          taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : "general",
          text,
          score: computeTokenOverlapScore(queryTokens, text),
        } satisfies RagRetrievedChunk;
      })
      .filter((chunk) => chunk.docId !== "" && readyDocumentIds.has(chunk.docId) && chunk.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, input.topK);
  }
}
