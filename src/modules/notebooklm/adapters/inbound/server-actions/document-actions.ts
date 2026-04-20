"use server";

/**
 * document-actions — notebooklm document server actions.
 *
 * Handles document upload (via Firebase Storage) and listing.
 * fn Storage Trigger runs parse + RAG automatically after upload.
 */

import { z } from "zod";
import {
  createClientNotebooklmDocumentUseCases,
} from "../../outbound/firebase-composition";
import { processSourceDocumentAction } from "./source-processing-actions";
import { createDatabaseAction } from "@/src/modules/notion/adapters/inbound/server-actions/database-actions";
import type { ParseDocumentOutput } from "../../outbound/callable/FirebaseCallableAdapter";

// ── Firebase HTTPS Callable server-side helper ────────────────────────────────
// Calling Cloud Functions from a Server Action avoids CORS completely.
// Functions are deployed in asia-southeast1; project ID comes from env.

const _FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "xuanwu-i-00708880-4e2d8";
const _FUNCTIONS_BASE = `https://asia-southeast1-${_FIREBASE_PROJECT_ID}.cloudfunctions.net`;

async function _callCallable<TIn, TOut>(fnName: string, data: TIn): Promise<TOut> {
  const res = await fetch(`${_FUNCTIONS_BASE}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => String(res.status));
    throw new Error(`${fnName} failed (HTTP ${res.status}): ${text}`);
  }
  const json = (await res.json()) as { result?: TOut; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? `${fnName} returned error`);
  return json.result as TOut;
}


// ── Input schemas ─────────────────────────────────────────────────────────────

const QueryDocumentsInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().optional(),
});

const UploadDocumentMetaSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
  gcsPath: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
});

const CreatePageFromDocumentInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  documentId: z.string().min(1),
  documentTitle: z.string().min(1).max(500),
});

const CreateDatabaseFromDocumentInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  documentTitle: z.string().min(1).max(200),
});

const ParseDocumentActionInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
  docId: z.string().min(1),
  storageUrl: z.string().min(1),
  filename: z.string().min(1),
  mimeType: z.string().default("application/pdf"),
  sizeBytes: z.number().int().nonnegative().default(0),
  /** Which Document AI processor to invoke: "layout" (default) or "form". */
  parser: z.enum(["layout", "form"]).default("layout"),
});

const ReindexDocumentActionInputSchema = z.object({
  accountId: z.string().min(1),
  docId: z.string().min(1),
  /** GCS URI of the Layout Parser JSON written by fn after Document AI parse. */
  layoutJsonGcsUri: z.string().min(1, "layout_json_gcs_uri 為必填欄位（文件尚未完成 Layout Parser 解析？）"),
});

// ── Actions ───────────────────────────────────────────────────────────────────

/**
 * queryDocumentsAction — list documents for a workspace.
 * Reads from Firestore (accounts/{accountId}/documents).
 */
export async function queryDocumentsAction(rawInput: unknown) {
  const input = QueryDocumentsInputSchema.parse(rawInput);
  const { queryDocuments } = createClientNotebooklmDocumentUseCases();
  return queryDocuments.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
  });
}

/**
 * registerUploadedDocumentAction — register a document snapshot after upload.
 *
 * Call this after uploadDocumentToStorage() completes on the client.
 * fn's Storage Trigger will also fire automatically to run parse + RAG.
 * This action records the document in the local domain for immediate UI feedback.
 */
export async function registerUploadedDocumentAction(rawInput: unknown) {
  const input = UploadDocumentMetaSchema.parse(rawInput);
  const { addDocument } = createClientNotebooklmDocumentUseCases();
  return addDocument.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    organizationId: "",
    name: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    status: "processing",
    storageUrl: input.gcsPath,
  } as Parameters<typeof addDocument.execute>[0]);
}

/**
 * createPageFromDocumentAction — create a Knowledge Page from a parsed document.
 *
 * Delegates to processSourceDocumentAction with shouldCreatePage=true only.
 * The Knowledge Page title is set to the document name.
 */
export async function createPageFromDocumentAction(rawInput: unknown) {
  const input = CreatePageFromDocumentInputSchema.parse(rawInput);
  return processSourceDocumentAction({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    documentId: input.documentId,
    documentTitle: input.documentTitle,
    shouldCreateRag: false,
    shouldCreatePage: true,
    shouldCreateTasks: false,
  });
}

/**
 * createDatabaseFromDocumentAction — create a Notion Database named after the document.
 *
 * Useful as a container for Form Parser-extracted structured fields.
 */
export async function createDatabaseFromDocumentAction(rawInput: unknown) {
  const input = CreateDatabaseFromDocumentInputSchema.parse(rawInput);
  return createDatabaseAction({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    name: input.documentTitle,
  });
}

/**
 * parseDocumentAction — trigger Document AI parse for a specific document.
 *
 * Pass `parser: "layout"` (default) for Layout Parser (text + semantic chunks).
 * Pass `parser: "form"` for Form Parser (structured entities / KV fields).
 * Always a pure parse step; RAG indexing is a separate step.
 */
export async function parseDocumentAction(rawInput: unknown): Promise<ParseDocumentOutput> {
  const input = ParseDocumentActionInputSchema.parse(rawInput);
  return _callCallable<
    {
      account_id: string;
      workspace_id: string;
      gcs_uri: string;
      doc_id: string;
      filename: string;
      mime_type: string;
      size_bytes: number;
      run_rag: false;
      parser: "layout" | "form";
    },
    ParseDocumentOutput
  >("parse_document", {
    account_id: input.accountId,
    workspace_id: input.workspaceId,
    gcs_uri: input.storageUrl,
    doc_id: input.docId,
    filename: input.filename,
    mime_type: input.mimeType,
    size_bytes: input.sizeBytes,
    run_rag: false,
    parser: input.parser,
  });
}

/**
 * reindexDocumentAction — trigger RAG reindex from Layout Parser JSON.
 *
 * Calls the fn `rag_reindex_document` HTTPS callable function from the server
 * side to avoid browser CORS restrictions.
 */
export async function reindexDocumentAction(rawInput: unknown): Promise<void> {
  const input = ReindexDocumentActionInputSchema.parse(rawInput);
  await _callCallable<{ account_id: string; doc_id: string; json_gcs_uri: string }, void>(
    "rag_reindex_document",
    { account_id: input.accountId, doc_id: input.docId, json_gcs_uri: input.layoutJsonGcsUri },
  );
}
