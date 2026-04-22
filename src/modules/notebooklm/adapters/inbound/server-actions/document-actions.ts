"use server";

/**
 * document-actions — notebooklm document server actions.
 *
 * ⚠️  Parse / index callable actions (parse_document, rag_reindex_document) are
 *     intentionally NOT implemented here as Server Actions.
 *     fn HTTPS Callables require a Firebase Auth token carried by the browser's
 *     Firebase SDK session.  A Server Action has no active user session, so any
 *     raw-fetch attempt to fn will be rejected with HTTP 401.
 *     Use callParseDocument / callReindexDocument from firebase-composition.ts
 *     (client-side callable helpers) instead.
 *
 *     queryDocuments was also removed for the same reason: Firestore Web SDK rules
 *     evaluate request.auth which is absent in a Server Action context.
 */

import { z } from "zod";
import { processSourceDocumentAction } from "./source-processing-actions";
import { createDatabaseAction } from "@/src/modules/notion/adapters/inbound/server-actions/database-actions";

// ── Input schemas ─────────────────────────────────────────────────────────────

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

// ── Actions ───────────────────────────────────────────────────────────────────

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

