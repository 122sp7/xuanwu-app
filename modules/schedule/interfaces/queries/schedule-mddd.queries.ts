import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";
import { FirebaseMdddProjectionRepository } from "../../infrastructure/firebase/FirebaseMdddProjectionRepository";

const projectionRepository = new FirebaseMdddProjectionRepository();

export async function getScheduleMdddFlowProjection(
  requestId: string,
): Promise<ScheduleMdddFlowProjection | null> {
  return projectionRepository.findByRequestId(requestId);
}

export async function listWorkspaceScheduleMdddFlowProjections(
  workspaceId: string,
): Promise<readonly ScheduleMdddFlowProjection[]> {
  return projectionRepository.listByWorkspaceId(workspaceId);
}
