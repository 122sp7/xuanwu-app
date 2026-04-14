import type { CommandResult } from "@shared-types";

import type {
  ExtractTaskCandidatesInput,
  ExtractTaskCandidatesOutput,
  MaterializeKnowledgeTasksInput,
  TaskMaterializationWorkflowPort,
} from "../../../subdomains/source/domain/ports/TaskMaterializationWorkflowPort";

export class TaskMaterializationWorkflowAdapter implements TaskMaterializationWorkflowPort {
  constructor(
    private readonly deps: {
      extractTaskCandidates: (input: {
        knowledgePageId: string;
        blocks: ReadonlyArray<{
          blockId: string;
          text: string;
          pageIndex?: number;
        }>;
        enableAiFallback?: boolean;
      }) => Promise<{
        candidates: ReadonlyArray<{
          title: string;
          description?: string;
          dueDate?: string;
        }>;
        usedAiFallback: boolean;
      }>;
      approveKnowledgePage: (input: {
        accountId: string;
        pageId: string;
        actorId: string;
        workspaceId?: string;
        extractedTasks: {
          title: string;
          description?: string;
          dueDate?: string;
        }[];
        extractedInvoices: {
          amount: number;
          description: string;
          currency?: string;
        }[];
        causationId?: string;
        correlationId?: string;
      }) => Promise<CommandResult>;
    },
  ) {}

  async extractTaskCandidates(
    input: ExtractTaskCandidatesInput,
  ): Promise<ExtractTaskCandidatesOutput> {
    const result = await this.deps.extractTaskCandidates(input);
    return {
      candidates: result.candidates.map((candidate) => ({
        title: candidate.title,
        description: candidate.description,
        dueDate: candidate.dueDate,
      })),
      usedAiFallback: result.usedAiFallback,
    };
  }

  async materializeKnowledgeTasks(
    input: MaterializeKnowledgeTasksInput,
  ): Promise<CommandResult> {
    return this.deps.approveKnowledgePage({
      accountId: input.accountId,
      pageId: input.pageId,
      actorId: input.actorId,
      workspaceId: input.workspaceId,
      extractedTasks: input.extractedTasks.map((task) => ({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
      })),
      extractedInvoices: [],
    });
  }
}
