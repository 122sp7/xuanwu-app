import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@shared-types";

import type { ParsedDocumentPort } from "../../domain/ports/ParsedDocumentPort";
import type {
  ExtractedKnowledgeTask,
  ParsedKnowledgeTaskBlock,
  TaskMaterializationWorkflowPort,
} from "../../domain/ports/TaskMaterializationWorkflowPort";
import type {
  CreateKnowledgeDraftInput,
  CreateKnowledgeDraftFromSourceUseCase,
} from "./create-knowledge-draft-from-source.use-case";

function toTaskBlocks(parsedText: string): ReadonlyArray<ParsedKnowledgeTaskBlock> {
  return parsedText
    .split(/\r?\n+/)
    .map((text, index) => ({
      blockId: `block-${index + 1}`,
      text: text.trim(),
      pageIndex: 1,
    }))
    .filter((block) => block.text.length > 0);
}

export interface CreateTasksFromSourceInput extends CreateKnowledgeDraftInput {
  readonly confirmedTasks?: ReadonlyArray<ExtractedKnowledgeTask>;
}

export class CreateTasksFromSourceUseCase {
  constructor(
    private readonly createDraftUseCase: CreateKnowledgeDraftFromSourceUseCase,
    private readonly parsedDocumentPort: ParsedDocumentPort,
    private readonly taskWorkflowPort: TaskMaterializationWorkflowPort,
  ) {}

  async execute(input: CreateTasksFromSourceInput): Promise<CommandResult> {
    if (!input.accountId.trim() || !input.workspaceId.trim() || !input.createdByUserId.trim()) {
      return commandFailureFrom(
        "SOURCE_TASK_CREATE_INVALID_SCOPE",
        "accountId、workspaceId、createdByUserId 為必填。",
      );
    }

    if (!input.jsonGcsUri.trim()) {
      return commandFailureFrom(
        "SOURCE_TASK_CREATE_JSON_REQUIRED",
        "需要先完成 OCR 解析，才能建立任務。",
      );
    }

    const pageResult = await this.createDraftUseCase.execute(input);
    if (!pageResult.success) {
      return pageResult;
    }

    try {
      const confirmedTasks = input.confirmedTasks?.filter((task) => task.title.trim()) ?? [];

      if (confirmedTasks.length > 0) {
        return this.taskWorkflowPort.materializeKnowledgeTasks({
          accountId: input.accountId,
          workspaceId: input.workspaceId,
          pageId: pageResult.aggregateId,
          actorId: input.createdByUserId,
          extractedTasks: confirmedTasks,
        });
      }

      const parsedText = await this.parsedDocumentPort.loadParsedDocumentText(input.jsonGcsUri);
      const blocks = toTaskBlocks(parsedText);

      if (blocks.length === 0) {
        return commandSuccess(pageResult.aggregateId, pageResult.version);
      }

      const extraction = await this.taskWorkflowPort.extractTaskCandidates({
        knowledgePageId: pageResult.aggregateId,
        blocks,
        enableAiFallback: true,
        sourceContext: {
          filename: input.filename,
          pageCount: input.pageCount,
          sourceGcsUri: input.sourceGcsUri,
          jsonGcsUri: input.jsonGcsUri,
        },
      });

      if (extraction.candidates.length === 0) {
        return commandSuccess(pageResult.aggregateId, pageResult.version);
      }

      return this.taskWorkflowPort.materializeKnowledgeTasks({
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        pageId: pageResult.aggregateId,
        actorId: input.createdByUserId,
        extractedTasks: extraction.candidates,
      });
    } catch (error) {
      return commandFailureFrom(
        "SOURCE_TASK_CREATE_FAILED",
        error instanceof Error ? error.message : "從解析結果建立任務失敗。",
      );
    }
  }
}
