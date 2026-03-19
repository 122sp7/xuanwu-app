import { getWorkspaceFiles } from "@/modules/file";
import {
  DefaultWorkspaceParserRepository,
  GetWorkspaceParserSummaryUseCase,
  type WorkspaceParserSummary,
} from "@/modules/parser";
import type { WorkspaceEntity } from "@/modules/workspace";

import { GetWorkspaceKnowledgeSummaryUseCase } from "../../application/use-cases/get-workspace-knowledge-summary.use-case";
import type { WorkspaceKnowledgeSummary } from "../../domain/entities/KnowledgeSummary";
import { DefaultWorkspaceKnowledgeRepository } from "../../infrastructure/default/DefaultWorkspaceKnowledgeRepository";

export async function getWorkspaceKnowledgeSummary(
  workspace: WorkspaceEntity,
): Promise<WorkspaceKnowledgeSummary> {
  const files = await getWorkspaceFiles(workspace);
  const parserSummary: WorkspaceParserSummary = new GetWorkspaceParserSummaryUseCase(
    new DefaultWorkspaceParserRepository(workspace, files),
  ).execute({
    workspaceId: workspace.id,
  });

  return new GetWorkspaceKnowledgeSummaryUseCase(
    new DefaultWorkspaceKnowledgeRepository(workspace, files, parserSummary),
  ).execute({
    workspaceId: workspace.id,
  });
}
