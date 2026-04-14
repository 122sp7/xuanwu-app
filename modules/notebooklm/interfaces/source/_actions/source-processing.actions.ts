"use server";

import type { CommandResult } from "@shared-types";

import { makeSourceUseCases } from "../composition/use-cases";
import type { SourceProcessingExecutionSummary } from "../../../subdomains/source/application/dto/source-processing.dto";

interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
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

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
  return makeSourceUseCases().createKnowledgeDraftFromSource.execute(input);
}

export async function processSourceDocumentWorkflow(
  input: ProcessSourceDocumentWorkflowActionInput,
): Promise<SourceProcessingExecutionSummary> {
  return makeSourceUseCases().processSourceDocumentWorkflow.execute(input);
}
