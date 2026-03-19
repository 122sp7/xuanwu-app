import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";
import { FirebaseMdddProjectionRepository } from "../../infrastructure/firebase/FirebaseMdddProjectionRepository";

function createProjectionRepository() {
  return new FirebaseMdddProjectionRepository();
}

export async function getScheduleMdddFlowProjection(
  requestId: string,
): Promise<ScheduleMdddFlowProjection | null> {
  return createProjectionRepository().findByRequestId(requestId);
}

export async function listWorkspaceScheduleMdddFlowProjections(
  workspaceId: string,
): Promise<readonly ScheduleMdddFlowProjection[]> {
  return createProjectionRepository().listByWorkspaceId(workspaceId);
}
