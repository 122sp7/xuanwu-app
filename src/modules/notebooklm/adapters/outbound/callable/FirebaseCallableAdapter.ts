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
  readonly mime_type?: string;
  readonly size_bytes?: number;
  /** When true fn also runs RAG ingestion after parse. Defaults to true in fn. */
  readonly run_rag?: boolean;
}

export interface ParseDocumentOutput {
  readonly doc_id: string;
  readonly account_scope: string;
  readonly status: string;
}

export interface ReindexDocumentInput {
  readonly account_id: string;
  readonly doc_id: string;
  /** GCS URI of the parsed JSON file (gs://bucket/files/…json). Required by fn. */
  readonly json_gcs_uri: string;
}

// ── Callable wrappers ─────────────────────────────────────────────────────────

export async function callRagQuery(input: RagQueryInput): Promise<RagQueryOutput> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<RagQueryInput, RagQueryOutput>(functions, "rag_query");
  const result = await fn(input);
  return result.data;
}

export async function callParseDocument(input: ParseDocumentInput): Promise<ParseDocumentOutput> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<ParseDocumentInput, ParseDocumentOutput>(functions, "parse_document");
  const result = await fn(input);
  return result.data;
}

export async function callReindexDocument(input: ReindexDocumentInput): Promise<void> {
  const functions = getFirebaseFunctions();
  const fn = httpsCallable<ReindexDocumentInput, void>(functions, "rag_reindex_document");
  await fn(input);
}
