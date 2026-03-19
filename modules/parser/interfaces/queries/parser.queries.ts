import { getWorkspaceFiles } from "@/modules/file/interfaces/queries/file.queries";
import type { WorkspaceEntity } from "@/modules/workspace";

import { GetWorkspaceParserSummaryUseCase } from "../../application/use-cases/get-workspace-parser-summary.use-case";
import type { WorkspaceParserSummary } from "../../domain/entities/ParserSummary";
import { DefaultWorkspaceParserRepository } from "../../infrastructure/default/DefaultWorkspaceParserRepository";

export async function getWorkspaceParserSignalSummary(
  workspace: WorkspaceEntity,
): Promise<WorkspaceParserSummary> {
  const files = await getWorkspaceFiles(workspace);
  const useCase = new GetWorkspaceParserSummaryUseCase(
    new DefaultWorkspaceParserRepository(workspace, files),
  );

  return await useCase.execute({ workspaceId: workspace.id });
}
