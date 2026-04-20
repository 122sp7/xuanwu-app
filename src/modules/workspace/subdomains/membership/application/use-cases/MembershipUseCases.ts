import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceMember } from "../../domain/entities/WorkspaceMember";
import type { AddMemberInput, MemberRole } from "../../domain/entities/WorkspaceMember";
import type { PermissionCheckPort } from "../ports/PermissionCheckPort";

export class AddMemberUseCase {
  constructor(
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly permissionCheck: PermissionCheckPort,
  ) {}

  async execute(actorId: string, input: AddMemberInput): Promise<CommandResult> {
    try {
      const canAdd = await this.permissionCheck.can({
        actorId,
        workspaceId: input.workspaceId,
        action: "workspace.membership.add",
        nextRole: input.role,
      });
      if (!canAdd) {
        return commandFailureFrom("MEMBERSHIP_FORBIDDEN", "Not allowed to add workspace members.");
      }

      const member = WorkspaceMember.add(uuid(), input);
      await this.memberRepo.save(member.getSnapshot());
      return commandSuccess(member.id, Date.now());
    } catch (err) {
      return commandFailureFrom("MEMBERSHIP_ADD_FAILED", err instanceof Error ? err.message : "Failed to add member.");
    }
  }
}

export class ChangeMemberRoleUseCase {
  constructor(
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly permissionCheck: PermissionCheckPort,
  ) {}

  async execute(actorId: string, memberId: string, role: MemberRole): Promise<CommandResult> {
    try {
      const snapshot = await this.memberRepo.findById(memberId);
      if (!snapshot) return commandFailureFrom("MEMBERSHIP_NOT_FOUND", "Member not found.");

      const canChangeRole = await this.permissionCheck.can({
        actorId,
        workspaceId: snapshot.workspaceId,
        action: "workspace.membership.change_role",
        targetMemberRole: snapshot.role,
        nextRole: role,
      });
      if (!canChangeRole) {
        return commandFailureFrom("MEMBERSHIP_FORBIDDEN", "Not allowed to change member role.");
      }

      const member = WorkspaceMember.reconstitute(snapshot);
      member.changeRole(role);
      await this.memberRepo.save(member.getSnapshot());
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("MEMBERSHIP_ROLE_CHANGE_FAILED", err instanceof Error ? err.message : "Failed to change role.");
    }
  }
}

export class RemoveMemberUseCase {
  constructor(
    private readonly memberRepo: WorkspaceMemberRepository,
    private readonly permissionCheck: PermissionCheckPort,
  ) {}

  async execute(actorId: string, memberId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.memberRepo.findById(memberId);
      if (!snapshot) return commandFailureFrom("MEMBERSHIP_NOT_FOUND", "Member not found.");

      const canRemove = await this.permissionCheck.can({
        actorId,
        workspaceId: snapshot.workspaceId,
        action: "workspace.membership.remove",
        targetMemberRole: snapshot.role,
      });
      if (!canRemove) {
        return commandFailureFrom("MEMBERSHIP_FORBIDDEN", "Not allowed to remove member.");
      }

      const member = WorkspaceMember.reconstitute(snapshot);
      member.remove();
      await this.memberRepo.save(member.getSnapshot());
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("MEMBERSHIP_REMOVE_FAILED", err instanceof Error ? err.message : "Failed to remove member.");
    }
  }
}

export class ListWorkspaceMembersUseCase {
  constructor(private readonly memberRepo: WorkspaceMemberRepository) {}

  async execute(workspaceId: string) {
    return this.memberRepo.findByWorkspaceId(workspaceId);
  }
}
