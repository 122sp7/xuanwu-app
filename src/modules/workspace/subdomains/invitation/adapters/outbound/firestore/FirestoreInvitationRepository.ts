import type { InvitationRepository } from "../../../domain/repositories/InvitationRepository";
import type { WorkspaceInvitationSnapshot } from "../../../domain/entities/WorkspaceInvitation";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
}

export class FirestoreInvitationRepository implements InvitationRepository {
  private readonly collection = "workspace_invitations";

  constructor(private readonly db: FirestoreLike) {}

  async findById(invitationId: string): Promise<WorkspaceInvitationSnapshot | null> {
    const doc = await this.db.get(this.collection, invitationId);
    return doc ? (doc as unknown as WorkspaceInvitationSnapshot) : null;
  }

  async findByToken(token: string): Promise<WorkspaceInvitationSnapshot | null> {
    const docs = await this.db.query(this.collection, [{ field: "token", op: "==", value: token }]);
    return docs.length > 0 ? (docs[0] as unknown as WorkspaceInvitationSnapshot) : null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceInvitationSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "workspaceId", op: "==", value: workspaceId }]);
    return docs as unknown as WorkspaceInvitationSnapshot[];
  }

  async save(invitation: WorkspaceInvitationSnapshot): Promise<void> {
    await this.db.set(this.collection, invitation.id, invitation as unknown as Record<string, unknown>);
  }

  async delete(invitationId: string): Promise<void> {
    await this.db.delete(this.collection, invitationId);
  }
}
