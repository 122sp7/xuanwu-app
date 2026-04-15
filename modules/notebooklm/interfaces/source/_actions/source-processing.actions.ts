"use server";

import type { CommandResult } from "@shared-types";

import { makeSourceUseCases } from "../composition/use-cases";
import type { SourceProcessingExecutionSummary } from "../../../subdomains/source/application/dto/source-processing.dto";

interface ConfirmedTaskInput {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}

interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

interface CreateTasksFromParsedSourceDocumentInput extends CreateKnowledgeDraftFromSourceDocumentInput {
  readonly confirmedTasks?: ReadonlyArray<ConfirmedTaskInput>;
}

interface PreviewTaskCandidatesFromParsedSourceDocumentInput {
  readonly knowledgePageId?: string;
  readonly jsonGcsUri: string;
}

interface ParseSourceDocumentActionInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

interface ReindexSourceDocumentActionInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

interface ProcessSourceDocumentWorkflowActionInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly shouldCreateTasks: boolean;
  readonly createdByUserId?: string | null;
}

export async function parseSourceDocument(
  input: ParseSourceDocumentActionInput,
) {
  return makeSourceUseCases().parseSourceDocument.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    documentId: input.sourceFileId,
    filename: input.filename,
    gcsUri: input.gcsUri,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });
}

export async function reindexSourceDocument(
  input: ReindexSourceDocumentActionInput,
) {
  return makeSourceUseCases().reindexSourceDocument.execute({
    accountId: input.accountId,
    workspaceId: input.workspaceId,
    documentId: input.sourceFileId,
    filename: input.filename,
    sourceGcsUri: input.sourceGcsUri,
    jsonGcsUri: input.jsonGcsUri,
    pageCount: input.pageCount,
  });
}

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
  return makeSourceUseCases().createKnowledgeDraftFromSource.execute(input);
}

export async function previewTaskCandidatesFromParsedSourceDocument(
  input: PreviewTaskCandidatesFromParsedSourceDocumentInput,
) {
  return makeSourceUseCases().previewTaskCandidatesFromSource.execute({
    knowledgePageId: input.knowledgePageId ?? "source-task-preview",
    jsonGcsUri: input.jsonGcsUri,
  });
}

export async function createTasksFromParsedSourceDocument(
  input: CreateTasksFromParsedSourceDocumentInput,
): Promise<CommandResult> {
  return makeSourceUseCases().createTasksFromSource.execute(input);
}

export async function processSourceDocumentWorkflow(
  input: ProcessSourceDocumentWorkflowActionInput,
): Promise<SourceProcessingExecutionSummary> {
  return makeSourceUseCases().processSourceDocumentWorkflow.execute(input);
}
