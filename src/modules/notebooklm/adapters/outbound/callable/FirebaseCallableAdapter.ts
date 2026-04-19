/**
 * FirebaseCallableAdapter — HTTPS Callable bridge to fn.
 *
 * Wraps Firebase Cloud Function callables for:
 *   - rag_query  (RAG retrieval + generation)
 *   - parse_document (manual trigger for document parsing)
 *   - rag_reindex_document (re-embed a document)
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notebooklm/adapters/outbound/callable/
 * which matches src/modules/<context>/adapters/outbound/**.
 */

import { getFirebaseFunctions, httpsCallable } from "@packages";

// ── Input / output contracts ──────────────────────────────────────────────────

export interface RagQueryInput {
  readonly account_id: string;
  readonly workspace_id: string;
  readonly query: string;
  readonly top_k?: number;
}

export interface RagQueryCitation {
  readonly doc_id: string;
  readonly chunk_id: string;
  readonly filename: string;
  readonly score: number;
}

export interface RagQueryOutput {
  readonly answer: string;
  readonly citations: RagQueryCitation[];
  readonly cache: "hit" | "miss";
  readonly vector_hits: number;
  readonly search_hits: number;
}

export interface ParseDocumentInput {
  readonly account_id: string;
  readonly workspace_id: string;
  readonly gcs_uri: string;
  readonly doc_id?: string;
  readonly filename?: string;
}

export interface ReindexDocumentInput {
  readonly account_id: string;
  readonly doc_id: string;
}

// ── Callable wrappers ─────────────────────────────────────────────────────────

export async function callRagQuery(input: RagQueryInput): Promise<RagQueryOutput> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<RagQueryInput, RagQueryOutput>(functions, "rag_query");
  const result = await fn(input);
  return result.data;
}

export async function callParseDocument(input: ParseDocumentInput): Promise<void> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<ParseDocumentInput, void>(functions, "parse_document");
  await fn(input);
}

export async function callReindexDocument(input: ReindexDocumentInput): Promise<void> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<ReindexDocumentInput, void>(functions, "rag_reindex_document");
  await fn(input);
}
