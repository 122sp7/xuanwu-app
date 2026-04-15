import type { WorkspaceInvitationSnapshot } from "../entities/WorkspaceInvitation";

export interface InvitationRepository {
  findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]>;
  save(invitation: WorkspaceInvitationSnapshot): Promise<void>;
  delete(invitationId: string): Promise<void>;
}
