import type { CommandResult } from "@shared-types";

export interface ParsedKnowledgeTaskBlock {
  readonly blockId: string;
  readonly text: string;
  readonly pageIndex?: number;
}

export interface ExtractedKnowledgeTask {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}

export interface ExtractTaskCandidatesInput {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<ParsedKnowledgeTaskBlock>;
  readonly enableAiFallback?: boolean;
  readonly sourceContext?: {
    readonly filename?: string;
    readonly mimeType?: string;
    readonly pageCount?: number;
    readonly sourceGcsUri?: string;
    readonly jsonGcsUri?: string;
  };
}

export interface ExtractTaskCandidatesOutput {
  readonly candidates: ReadonlyArray<ExtractedKnowledgeTask>;
  readonly usedAiFallback: boolean;
}

export interface MaterializeKnowledgeTasksInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly pageId: string;
  readonly actorId: string;
  readonly extractedTasks: ReadonlyArray<ExtractedKnowledgeTask>;
}

export interface TaskMaterializationWorkflowPort {
  extractTaskCandidates(
    input: ExtractTaskCandidatesInput,
  ): Promise<ExtractTaskCandidatesOutput>;

  materializeKnowledgeTasks(
    input: MaterializeKnowledgeTasksInput,
  ): Promise<CommandResult>;
}
