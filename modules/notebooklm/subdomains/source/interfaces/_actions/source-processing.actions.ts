"use server";

import type { CommandResult } from "@shared-types";

import {
  makeKnowledgePageGateway,
  makeParsedDocumentAdapter,
  makeSourcePipelineAdapter,
  waitForParsedDocument,
} from "../../api/factories";
import type { SourceProcessingExecutionSummary } from "../../application/dto/source-processing.dto";
import { CreateKnowledgeDraftFromSourceUseCase } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";
import { ProcessSourceDocumentWorkflowUseCase } from "../../application/use-cases/process-source-document-workflow.use-case";
import {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "../../application/use-cases/source-pipeline.use-cases";

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
  readonly createdByUserId?: string | null;
}

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
  const useCase = new CreateKnowledgeDraftFromSourceUseCase(
    makeParsedDocumentAdapter(),
    makeKnowledgePageGateway(),
  );
  return useCase.execute(input);
}

export async function processSourceDocumentWorkflow(
  input: ProcessSourceDocumentWorkflowActionInput,
): Promise<SourceProcessingExecutionSummary> {
  const sourcePipelineAdapter = makeSourcePipelineAdapter();
  const workflowUseCase = new ProcessSourceDocumentWorkflowUseCase(
    new ParseSourceDocumentUseCase(sourcePipelineAdapter),
    new ReindexSourceDocumentUseCase(sourcePipelineAdapter),
    new CreateKnowledgeDraftFromSourceUseCase(
      makeParsedDocumentAdapter(),
      makeKnowledgePageGateway(),
    ),
    { waitForParsedDocument },
  );

  return workflowUseCase.execute(input);
}
