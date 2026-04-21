"use server";

/**
 * source-processing-actions — notebooklm source document processing workflow.
 *
 * Composes ProcessSourceDocumentWorkflowUseCase with:
 *   - TaskMaterializationWorkflowAdapter  (ADR: synchronous Server Action bridge)
 *   - Notion CreateKnowledgePagePort       (bridges notion's createPage use case)
 *
 * ADR decisions implemented here:
 *   1. AI extraction → workspace.extract-task-candidates Genkit flow
 *      GenkitTaskCandidateExtractor is instantiated directly here because
 *      this is a "use server" file — it is never included in browser bundles.
 *      firebase-composition.ts retains FirebaseCallableTaskCandidateExtractor
 *      for the shared factory used by client-accessible code paths.
 *   2. Task bridge → synchronous Server Action callback (not QStash event).
 *
 * Architecture note: this server action is the composition root for a
 * cross-module workflow (notebooklm → workspace → notion). It reaches into
 * the workspace and notion composition factories to assemble the use case.
 * The domain layers remain fully isolated; only the adapter layer is composed here.
 */

import { z } from "zod";
import { ProcessSourceDocumentWorkflowUseCase } from "../../../orchestration/ProcessSourceDocumentWorkflowUseCase";
import { TaskMaterializationWorkflowAdapter } from "../../outbound/TaskMaterializationWorkflowAdapter";
import { GenkitTaskCandidateExtractor } from "@/src/modules/workspace/subdomains/task-formation/adapters/outbound/genkit/GenkitTaskCandidateExtractor";
import { ExtractTaskCandidatesUseCase, ConfirmCandidatesUseCase } from "@/src/modules/workspace/subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskFormationJobRepository } from "@/src/modules/workspace/subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { CreateTaskUseCase } from "@/src/modules/workspace/subdomains/task/application/use-cases/TaskUseCases";
import { FirestoreTaskRepository } from "@/src/modules/workspace/subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import { createFirestoreLikeAdapter } from "@/src/modules/workspace/adapters/outbound/firebase-composition";
import { createClientNotionPageUseCases } from "@/src/modules/notion/adapters/outbound/firebase-composition";
import type { ExtractedTaskCandidate } from "@/src/modules/workspace/subdomains/task-formation/domain/value-objects/TaskCandidate";

// ── Input schema ───────────────────────────────────────────────────────────────

const ProcessSourceDocumentInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  documentId: z.string().min(1),
  documentTitle: z.string().min(1).max(500),
  parsedTextSummary: z.string().optional(),
  shouldCreateRag: z.boolean(),
  shouldCreatePage: z.boolean(),
  shouldCreateTasks: z.boolean(),
  requestedByUserId: z.string().optional(),
});

// ── Action ─────────────────────────────────────────────────────────────────────

export async function processSourceDocumentAction(rawInput: unknown) {
  const input = ProcessSourceDocumentInputSchema.parse(rawInput);

  // ── Wire workspace task formation with Genkit extractor (server-only) ────────
  const db = createFirestoreLikeAdapter();
  const jobRepo = new FirestoreTaskFormationJobRepository(db);
  const taskRepo = new FirestoreTaskRepository(db);
  const createTaskUseCase = new CreateTaskUseCase(taskRepo);
  const extractor = new GenkitTaskCandidateExtractor();
  const extractTaskCandidatesUseCase = new ExtractTaskCandidatesUseCase(jobRepo, extractor);
  const confirmCandidatesUseCase = new ConfirmCandidatesUseCase(jobRepo, {
    createTask: (taskInput) => createTaskUseCase.execute(taskInput),
  });

  const taskAdapter = new TaskMaterializationWorkflowAdapter({
    run: async ({ sourceText, workspaceId, actorId, knowledgePageId }) => {
      const extractResult = await extractTaskCandidatesUseCase.execute({
        workspaceId,
        actorId,
        sourceType: "ai",
        sourcePageIds: [knowledgePageId],
        sourceText,
      });

      if (!extractResult.success) {
        return { taskCount: 0, error: extractResult.error.message };
      }

      const snapshot = await jobRepo.findById(extractResult.aggregateId);
      const allIndices = (snapshot?.candidates ?? []).map((_, i) => i);

      if (allIndices.length === 0) {
        return { taskCount: 0 };
      }

      const confirmResult = await confirmCandidatesUseCase.execute({
        jobId: extractResult.aggregateId,
        workspaceId,
        actorId,
        selectedIndices: allIndices,
      });

      return confirmResult.success
        ? { taskCount: allIndices.length }
        : { taskCount: 0, error: confirmResult.error.message };
    },
  });

  // ── Wire notion page creation ────────────────────────────────────────────────
  const { createPage } = createClientNotionPageUseCases();

  const pagePort = {
    createPage: async (pageInput: {
      accountId: string;
      workspaceId: string;
      title: string;
      sourceDocumentId: string;
      requestedByUserId?: string;
    }) => {
      const result = await createPage.execute({
        accountId: pageInput.accountId,
        workspaceId: pageInput.workspaceId,
        title: pageInput.title,
        createdByUserId: pageInput.requestedByUserId ?? "system",
      });

      if (!result.success) {
        return { ok: false as const, error: result.error.message };
      }

      return {
        ok: true as const,
        pageId: result.aggregateId,
        pageHref: `/${pageInput.accountId}/${pageInput.workspaceId}?tab=Pages`,
      };
    },
  };

  // ── Execute workflow ─────────────────────────────────────────────────────────
  const useCase = new ProcessSourceDocumentWorkflowUseCase(taskAdapter, pagePort);
  return useCase.execute(input);
}

// ── Extract tasks from document (no auto-confirm) ─────────────────────────────

const ExtractTasksFromDocumentInputSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().uuid(),
  documentId: z.string().min(1),
  documentTitle: z.string().min(1).max(500),
  actorId: z.string().min(1),
  parsedLayoutChunkCount: z.number().int().optional(),
  ragVectorCount: z.number().int().optional(),
});

/**
 * extractTasksFromDocumentAction — extract AI task candidates from a parsed document.
 *
 * Returns candidates for user review WITHOUT auto-confirming them.
 * The caller (NotebooklmSourcesSection) displays the candidates in a modal
 * and then calls confirmCandidatesAction with the selected indices.
 *
 * Uses GenkitTaskCandidateExtractor (same as processSourceDocumentAction).
 */
export async function extractTasksFromDocumentAction(rawInput: unknown): Promise<
  | { success: false; error: { code: string; message: string }; jobId: null; candidates: ExtractedTaskCandidate[] }
  | { success: true; jobId: string; candidates: ExtractedTaskCandidate[] }
> {
  const input = ExtractTasksFromDocumentInputSchema.parse(rawInput);

  // Build source context from available document metadata to guide AI extraction.
  const parts: string[] = [`文件名稱：${input.documentTitle}`];
  if (input.parsedLayoutChunkCount != null) {
    parts.push(`Layout Parser 分塊數：${input.parsedLayoutChunkCount}`);
  }
  if (input.ragVectorCount != null) {
    parts.push(`RAG 向量數：${input.ragVectorCount}`);
  }
  const sourceText = parts.join("\n");

  // Wire up Genkit-based task extraction (server-only — same infrastructure as processSourceDocumentAction).
  const db = createFirestoreLikeAdapter();
  const jobRepo = new FirestoreTaskFormationJobRepository(db);
  const extractor = new GenkitTaskCandidateExtractor();
  const extractUseCase = new ExtractTaskCandidatesUseCase(jobRepo, extractor);

  const result = await extractUseCase.execute({
    workspaceId: input.workspaceId,
    actorId: input.actorId,
    sourceType: "ai",
    sourcePageIds: [input.documentId],
    sourceText,
  });

  if (!result.success) {
    return { success: false, error: result.error, jobId: null, candidates: [] };
  }

  const snapshot = await jobRepo.findById(result.aggregateId);
  return {
    success: true,
    jobId: result.aggregateId,
    candidates: (snapshot?.candidates ?? []) as ExtractedTaskCandidate[],
  };
}
