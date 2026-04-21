"use server";

/**
 * document-actions — notebooklm document server actions.
 *
 * Handles document upload (via Firebase Storage) and listing.
 * fn Storage Trigger runs parse + RAG automatically after upload.
 */

import { z } from "zod";
import {
  createClientNotebooklmSourceUseCases,
} from "../../outbound/firebase-composition";
import { processSourceDocumentAction } from "./source-processing-actions";
import { createDatabaseAction } from "@/src/modules/notion/adapters/inbound/server-actions/database-actions";
import type { ParseDocumentOutput } from "../../outbound/callable/FirebaseCallableAdapter";
import { createServerTaskFormationUseCasesWithGenkit } from "@/src/modules/workspace/server";
import type { ExtractedTaskCandidate } from "@/src/modules/workspace";

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
  /** Which parser to invoke: "layout" | "form" | "ocr" | "genkit". */
  parser: z.enum(["layout", "form", "ocr", "genkit"]).default("layout"),
});

const ReindexDocumentActionInputSchema = z.object({
  accountId: z.string().min(1),
  docId: z.string().min(1),
  /** GCS URI of the Layout Parser JSON written by fn after Document AI parse. */
  layoutJsonGcsUri: z.string().min(1, "layout_json_gcs_uri 為必填欄位（文件尚未完成 Layout Parser 解析？）"),
});

const StartTaskFormationFromDocumentInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  actorId: z.string().min(1),
  documentId: z.string().min(1),
  documentTitle: z.string().min(1).max(500),
  parsedArtifactSummary: z.string().optional(),
});

const ConfirmTaskFormationFromDocumentInputSchema = z.object({
  jobId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  actorId: z.string().min(1),
  selectedIndices: z.array(z.number().int().min(0)).min(1),
});

export interface StartTaskFormationFromDocumentActionResult {
  readonly success: boolean;
  readonly aggregateId?: string;
  readonly error?: { message: string };
  readonly candidates: readonly ExtractedTaskCandidate[];
}

// ── Actions ───────────────────────────────────────────────────────────────────

// NOTE: queryDocumentsAction was removed.
// Querying accounts/{accountId}/documents via a Server Action fails with
// "Missing or insufficient permissions" because the Firebase Web Client SDK
// has no user auth context on the server.
// Use queryDocuments() from firebase-composition.ts (client-side helper) instead.

/**
 * registerUploadedDocumentAction — register a document snapshot after upload.
 *
 * Call this after uploadDocumentToStorage() completes on the client.
 * fn's Storage Trigger will also fire automatically to run parse + RAG.
 * This action records the document in the local domain for immediate UI feedback.
 */
export async function registerUploadedDocumentAction(rawInput: unknown) {
  const input = UploadDocumentMetaSchema.parse(rawInput);
  const { registerSource } = createClientNotebooklmSourceUseCases();
  return registerSource.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    organizationId: "",
    name: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    storageUrl: input.gcsPath,
    originUri: input.gcsPath,
  });
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
       parser: "layout" | "form" | "ocr" | "genkit";
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

/**
 * startTaskFormationFromDocumentAction — run Genkit extraction from source artifacts,
 * then return a persisted task-formation job with candidate list for human review.
 */
export async function startTaskFormationFromDocumentAction(rawInput: unknown): Promise<StartTaskFormationFromDocumentActionResult> {
  const input = StartTaskFormationFromDocumentInputSchema.parse(rawInput);
  const { extractTaskCandidates, getJobSnapshot } = createServerTaskFormationUseCasesWithGenkit();

  const sourceText = input.parsedArtifactSummary?.trim().length
    ? input.parsedArtifactSummary
    : `文件標題：${input.documentTitle}`;

  const result = await extractTaskCandidates.execute({
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    sourceType: "ai",
    sourcePageIds: [input.documentId],
    sourceText,
  });
  if (!result.success) return { success: false, error: result.error, candidates: [] };

  const snapshot = await getJobSnapshot(result.aggregateId);
  return { success: true, aggregateId: result.aggregateId, candidates: snapshot?.candidates ?? [] };
}

/**
 * confirmTaskFormationFromDocumentAction — create tasks from selected candidate indices.
 */
export async function confirmTaskFormationFromDocumentAction(rawInput: unknown) {
  const input = ConfirmTaskFormationFromDocumentInputSchema.parse(rawInput);
  const { confirmCandidates } = createServerTaskFormationUseCasesWithGenkit();

  return confirmCandidates.execute({
    jobId: input.jobId,
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    selectedIndices: input.selectedIndices,
  });
}
