import type { ScheduleMdddFlowProjection } from "../value-objects/Projection";

export interface ScheduleMdddProjectionQueryRepository {
  findByRequestId(requestId: string): Promise<ScheduleMdddFlowProjection | null>;
  listByWorkspaceId(workspaceId: string): Promise<readonly ScheduleMdddFlowProjection[]>;
}
