import type { WorkspaceQualityCheckEntity } from "../../domain/entities/QualityCheck";
import { ListWorkspaceQualityChecksUseCase } from "../../application/use-cases/quality-check.use-cases";
import { FirebaseQualityCheckRepository } from "../../infrastructure/firebase/FirebaseQualityCheckRepository";

function createQualityCheckQueryUseCase() {
  const qualityCheckRepository = new FirebaseQualityCheckRepository();
  return new ListWorkspaceQualityChecksUseCase(qualityCheckRepository);
}

export async function getWorkspaceQualityChecks(
  workspaceId: string,
): Promise<WorkspaceQualityCheckEntity[]> {
  const listWorkspaceQualityChecksUseCase = createQualityCheckQueryUseCase();
  return listWorkspaceQualityChecksUseCase.execute(workspaceId);
}
