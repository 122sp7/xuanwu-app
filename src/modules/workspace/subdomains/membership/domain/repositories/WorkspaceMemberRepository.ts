import type { WorkspaceMemberSnapshot } from "../entities/WorkspaceMember";

export interface WorkspaceMemberRepository {
  findById(memberId: string): Promise<WorkspaceMemberSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberSnapshot[]>;
  findByActorAndWorkspace(actorId: string, workspaceId: string): Promise<WorkspaceMemberSnapshot | null>;
  save(member: WorkspaceMemberSnapshot): Promise<void>;
  delete(memberId: string): Promise<void>;
}
