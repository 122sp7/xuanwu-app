import { UploadInitSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-init-source-file.use-case";
import { UploadCompleteSourceFileUseCase } from "../../../subdomains/source/application/use-cases/upload-complete-source-file.use-case";
import { ParseSourceDocumentUseCase, ReindexSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/source-pipeline.use-cases";
import { ProcessSourceDocumentWorkflowUseCase } from "../../../subdomains/source/application/use-cases/process-source-document-workflow.use-case";
import { RegisterUploadedRagDocumentUseCase } from "../../../subdomains/source/application/use-cases/register-rag-document.use-case";
import { RenameSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/rename-source-document.use-case";
import { DeleteSourceDocumentUseCase } from "../../../subdomains/source/application/use-cases/delete-source-document.use-case";
import { CreateKnowledgeDraftFromSourceUseCase, type KnowledgePageGateway } from "../../../subdomains/source/application/use-cases/create-knowledge-draft-from-source.use-case";
import { CreateTasksFromSourceUseCase } from "../../../subdomains/source/application/use-cases/create-tasks-from-source.use-case";
import { PreviewTaskCandidatesFromSourceUseCase } from "../../../subdomains/source/application/use-cases/preview-task-candidates-from-source.use-case";
import type { SourceFileRepository } from "../../../subdomains/source/domain/repositories/SourceFileRepository";
import type { RagDocumentRepository } from "../../../subdomains/source/domain/repositories/RagDocumentRepository";
import type { SourceDocumentCommandPort } from "../../../subdomains/source/domain/ports/SourceDocumentPort";
import type { SourcePipelinePort } from "../../../subdomains/source/domain/ports/SourcePipelinePort";
import type { ParsedDocumentPort } from "../../../subdomains/source/domain/ports/ParsedDocumentPort";
import type { TaskMaterializationWorkflowPort } from "../../../subdomains/source/domain/ports/TaskMaterializationWorkflowPort";
import type { ContentDistillationPort } from "../../../subdomains/source/domain/ports/ContentDistillationPort";
import { AiDistillationAdapter } from "../../../subdomains/source/infrastructure/ai/AiDistillationAdapter";
import {
  makeSourceFileAdapter,
  makeRagDocumentAdapter,
  makeSourceDocumentCommandAdapter,
  makeSourcePipelineAdapter,
  makeParsedDocumentAdapter,
  makeKnowledgePageGateway,
  makeTaskMaterializationWorkflowAdapter,
  waitForParsedDocument,
} from "./adapters";

export interface SourceUseCases {
  readonly uploadInitSourceFile: UploadInitSourceFileUseCase;
  readonly uploadCompleteSourceFile: UploadCompleteSourceFileUseCase;
  readonly parseSourceDocument: ParseSourceDocumentUseCase;
  readonly reindexSourceDocument: ReindexSourceDocumentUseCase;
  readonly processSourceDocumentWorkflow: ProcessSourceDocumentWorkflowUseCase;
  readonly registerUploadedRagDocument: RegisterUploadedRagDocumentUseCase;
  readonly renameSourceDocument: RenameSourceDocumentUseCase;
  readonly deleteSourceDocument: DeleteSourceDocumentUseCase;
  readonly createKnowledgeDraftFromSource: CreateKnowledgeDraftFromSourceUseCase;
  readonly previewTaskCandidatesFromSource: PreviewTaskCandidatesFromSourceUseCase;
  readonly createTasksFromSource: CreateTasksFromSourceUseCase;
}

interface ParsedDocumentStatusPort {
  waitForParsedDocument(
    accountId: string,
    documentId: string,
  ): Promise<{ pageCount: number; jsonGcsUri: string }>;
}

function makeParsedDocumentStatusPort(): ParsedDocumentStatusPort {
  return {
    waitForParsedDocument,
  };
}

export function makeSourceUseCases(
  fileRepository: SourceFileRepository = makeSourceFileAdapter(),
  ragDocumentRepository: RagDocumentRepository = makeRagDocumentAdapter(),
  documentCommandPort: SourceDocumentCommandPort = makeSourceDocumentCommandAdapter(),
  pipelinePort: SourcePipelinePort = makeSourcePipelineAdapter(),
  parsedDocumentPort: ParsedDocumentPort = makeParsedDocumentAdapter(),
  knowledgePageGateway: KnowledgePageGateway = makeKnowledgePageGateway(),
  taskWorkflowPort: TaskMaterializationWorkflowPort = makeTaskMaterializationWorkflowAdapter(),
  distillationPort: ContentDistillationPort = new AiDistillationAdapter(),
): SourceUseCases {
  const parseUseCase = new ParseSourceDocumentUseCase(pipelinePort);
  const reindexUseCase = new ReindexSourceDocumentUseCase(pipelinePort);
  const createDraftUseCase = new CreateKnowledgeDraftFromSourceUseCase(
    parsedDocumentPort,
    knowledgePageGateway,
    distillationPort,
  );

  return {
    uploadInitSourceFile: new UploadInitSourceFileUseCase(fileRepository),
    uploadCompleteSourceFile: new UploadCompleteSourceFileUseCase(
      fileRepository,
      ragDocumentRepository,
    ),
    parseSourceDocument: parseUseCase,
    reindexSourceDocument: reindexUseCase,
    processSourceDocumentWorkflow: new ProcessSourceDocumentWorkflowUseCase(
      parseUseCase,
      reindexUseCase,
      createDraftUseCase,
      makeParsedDocumentStatusPort(),
      parsedDocumentPort,
      taskWorkflowPort,
    ),
    registerUploadedRagDocument: new RegisterUploadedRagDocumentUseCase(ragDocumentRepository),
    renameSourceDocument: new RenameSourceDocumentUseCase(documentCommandPort),
    deleteSourceDocument: new DeleteSourceDocumentUseCase(documentCommandPort),
    createKnowledgeDraftFromSource: createDraftUseCase,
    previewTaskCandidatesFromSource: new PreviewTaskCandidatesFromSourceUseCase(
      parsedDocumentPort,
      taskWorkflowPort,
    ),
    createTasksFromSource: new CreateTasksFromSourceUseCase(
      createDraftUseCase,
      parsedDocumentPort,
      taskWorkflowPort,
    ),
  };
}
