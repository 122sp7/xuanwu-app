import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { WorkspaceMemberRepository } from "../../domain/repositories/WorkspaceMemberRepository";
import { WorkspaceMember } from "../../domain/entities/WorkspaceMember";
import type { AddMemberInput, MemberRole } from "../../domain/entities/WorkspaceMember";

export class AddMemberUseCase {
  constructor(private readonly memberRepo: WorkspaceMemberRepository) {}

  async execute(input: AddMemberInput): Promise<CommandResult> {
    try {
      const member = WorkspaceMember.add(uuid(), input);
      await this.memberRepo.save(member.getSnapshot());
      return commandSuccess(member.id, Date.now());
    } catch (err) {
      return commandFailureFrom("MEMBERSHIP_ADD_FAILED", err instanceof Error ? err.message : "Failed to add member.");
    }
  }
}

export class ChangeMemberRoleUseCase {
  constructor(private readonly memberRepo: WorkspaceMemberRepository) {}

  async execute(memberId: string, role: MemberRole): Promise<CommandResult> {
    try {
      const snapshot = await this.memberRepo.findById(memberId);
      if (!snapshot) return commandFailureFrom("MEMBERSHIP_NOT_FOUND", "Member not found.");
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
  constructor(private readonly memberRepo: WorkspaceMemberRepository) {}

  async execute(memberId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.memberRepo.findById(memberId);
      if (!snapshot) return commandFailureFrom("MEMBERSHIP_NOT_FOUND", "Member not found.");
      const member = WorkspaceMember.reconstitute(snapshot);
      member.remove();
      await this.memberRepo.save(member.getSnapshot());
      return commandSuccess(memberId, Date.now());
    } catch (err) {
      return commandFailureFrom("MEMBERSHIP_REMOVE_FAILED", err instanceof Error ? err.message : "Failed to remove member.");
    }
  }
}
