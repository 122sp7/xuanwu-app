"use server";

/**
 * notebook-actions — notebooklm notebook + RAG server actions.
 */

import { z } from "zod";
import {
  callRagQuery,
  createClientNotebooklmNotebookUseCases,
} from "../../outbound/firebase-composition";

// ── Input schemas ─────────────────────────────────────────────────────────────

const CreateNotebookInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200),
});

const RagQueryInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  query: z.string().min(1).max(2000),
  topK: z.number().int().min(1).max(20).optional(),
});

const SynthesizeWorkspaceInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
});

// ── Actions ───────────────────────────────────────────────────────────────────

export async function createNotebookAction(rawInput: unknown) {
  const input = CreateNotebookInputSchema.parse(rawInput);
  const { createNotebook } = createClientNotebooklmNotebookUseCases(
    input.accountId,
    input.workspaceId,
  );
  return createNotebook.execute({
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    title: input.name,
  });
}

/**
 * ragQueryAction — RAG retrieval + generation via py_fn rag_query callable.
 * Returns AI-generated answer with source citations.
 */
export async function ragQueryAction(rawInput: unknown) {
  const input = RagQueryInputSchema.parse(rawInput);
  return callRagQuery({
    account_id: input.accountId,
    workspace_id: input.workspaceId,
    query: input.query,
    top_k: input.topK,
  });
}

/**
 * synthesizeWorkspaceAction — RAG synthesis across all workspace documents.
 * Uses a fixed synthesis prompt to summarise key themes.
 */
export async function synthesizeWorkspaceAction(rawInput: unknown) {
  const input = SynthesizeWorkspaceInputSchema.parse(rawInput);
  return callRagQuery({
    account_id: input.accountId,
    workspace_id: input.workspaceId,
    query: "請總結這個工作區所有文件的主要主題、關鍵發現與重要結論，並以結構化的方式呈現。",
    top_k: 20,
  });
}
