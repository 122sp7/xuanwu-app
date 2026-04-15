import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { InvitationRepository } from "../../domain/repositories/InvitationRepository";
import { WorkspaceInvitation } from "../../domain/entities/WorkspaceInvitation";
import type { CreateInvitationInput } from "../../domain/entities/WorkspaceInvitation";

export class CreateInvitationUseCase {
  constructor(private readonly invitationRepo: InvitationRepository) {}

  async execute(input: CreateInvitationInput): Promise<CommandResult> {
    try {
      const invitation = WorkspaceInvitation.create(uuid(), input);
      await this.invitationRepo.save(invitation.getSnapshot());
      return commandSuccess(invitation.id, Date.now());
    } catch (err) {
      return commandFailureFrom("INVITATION_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create invitation.");
    }
  }
}

export class AcceptInvitationUseCase {
  constructor(private readonly invitationRepo: InvitationRepository) {}

  async execute(token: string): Promise<CommandResult> {
    try {
      const snapshot = await this.invitationRepo.findByToken(token);
      if (!snapshot) return commandFailureFrom("INVITATION_NOT_FOUND", "Invitation not found.");
      const invitation = WorkspaceInvitation.reconstitute(snapshot);
      invitation.accept();
      await this.invitationRepo.save(invitation.getSnapshot());
      return commandSuccess(snapshot.id, Date.now());
    } catch (err) {
      return commandFailureFrom("INVITATION_ACCEPT_FAILED", err instanceof Error ? err.message : "Failed to accept invitation.");
    }
  }
}

export class CancelInvitationUseCase {
  constructor(private readonly invitationRepo: InvitationRepository) {}

  async execute(invitationId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.invitationRepo.findById(invitationId);
      if (!snapshot) return commandFailureFrom("INVITATION_NOT_FOUND", "Invitation not found.");
      const invitation = WorkspaceInvitation.reconstitute(snapshot);
      invitation.cancel();
      await this.invitationRepo.save(invitation.getSnapshot());
      return commandSuccess(invitationId, Date.now());
    } catch (err) {
      return commandFailureFrom("INVITATION_CANCEL_FAILED", err instanceof Error ? err.message : "Failed to cancel invitation.");
    }
  }
}
