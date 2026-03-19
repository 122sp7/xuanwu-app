import type { Request } from "../entities/Request";

export interface ScheduleMdddRequestRepository {
  findById(requestId: string): Promise<Request | null>;
  listByWorkspaceId(workspaceId: string): Promise<readonly Request[]>;
  save(request: Request): Promise<Request>;
}
