import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";
import { FirebaseMdddProjectionRepository } from "../../infrastructure/firebase/FirebaseMdddProjectionRepository";

export async function getScheduleMdddFlowProjection(
  requestId: string,
): Promise<ScheduleMdddFlowProjection | null> {
  const projectionRepository = new FirebaseMdddProjectionRepository();
  return projectionRepository.findByRequestId(requestId);
}

export async function listWorkspaceScheduleMdddFlowProjections(
  workspaceId: string,
): Promise<readonly ScheduleMdddFlowProjection[]> {
  const projectionRepository = new FirebaseMdddProjectionRepository();
  return projectionRepository.listByWorkspaceId(workspaceId);
}
