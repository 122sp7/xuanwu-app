import type { WorkspaceEntity } from "@/modules/workspace";

import { GetWorkspaceParserSummaryUseCase } from "../../application/use-cases/get-workspace-parser-summary.use-case";
import type { WorkspaceParserSummary } from "../../domain/entities/ParserSummary";
import { LegacyWorkspaceParserRepository } from "../../infrastructure/legacy/LegacyWorkspaceParserRepository";

export function getWorkspaceParserSignalSummary(
  workspace: WorkspaceEntity,
): WorkspaceParserSummary {
  const useCase = new GetWorkspaceParserSummaryUseCase(new LegacyWorkspaceParserRepository(workspace));
  return useCase.execute({ workspaceId: workspace.id });
}
