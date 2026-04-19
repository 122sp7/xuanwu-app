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
