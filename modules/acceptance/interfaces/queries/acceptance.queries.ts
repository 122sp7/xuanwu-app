import type { WorkspaceEntity } from "@/modules/workspace";

import { ListWorkspaceAcceptanceGatesUseCase } from "../../application/use-cases/list-workspace-acceptance-gates.use-case";
import type { WorkspaceAcceptanceSummary } from "../../domain/entities/AcceptanceGate";
import { LegacyWorkspaceAcceptanceRepository } from "../../infrastructure/legacy/LegacyWorkspaceAcceptanceRepository";

export function getWorkspaceAcceptanceSummary(
  workspace: WorkspaceEntity,
): WorkspaceAcceptanceSummary {
  const useCase = new ListWorkspaceAcceptanceGatesUseCase(
    new LegacyWorkspaceAcceptanceRepository(workspace),
  );

  return useCase.execute({ workspaceId: workspace.id });
}
